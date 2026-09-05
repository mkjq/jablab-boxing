import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clubInfo } from "@/data/clubData";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let amenities = await prisma.amenity.findMany({
      orderBy: { order: "asc" },
    });

    if (amenities.length === 0) {
      for (let i = 0; i < clubInfo.amenities.length; i++) {
        const a = clubInfo.amenities[i];
        await prisma.amenity.create({
          data: {
            nameEn: a.nameEn,
            nameAr: a.nameAr,
            icon: a.icon,
            descEn: a.descEn,
            descAr: a.descAr,
            order: i,
          },
        });
      }
      amenities = await prisma.amenity.findMany({
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ success: true, amenities });
  } catch (error) {
    console.error("Amenities GET error:", error);
    return NextResponse.json({ success: false, amenities: [], error: String(error) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newAmenity = await prisma.amenity.create({
      data: {
        nameEn: body.nameEn || "",
        nameAr: body.nameAr || "",
        icon: body.icon || "Star",
        descEn: body.descEn || "",
        descAr: body.descAr || "",
        order: body.order || 0,
      },
    });
    return NextResponse.json({ success: true, amenity: newAmenity });
  } catch (error) {
    console.error("Amenities POST error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
