import { describe, it, expect } from "vitest";
import { generateVCardString, generateClubVCard, escapeVCardText } from "@/lib/vcard";
import { clubInfo } from "@/data/clubData";

describe("vCard 3.0 Generation Suite", () => {
  it("should correctly escape special characters per RFC 2426 / RFC 6350", () => {
    expect(escapeVCardText("Simple Text")).toBe("Simple Text");
    expect(escapeVCardText("Backslash\\Test")).toBe("Backslash\\\\Test");
    expect(escapeVCardText("Line 1\nLine 2\r\nLine 3")).toBe("Line 1\\nLine 2\\nLine 3");
    expect(escapeVCardText("Semi;Colon;Test")).toBe("Semi\\;Colon\\;Test");
    expect(escapeVCardText("Comma, Separated, Values")).toBe("Comma\\, Separated\\, Values");
    expect(escapeVCardText("Complex \\;,\nMix")).toBe("Complex \\\\\\;\\,\\nMix");
    expect(escapeVCardText("")).toBe("");
  });

  it("should generate a valid vCard 3.0 format with required headers", () => {
    const vcard = generateClubVCard(clubInfo, "https://jablabboxing.com");

    expect(vcard).toContain("BEGIN:VCARD");
    expect(vcard).toContain("VERSION:3.0");
    expect(vcard).toContain("END:VCARD");
  });

  it("should correctly encode Arabic and English club names in UTF-8 format", () => {
    const vcard = generateClubVCard(clubInfo);

    expect(vcard).toContain("FN;CHARSET=UTF-8:JAB LAB BOXING CLUB | نادي جاب لاب للملاكمة");
    expect(vcard).toContain("ORG;CHARSET=UTF-8:Jab Lab Boxing Club");
  });

  it("should include valid telephone and WhatsApp numbers", () => {
    const vcard = generateClubVCard(clubInfo);

    expect(vcard).toContain(`TEL;TYPE=CELL,VOICE,PREF:${clubInfo.phoneRaw}`);
    expect(vcard).toContain(`TEL;TYPE=WORK,VOICE:${clubInfo.phoneRaw}`);
  });

  it("should include valid address and location details with escaped commas", () => {
    const vcard = generateClubVCard(clubInfo);

    expect(vcard).toContain("ADR;TYPE=WORK;CHARSET=UTF-8:;;Prestige Sports Corridor\\, Amman\\, Jordan;Amman;;;Jordan");
    expect(vcard).toContain("EMAIL;TYPE=INTERNET,WORK,PREF:info@jablabboxing.com");
  });

  it("should format multi-line notes with literal \\n without creating orphan raw lines", () => {
    const vcard = generateClubVCard(clubInfo);
    const rawLines = vcard.split("\r\n");

    // Every line in a valid vCard must either be BEGIN/END or have a property name and colon
    const orphanLines = rawLines.filter(
      (line) => line.trim() && !line.includes(":") && line !== "BEGIN:VCARD" && line !== "END:VCARD"
    );
    expect(orphanLines).toHaveLength(0);

    // NOTE line contains escaped \n
    const noteLine = rawLines.find((l) => l.startsWith("NOTE;"));
    expect(noteLine).toBeDefined();
    expect(noteLine).toContain("\\n");
  });

  it("should handle custom contact info payloads cleanly", () => {
    const customVCard = generateVCardString({
      name: "Odai Al-Hindawi",
      nameAr: "عدي الهنداوي",
      organization: "Jab Lab Boxing Club",
      title: "Olympic Head Coach",
      phone: "+962790000001",
      email: "odai@jablabboxing.com",
      url: "https://jablabboxing.com",
      address: "Amman, Jordan",
      note: "Olympic Boxer & Head Coach\nSpecialist in Pro Sparring",
    });

    expect(customVCard).toContain("TITLE;CHARSET=UTF-8:Olympic Head Coach");
    expect(customVCard).toContain("TEL;TYPE=CELL,VOICE,PREF:+962790000001");
    expect(customVCard).toContain("FN;CHARSET=UTF-8:Odai Al-Hindawi | عدي الهنداوي");
    expect(customVCard).toContain("ADR;TYPE=WORK;CHARSET=UTF-8:;;Amman\\, Jordan;Amman;;;Jordan");
    expect(customVCard).toContain("NOTE;CHARSET=UTF-8:Olympic Boxer & Head Coach\\nSpecialist in Pro Sparring");
  });
});
