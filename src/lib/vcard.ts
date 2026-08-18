import { ClubInfo } from "@/types";

export interface VCardContactInfo {
  name: string;
  nameAr?: string;
  organization: string;
  title?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  url: string;
  address: string;
  note: string;
}

/**
 * Escapes special characters in vCard text fields according to RFC 2426 / RFC 6350.
 * Backslashes, newlines, semicolons, and commas must be escaped with a backslash.
 */
export function escapeVCardText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function generateVCardString(contact: VCardContactInfo): string {
  const fullName = contact.nameAr ? `${contact.name} | ${contact.nameAr}` : contact.name;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN;CHARSET=UTF-8:${escapeVCardText(fullName)}`,
    `N;CHARSET=UTF-8:${escapeVCardText(contact.organization)};;;;`,
    `ORG;CHARSET=UTF-8:${escapeVCardText(contact.organization)}`,
    contact.title ? `TITLE;CHARSET=UTF-8:${escapeVCardText(contact.title)}` : "",
    `TEL;TYPE=CELL,VOICE,PREF:${contact.phone}`,
    contact.whatsapp ? `TEL;TYPE=WORK,VOICE:${contact.whatsapp}` : "",
    `EMAIL;TYPE=INTERNET,WORK,PREF:${contact.email}`,
    `URL;TYPE=WORK:${contact.url}`,
    `ADR;TYPE=WORK;CHARSET=UTF-8:;;${escapeVCardText(contact.address)};Amman;;;Jordan`,
    `NOTE;CHARSET=UTF-8:${escapeVCardText(contact.note)}`,
    "END:VCARD",
  ].filter(Boolean);

  return lines.join("\r\n");
}

export function generateClubVCard(club: ClubInfo, siteUrl: string = "https://jablabboxing.com"): string {
  return generateVCardString({
    name: club.nameEn,
    nameAr: club.nameAr,
    organization: "Jab Lab Boxing Club",
    title: "Premier Boxing & High Performance Lab",
    phone: club.phoneRaw,
    whatsapp: club.phoneRaw,
    email: club.email,
    url: siteUrl,
    address: club.addressEn,
    note: `${club.nameEn} - ${club.taglineEn}\n${club.nameAr} - ${club.taglineAr}\nInstagram: ${club.instagramUrl}\nLocation: ${club.mapUrl}`,
  });
}

export function downloadVCard(vcardString: string, filename = "JabLabBoxing.vcf"): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([vcardString], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadClubVCard(club: ClubInfo, filename = "JabLabBoxing.vcf"): void {
  const vcard = generateClubVCard(club);
  downloadVCard(vcard, filename);
}
