import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { clubInfo, actionLinks, scheduleData, pricingTiers } from '@/data/clubData';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    await prisma.clubSettings.upsert({
      where: { id: 'global' },
      update: {},
      create: {
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

    await prisma.amenity.deleteMany();
    const amenitiesToCreate = clubInfo.amenities.map((a, i) => ({
      nameEn: a.nameEn,
      nameAr: a.nameAr,
      icon: a.icon,
      descEn: a.descEn,
      descAr: a.descAr,
      order: i,
    }));
    await prisma.amenity.createMany({ data: amenitiesToCreate });

    await prisma.actionLink.deleteMany();
    const actionLinksToCreate = actionLinks.map((al, i) => ({
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
    }));
    await prisma.actionLink.createMany({ data: actionLinksToCreate });

    await prisma.pricingTier.deleteMany();
    const pricingToCreate = pricingTiers.map((p, i) => ({
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
    }));
    await prisma.pricingTier.createMany({ data: pricingToCreate });

    await prisma.classSession.deleteMany();
    let sessionOrder = 0;
    
    const existingCoaches = await prisma.coach.findMany();
    
    for (const day of scheduleData) {
      for (const session of day.sessions) {
        let matchedCoach = existingCoaches.find(c => c.nameEn.toLowerCase().includes(session.coachNameEn.toLowerCase().replace('coach ', '')));
        
        if (!matchedCoach && existingCoaches.length > 0) {
           matchedCoach = existingCoaches[0];
        }

        if (matchedCoach) {
          await prisma.classSession.create({
            data: {
              day: day.id,
              time: session.time,
              titleEn: session.titleEn,
              titleAr: session.titleAr,
              category: session.category,
              levelEn: session.levelEn,
              levelAr: session.levelAr,
              coachId: matchedCoach.id,
              order: sessionOrder++,
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
