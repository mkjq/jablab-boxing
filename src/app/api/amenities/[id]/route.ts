import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    const updated = await prisma.amenity.update({
      where: { id },
      data: {
        nameEn: body.nameEn,
        nameAr: body.nameAr,
        icon: body.icon,
        descEn: body.descEn,
        descAr: body.descAr,
        order: body.order,
      },
    });
    
    return NextResponse.json({ success: true, amenity: updated });
  } catch (error) {
    console.error("Amenity PUT error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.amenity.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Amenity DELETE error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
