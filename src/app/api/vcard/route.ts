import { NextResponse } from "next/server";
import { clubInfo } from "@/data/clubData";
import { generateClubVCard } from "@/lib/vcard";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const siteUrl = origin || "https://jablabboxing.com";

  const vcard = generateClubVCard(clubInfo, siteUrl);

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="JabLabBoxing.vcf"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
