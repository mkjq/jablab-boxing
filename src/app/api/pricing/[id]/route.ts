import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    const updated = await prisma.pricingTier.update({
      where: { id },
      data: {
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        price: body.price,
        currency: body.currency,
        periodEn: body.periodEn,
        periodAr: body.periodAr,
        popular: body.popular,
        badge: body.badge,
        featuresEn: body.featuresEn,
        featuresAr: body.featuresAr,
        whatsappText: body.whatsappText,
        order: body.order,
      },
    });
    
    return NextResponse.json({ success: true, pricing: updated });
  } catch (error) {
    console.error("Pricing PUT error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.pricingTier.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pricing DELETE error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
