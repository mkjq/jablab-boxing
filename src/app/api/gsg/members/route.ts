import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, "").trim();
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const members = await prisma.member.findMany({
      where: whereClause,
      include: {
        checkIns: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { checkIns: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute metrics
    const totalMembers = await prisma.member.count();
    const totalCheckInsCount = await prisma.memberCheckIn.count();

    // Check-ins today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayCheckIns = await prisma.memberCheckIn.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    });

    const formattedMembers = members.map((m) => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email,
      totalCheckIns: m.totalCheckIns,
      actualCheckInsCount: m._count.checkIns,
      lastCheckIn: m.checkIns[0]?.createdAt || null,
      createdAt: m.createdAt,
    }));

    return NextResponse.json({
      success: true,
      members: formattedMembers,
      stats: {
        totalMembers,
        totalCheckIns: totalCheckInsCount,
        todayCheckIns,
      },
    });
  } catch (error) {
    console.error("GSG Members GET error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }

    const { name, phone, email, initialCheckIns } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "اسم اللاعب مطلوب" }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ success: false, error: "رقم الهاتف مطلوب" }, { status: 400 });
    }

    const cleanPhone = normalizePhone(phone);

    const existing = await prisma.member.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "رقم الهاتف مسجل مسبقاً للاعب آخر" },
        { status: 400 }
      );
    }

    const initialCount = parseInt(initialCheckIns, 10) || 0;

    const newMember = await prisma.member.create({
      data: {
        name: name.trim(),
        phone: cleanPhone,
        email: email && email.trim() ? email.trim().toLowerCase() : null,
        totalCheckIns: initialCount,
      },
    });

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    console.error("GSG Members POST error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
