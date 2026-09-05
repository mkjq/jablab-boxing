import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, setSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, error: "غير مسجل الدخول" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.userId },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: admin });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, error: "غير مسجل الدخول" }, { status: 401 });
    }

    const { username, password } = await req.json();
    const admin = await prisma.admin.findUnique({
      where: { id: session.userId },
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: "الحساب غير موجود" }, { status: 404 });
    }

    const updateData: any = {};

    if (username && username.trim() !== "" && username.trim() !== admin.username) {
      const existing = await prisma.admin.findUnique({
        where: { username: username.trim() },
      });
      if (existing && existing.id !== admin.id) {
        return NextResponse.json({ success: false, error: "اسم المستخدم هذا مستخدم بالفعل من قبل شخص آخر" }, { status: 400 });
      }
      updateData.username = username.trim();
    }

    if (password && password.trim() !== "") {
      if (password.length < 4) {
        return NextResponse.json({ success: false, error: "كلمة المرور يجب أن لا تقل عن 4 خانات" }, { status: 400 });
      }
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true, message: "لم يتم إجراء أي تغييرات" });
    }

    const updated = await prisma.admin.update({
      where: { id: admin.id },
      data: updateData,
      select: { id: true, username: true, role: true },
    });

    // Refresh session cookie
    await setSession(updated.id, updated.role);

    return NextResponse.json({
      success: true,
      message: "تم تحديث بيانات الحساب بنجاح!",
      user: updated,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
