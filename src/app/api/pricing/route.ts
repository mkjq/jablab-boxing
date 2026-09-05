import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pricing = await prisma.pricingTier.findMany({
      orderBy: { order: "asc" },
    });
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
