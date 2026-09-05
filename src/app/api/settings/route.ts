import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clubInfo } from '@/data/clubData';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.clubSettings.findUnique({
      where: { id: 'global' }
    });

    if (!settings) {
      settings = await prisma.clubSettings.create({
        data: {
          id: 'global',
          nameEn: clubInfo.nameEn,
          nameAr: clubInfo.nameAr,
          shortName: clubInfo.shortName,
          taglineEn: clubInfo.taglineEn,
          taglineAr: clubInfo.taglineAr,
          descriptionEn: clubInfo.descriptionEn,
          descriptionAr: clubInfo.descriptionAr,
          locationEn: clubInfo.locationEn,
          locationAr: clubInfo.locationAr,
          addressEn: clubInfo.addressEn,
          addressAr: clubInfo.addressAr,
          phone: clubInfo.phone,
          phoneRaw: clubInfo.phoneRaw,
          whatsapp: clubInfo.whatsapp,
          email: clubInfo.email,
          instagram: clubInfo.instagram,
          instagramUrl: clubInfo.instagramUrl,
          tiktok: clubInfo.tiktok,
          tiktokUrl: clubInfo.tiktokUrl,
          mapUrl: clubInfo.mapUrl,
          weekdaysEn: clubInfo.hours.weekdaysEn,
          weekdaysAr: clubInfo.hours.weekdaysAr,
          fridayEn: clubInfo.hours.fridayEn,
          fridayAr: clubInfo.hours.fridayAr,
          openTime: clubInfo.hours.openTime,
          closeTime: clubInfo.hours.closeTime,
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const settings = await prisma.clubSettings.upsert({
      where: { id: 'global' },
      update: data,
      create: { id: 'global', ...data }
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
