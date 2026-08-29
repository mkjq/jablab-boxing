import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const coaches = await prisma.coach.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, coaches });
  } catch (error) {
    console.error("Coaches API error:", error);
    return NextResponse.json({ success: false, coaches: [], error: String(error) });
  }
}
