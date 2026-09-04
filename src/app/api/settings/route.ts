import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.clubSettings.findUnique({
      where: { id: 'global' }
    });
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
