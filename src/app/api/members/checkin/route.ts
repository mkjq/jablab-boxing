import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMemberSession } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getMemberSession();
    if (!session || !session.memberId) {
      return NextResponse.json(
        {
          success: false,
          requiresLogin: true,
          error: "يجب تسجيل الدخول أو إنشاء حساب أولاً لاحتساب الحصة",
        },
        { status: 401 }
      );
    }

    const member = await prisma.member.findUnique({
      where: { id: session.memberId },
      include: {
        checkIns: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          requiresLogin: true,
          error: "لم يتم العثور على حساب العضو، يرجى التسجيل من جديد",
        },
        { status: 404 }
      );
    }

    // Check if player checked in in the last 20 minutes (1200000 ms) to avoid duplicate counts on page refresh
    const lastCheckIn = member.checkIns[0];
    if (lastCheckIn) {
      const lastCheckInTime = new Date(lastCheckIn.createdAt).getTime();
      const now = Date.now();
      const diffMinutes = Math.floor((now - lastCheckInTime) / (1000 * 60));

      if (diffMinutes < 20) {
        return NextResponse.json({
          success: true,
          alreadyCheckedIn: true,
          message: `تم احتساب حضورك مسبقاً قبل ${diffMinutes === 0 ? "لحظات" : `${diffMinutes} دقيقة`}! 🥊`,
          member: {
            id: member.id,
            name: member.name,
            phone: member.phone,
            totalCheckIns: member.totalCheckIns,
          },
          checkIn: lastCheckIn,
        });
      }
    }

    // Record new check-in
    const newCheckIn = await prisma.memberCheckIn.create({
      data: {
        memberId: member.id,
        source: "QR_CODE",
      },
    });

    // Increment member total sessions
    const updatedMember = await prisma.member.update({
      where: { id: member.id },
      data: {
        totalCheckIns: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      alreadyCheckedIn: false,
      message: "تم حساب الحصة في النادي بنجاح 🥊",
      member: {
        id: updatedMember.id,
        name: updatedMember.name,
        phone: updatedMember.phone,
        totalCheckIns: updatedMember.totalCheckIns,
      },
      checkIn: newCheckIn,
    });
  } catch (error) {
    console.error("Check-in API error:", error);
    return NextResponse.json(
      { success: false, error: "تعذر تسجيل الحصة حالياً، يرجى إعادة المحاولة" },
      { status: 500 }
    );
  }
}
