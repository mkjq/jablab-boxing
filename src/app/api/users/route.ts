import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (session?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 403 });
    }

    const users = await prisma.admin.findMany({
      select: { id: true, username: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (session?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "غير مصرح لك بإضافة مستخدمين" }, { status: 403 });
    }

    const { username, password, role } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, error: "يجب إدخال اسم المستخدم وكلمة المرور" }, { status: 400 });
    }

    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ success: false, error: "اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.admin.create({
      data: {
        username,
        passwordHash,
        role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "EDITOR",
      },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
