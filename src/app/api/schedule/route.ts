import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scheduleData } from "@/data/clubData";
import { coaches as defaultCoaches } from "@/data/coaches";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let schedule = await prisma.classSession.findMany({
      include: { coach: true },
      orderBy: [
        { day: "asc" },
        { time: "asc" },
      ]
    });

    if (schedule.length === 0) {
      // Ensure coaches exist first
      let coaches = await prisma.coach.findMany();
      if (coaches.length === 0) {
        for (let i = 0; i < defaultCoaches.length; i++) {
          const c = defaultCoaches[i];
          await prisma.coach.upsert({
            where: { id: c.id },
            update: {},
            create: {
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
        coaches = await prisma.coach.findMany();
      }

      let order = 0;
      for (const day of scheduleData) {
        for (const session of day.sessions) {
          const coach = coaches.find(c => c.id === session.coachId) || coaches[0];
          if (coach) {
            await prisma.classSession.create({
              data: {
                day: day.id,
                time: session.time,
                titleEn: session.titleEn,
                titleAr: session.titleAr,
                category: session.category,
                levelEn: session.levelEn,
                levelAr: session.levelAr,
                coachId: coach.id,
                order: order++,
              },
            });
          }
        }
      }

      schedule = await prisma.classSession.findMany({
        include: { coach: true },
        orderBy: [
          { day: "asc" },
          { time: "asc" },
        ]
      });
    }

    return NextResponse.json({ success: true, schedule });
  } catch (error) {
    console.error("Schedule GET error:", error);
    return NextResponse.json({ success: false, schedule: [], error: String(error) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newSession = await prisma.classSession.create({
      data: {
        day: body.day || "sat",
        time: body.time || "",
        titleEn: body.titleEn || "",
        titleAr: body.titleAr || "",
        category: body.category || "",
        levelEn: body.levelEn || "",
        levelAr: body.levelAr || "",
        coachId: body.coachId,
      },
    });
    return NextResponse.json({ success: true, session: newSession });
  } catch (error) {
    console.error("Schedule POST error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
