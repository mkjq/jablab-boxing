import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = 'edge';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ 
      authenticated: true, 
      role: session.role || "EDITOR" 
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
