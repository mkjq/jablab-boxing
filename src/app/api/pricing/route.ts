import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pricingTiers as defaultPricingTiers } from "@/data/clubData";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let pricing = await prisma.pricingTier.findMany({
      orderBy: { order: "asc" },
    });

    if (pricing.length === 0) {
      for (let i = 0; i < defaultPricingTiers.length; i++) {
        const p = defaultPricingTiers[i];
        await prisma.pricingTier.create({
          data: {
            id: p.id,
            titleEn: p.titleEn,
            titleAr: p.titleAr,
            price: p.price,
            currency: p.currency,
            periodEn: p.periodEn,
            periodAr: p.periodAr,
            popular: p.popular || false,
            badge: p.badge || '',
            featuresEn: JSON.stringify(p.featuresEn),
            featuresAr: JSON.stringify(p.featuresAr),
            whatsappText: p.whatsappText,
            order: i,
          },
        });
      }
      pricing = await prisma.pricingTier.findMany({
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ success: true, pricing });
  } catch (error) {
    console.error("Pricing GET error:", error);
    return NextResponse.json({ success: false, pricing: [], error: String(error) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newTier = await prisma.pricingTier.create({
      data: {
        titleEn: body.titleEn || "",
        titleAr: body.titleAr || "",
        price: body.price || "",
        currency: body.currency || "JOD",
        periodEn: body.periodEn || "",
        periodAr: body.periodAr || "",
        popular: body.popular || false,
        badge: body.badge || "",
        featuresEn: body.featuresEn || "[]",
        featuresAr: body.featuresAr || "[]",
        whatsappText: body.whatsappText || "",
        order: body.order || 0,
      },
    });
    return NextResponse.json({ success: true, pricing: newTier });
  } catch (error) {
    console.error("Pricing POST error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
