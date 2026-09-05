import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    const updated = await prisma.actionLink.update({
      where: { id },
      data: {
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        subtitleEn: body.subtitleEn,
        subtitleAr: body.subtitleAr,
        icon: body.icon,
        badge: body.badge,
        badgeColor: body.badgeColor,
        actionType: body.actionType,
        modalId: body.modalId,
        href: body.href,
        highlight: body.highlight,
        order: body.order,
      },
    });
    
    return NextResponse.json({ success: true, actionLink: updated });
  } catch (error) {
    console.error("ActionLink PUT error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.actionLink.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ActionLink DELETE error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
