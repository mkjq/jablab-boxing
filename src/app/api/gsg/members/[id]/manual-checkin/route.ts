import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }

    const member = await prisma.member.findUnique({
      where: { id: params.id },
    });

    if (!member) {
      return NextResponse.json({ success: false, error: "اللاعب غير موجود" }, { status: 404 });
    }

    // Create checkin with source MANUAL_CAPTAIN
    const checkIn = await prisma.memberCheckIn.create({
      data: {
        memberId: member.id,
        source: "MANUAL_CAPTAIN",
      },
    });

    // Increment count
    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        totalCheckIns: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الحصة يدوياً بنجاح بواسطة الكابتن 🥊",
      member: updated,
      checkIn,
    });
  } catch (error) {
    console.error("Manual Checkin error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
