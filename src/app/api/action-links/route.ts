import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const actionLinks = await prisma.actionLink.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, actionLinks });
  } catch (error) {
    console.error("ActionLinks GET error:", error);
    return NextResponse.json({ success: false, actionLinks: [], error: String(error) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newLink = await prisma.actionLink.create({
      data: {
        titleEn: body.titleEn || "",
        titleAr: body.titleAr || "",
        subtitleEn: body.subtitleEn || "",
        subtitleAr: body.subtitleAr || "",
        icon: body.icon || "",
        badge: body.badge || "",
        badgeColor: body.badgeColor || "",
        actionType: body.actionType || "link",
        modalId: body.modalId || "",
        href: body.href || "",
        highlight: body.highlight || false,
        order: body.order || 0,
      },
    });
    return NextResponse.json({ success: true, actionLink: newLink });
  } catch (error) {
    console.error("ActionLinks POST error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
