import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (session?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتعديل المستخدمين" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const updateData: any = {};
    if (body.username) updateData.username = body.username;
    if (body.role) updateData.role = body.role;
    if (body.password && body.password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(body.password, 10);
    }

    const updated = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, role: true, createdAt: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (session?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "غير مصرح لك بحذف المستخدمين" }, { status: 403 });
    }

    const { id } = params;
    if (session.userId === id) {
      return NextResponse.json({ success: false, error: "لا يمكنك حذف حسابك الشخصي الحالي!" }, { status: 400 });
    }

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
