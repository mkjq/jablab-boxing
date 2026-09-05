import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { coaches as defaultCoaches } from "@/data/coaches";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let coaches = await prisma.coach.findMany({
      orderBy: { order: "asc" },
    });

    if (coaches.length === 0) {
      for (let i = 0; i < defaultCoaches.length; i++) {
        const c = defaultCoaches[i];
        await prisma.coach.create({
          data: {
            id: c.id,
            nameAr: c.nameAr,
            nameEn: c.nameEn,
            titleAr: c.titleAr || "",
            titleEn: c.titleEn || "",
            roleAr: c.roleAr,
            roleEn: c.roleEn,
            posterSubtitleAr: c.posterSubtitleAr || "",
            image: c.image,
            badgeAr: c.badgeAr,
            badgeEn: c.badgeEn || "",
            specialtiesAr: JSON.stringify(c.specialtiesAr || []),
            specialtiesEn: JSON.stringify(c.specialtiesEn || []),
            instagram: c.instagram || "",
            instagramUrl: c.instagramUrl || "",
            whatsappMessage: c.whatsappMessage || "",
            whatsappMessageAr: c.whatsappMessageAr || "",
            order: i,
          },
        });
      }
      coaches = await prisma.coach.findMany({
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ success: true, coaches });
  } catch (error) {
    console.error("Coaches API error:", error);
    return NextResponse.json({ success: false, coaches: [], error: String(error) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCoach = await prisma.coach.create({
      data: {
        nameAr: body.nameAr || "",
        nameEn: body.nameEn || "",
        titleAr: body.titleAr || "",
        titleEn: body.titleEn || "",
        roleAr: body.roleAr || "",
        roleEn: body.roleEn || "",
        posterSubtitleAr: body.posterSubtitleAr || "",
        image: body.image || "/images/coaches/default.png",
        badgeAr: body.badgeAr || "",
        badgeEn: body.badgeEn || "",
        specialtiesAr: typeof body.specialtiesAr === 'string' ? body.specialtiesAr : JSON.stringify(body.specialtiesAr || []),
        specialtiesEn: typeof body.specialtiesEn === 'string' ? body.specialtiesEn : JSON.stringify(body.specialtiesEn || []),
        instagram: body.instagram || "",
        instagramUrl: body.instagramUrl || "",
        whatsappMessage: body.whatsappMessage || "",
        whatsappMessageAr: body.whatsappMessageAr || "",
        imagePosition: body.imagePosition || "center top",
        imageScale: body.imageScale ?? 1.0,
        order: body.order || 0,
      },
    });
    return NextResponse.json({ success: true, coach: newCoach });
  } catch (error) {
    console.error("Coach POST error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
