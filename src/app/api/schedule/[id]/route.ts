import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    const updated = await prisma.classSession.update({
      where: { id },
      data: {
        day: body.day,
        time: body.time,
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        category: body.category,
        levelEn: body.levelEn,
        levelAr: body.levelAr,
        coachId: body.coachId,
      },
    });
    
    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error("Schedule PUT error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.classSession.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Schedule DELETE error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
