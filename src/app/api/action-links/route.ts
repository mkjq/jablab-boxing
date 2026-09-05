import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { actionLinks as defaultActionLinks } from "@/data/clubData";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let actionLinks = await prisma.actionLink.findMany({
      orderBy: { order: "asc" },
    });

    if (actionLinks.length === 0) {
      for (let i = 0; i < defaultActionLinks.length; i++) {
        const al = defaultActionLinks[i];
        await prisma.actionLink.create({
          data: {
            id: al.id,
            titleEn: al.titleEn,
            titleAr: al.titleAr,
            subtitleEn: al.subtitleEn || '',
            subtitleAr: al.subtitleAr || '',
            icon: al.icon,
            badge: al.badge || '',
            badgeColor: al.badgeColor || '',
            actionType: al.actionType,
            modalId: al.modalId || '',
            href: al.href || '',
            highlight: al.highlight || false,
            order: i,
          },
        });
      }
      actionLinks = await prisma.actionLink.findMany({
        orderBy: { order: "asc" },
      });
    }

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
