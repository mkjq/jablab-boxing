import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updated = await prisma.coach.update({
      where: { id },
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        roleAr: body.roleAr,
        roleEn: body.roleEn,
        posterSubtitleAr: body.posterSubtitleAr,
        image: body.image,
        badgeAr: body.badgeAr,
        badgeEn: body.badgeEn,
        specialtiesAr: typeof body.specialtiesAr === 'string' ? body.specialtiesAr : JSON.stringify(body.specialtiesAr || []),
        specialtiesEn: typeof body.specialtiesEn === 'string' ? body.specialtiesEn : JSON.stringify(body.specialtiesEn || []),
        instagram: body.instagram,
        instagramUrl: body.instagramUrl,
        whatsappMessage: body.whatsappMessage,
        whatsappMessageAr: body.whatsappMessageAr,
        imagePosition: body.imagePosition,
        imageScale: body.imageScale,
        order: body.order,
      },
    });

    return NextResponse.json({ success: true, coach: updated });
  } catch (error) {
    console.error("Coach PUT error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // First delete any associated class sessions if any
    await prisma.classSession.deleteMany({
      where: { coachId: id },
    });
    
    await prisma.coach.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Coach DELETE error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
