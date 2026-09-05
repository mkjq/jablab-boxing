import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const schedule = await prisma.classSession.findMany({
      include: { coach: true },
      orderBy: [
        { day: "asc" },
        { time: "asc" },
      ]
    });
    return NextResponse.json({ success: true, schedule });
  } catch (error) {
    console.error("Schedule GET error:", error);
    return NextResponse.json({ success: false, schedule: [], error: String(error) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newSession = await prisma.classSession.create({
      data: {
        day: body.day || "sat",
        time: body.time || "",
        titleEn: body.titleEn || "",
        titleAr: body.titleAr || "",
        category: body.category || "",
        levelEn: body.levelEn || "",
        levelAr: body.levelAr || "",
        coachId: body.coachId,
      },
    });
    return NextResponse.json({ success: true, session: newSession });
  } catch (error) {
    console.error("Schedule POST error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
