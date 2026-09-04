import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
