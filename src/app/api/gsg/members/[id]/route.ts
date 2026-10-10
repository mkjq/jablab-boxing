import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { validateAndFormatJordanianPhone } from "@/lib/phone";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }

    const member = await prisma.member.findUnique({
      where: { id: params.id },
      include: {
        checkIns: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ success: false, error: "اللاعب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error("GSG Member GET error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }

    const { name, phone, email, totalCheckIns } = await req.json();

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name.trim();
    if (phone) {
      const phoneValidation = validateAndFormatJordanianPhone(phone);
      if (!phoneValidation.isValid) {
        return NextResponse.json(
          { success: false, error: phoneValidation.error || "يرجى إدخال رقم هاتف أردني صحيح" },
          { status: 400 }
        );
      }
      dataToUpdate.phone = phoneValidation.phone;
    }
    if (email !== undefined) dataToUpdate.email = email ? email.trim().toLowerCase() : null;
    if (totalCheckIns !== undefined) dataToUpdate.totalCheckIns = parseInt(totalCheckIns, 10) || 0;

    const updated = await prisma.member.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error("GSG Member PUT error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }

    await prisma.member.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "تم حذف اللاعب بنجاح" });
  } catch (error) {
    console.error("GSG Member DELETE error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
