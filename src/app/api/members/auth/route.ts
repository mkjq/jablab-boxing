import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setMemberSession, getMemberSession, logoutMember } from "@/lib/auth";
import { validateAndFormatJordanianPhone } from "@/lib/phone";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getMemberSession();
    if (!session || !session.memberId) {
      return NextResponse.json({ authenticated: false, member: null });
    }

    const member = await prisma.member.findUnique({
      where: { id: session.memberId },
      include: {
        checkIns: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!member) {
      await logoutMember();
      return NextResponse.json({ authenticated: false, member: null });
    }

    return NextResponse.json({
      authenticated: true,
      member: {
        id: member.id,
        name: member.name,
        phone: member.phone,
        email: member.email,
        totalCheckIns: member.totalCheckIns,
        createdAt: member.createdAt,
        recentCheckIns: member.checkIns,
      },
    });
  } catch (error) {
    console.error("Member Auth GET error:", error);
    return NextResponse.json({ authenticated: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, name, phone, email } = body;

    // Validate phone number as strict Jordanian mobile number
    const phoneValidation = validateAndFormatJordanianPhone(phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error || "يرجى إدخال رقم هاتف أردني صحيح" },
        { status: 400 }
      );
    }

    const cleanJordanPhone = phoneValidation.phone; // e.g. +962791234567

    // --- Mode 1: LOGIN (المشترك لديه حساب مسبقاً) ---
    if (mode === "login") {
      const member = await prisma.member.findUnique({
        where: { phone: cleanJordanPhone },
      });

      if (!member) {
        return NextResponse.json(
          {
            success: false,
            notFound: true,
            error: "رقم الهاتف هذا غير مسجل في النادي. يرجى الضغط على تبويب 'إنشاء حساب جديد' لإتمام التسجيل لأول مرة.",
          },
          { status: 404 }
        );
      }

      await setMemberSession({
        id: member.id,
        name: member.name,
        phone: member.phone,
        email: member.email,
      });

      return NextResponse.json({
        success: true,
        isNew: false,
        member: {
          id: member.id,
          name: member.name,
          phone: member.phone,
          email: member.email,
          totalCheckIns: member.totalCheckIns,
        },
      });
    }

    // --- Mode 2: REGISTER (مشترك جديد يسجل لأول مرة) ---
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "يرجى كتابة اسمك الكريم لإنشاء الحساب" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "الاسم قصير جداً، يرجى كتابة اسمك الكامل" },
        { status: 400 }
      );
    }

    let member = await prisma.member.findUnique({
      where: { phone: cleanJordanPhone },
    });

    let isNew = false;

    if (member) {
      // If phone already registered, update name or email if provided
      member = await prisma.member.update({
        where: { id: member.id },
        data: {
          name: name.trim(),
          ...(email && email.trim() ? { email: email.trim().toLowerCase() } : {}),
        },
      });
    } else {
      isNew = true;
      member = await prisma.member.create({
        data: {
          name: name.trim(),
          phone: cleanJordanPhone,
          email: email && email.trim() ? email.trim().toLowerCase() : null,
          totalCheckIns: 0,
        },
      });
    }

    await setMemberSession({
      id: member.id,
      name: member.name,
      phone: member.phone,
      email: member.email,
    });

    return NextResponse.json({
      success: true,
      isNew,
      member: {
        id: member.id,
        name: member.name,
        phone: member.phone,
        email: member.email,
        totalCheckIns: member.totalCheckIns,
      },
    });
  } catch (error) {
    console.error("Member Auth POST error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء معالجة البيانات، يرجى المحاولة ثانية" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await logoutMember();
  return NextResponse.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
}
