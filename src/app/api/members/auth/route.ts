import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setMemberSession, getMemberSession, logoutMember } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function normalizePhone(phone: string): string {
  // Clean phone number: remove spaces, dashes, parentheses
  return phone.replace(/[\s\-\(\)]/g, "").trim();
}

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
    const { name, phone, email } = body;

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: "رقم الهاتف مطلوب لإتمام التسجيل" },
        { status: 400 }
      );
    }

    const cleanPhone = normalizePhone(phone);
    if (cleanPhone.length < 6) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال رقم هاتف صحيح" },
        { status: 400 }
      );
    }

    // Check if member already exists
    let member = await prisma.member.findUnique({
      where: { phone: cleanPhone },
    });

    let isNew = false;

    if (member) {
      // Existing member logging in
      // If a new name is provided, we can update it if existing was shorter or different
      if (name && name.trim() && name.trim() !== member.name) {
        member = await prisma.member.update({
          where: { id: member.id },
          data: {
            name: name.trim(),
            ...(email && email.trim() ? { email: email.trim().toLowerCase() } : {}),
          },
        });
      } else if (email && email.trim() && !member.email) {
        member = await prisma.member.update({
          where: { id: member.id },
          data: { email: email.trim().toLowerCase() },
        });
      }
    } else {
      // New member registering
      if (!name || typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { success: false, error: "يرجى كتابة اسمك الكريم لإنشاء الحساب" },
          { status: 400 }
        );
      }

      isNew = true;
      member = await prisma.member.create({
        data: {
          name: name.trim(),
          phone: cleanPhone,
          email: email && email.trim() ? email.trim().toLowerCase() : null,
          totalCheckIns: 0,
        },
      });
    }

    // Save session in cookie (valid for 90 days)
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
