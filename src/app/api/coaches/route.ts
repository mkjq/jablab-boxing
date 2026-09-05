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
