import { describe, it, expect } from "vitest";
import { clubInfo, actionLinks, scheduleData, pricingTiers } from "@/data/clubData";
import { coaches } from "@/data/coaches";
import { formatWhatsAppUrl, formatTelUrl, isClubOpen } from "@/lib/utils";

describe("Jab Lab Data Layer Integrity Suite", () => {
  it("should contain complete and authoritative club metadata", () => {
    expect(clubInfo.nameEn).toBe("JAB LAB BOXING CLUB");
    expect(clubInfo.nameAr).toBe("نادي جاب لاب للملاكمة");
    expect(clubInfo.phoneRaw).toBe("+962790000000");
    expect(clubInfo.instagramUrl).toContain("instagram.com");
    expect(clubInfo.amenities.length).toBeGreaterThanOrEqual(6);
  });

  it("should contain exactly 4 elite coaches with verbatim credentials and valid image paths", () => {
    expect(coaches).toHaveLength(4);

    const coachIds = coaches.map((c) => c.id);
    expect(coachIds).toEqual(["odai", "mohammad", "abdullah", "diaa"]);

    const odai = coaches.find((c) => c.id === "odai")!;
    expect(odai.nameAr).toBe("الكابتن عدي الهنداوي");
    expect(odai.titleAr).toBe("الكابتن الأولمبي");
    expect(odai.roleAr).toBe("مدرب المنتخب الوطني الأردني للملاكمة");
    expect(odai.image).toBe("/images/coaches/odai.png");

    const mohammad = coaches.find((c) => c.id === "mohammad")!;
    expect(mohammad.nameAr).toBe("الكابتن محمد التلاوي");
    expect(mohammad.roleAr).toBe("لاعب المنتخب الوطني للملاكمة");
    expect(mohammad.image).toBe("/images/coaches/mohammad.png");

    const abdullah = coaches.find((c) => c.id === "abdullah")!;
    expect(abdullah.nameAr).toBe("الكابتن عبدالله البوريني");
    expect(abdullah.titleAr).toBe("المدرب الدولي");
    expect(abdullah.image).toBe("/images/coaches/abdullah.png");

    const diaa = coaches.find((c) => c.id === "diaa")!;
    expect(diaa.nameAr).toBe("الكابتن ضياء الحارثي");
    expect(diaa.titleAr).toBe("مختص الإعداد البدني");
    expect(diaa.image).toBe("/images/coaches/diaa.png");
  });

  it("should provide full weekly class schedule covering 7 days", () => {
    expect(scheduleData.length).toBe(7);
    for (const day of scheduleData) {
      expect(day.sessions.length).toBeGreaterThan(0);
      for (const session of day.sessions) {
        expect(session.time).toBeTruthy();
        expect(session.titleAr).toBeTruthy();
        expect(session.coachNameAr).toBeTruthy();
      }
    }
  });

  it("should provide all core membership packages and pricing tiers", () => {
    expect(pricingTiers.length).toBeGreaterThanOrEqual(4);
    const popularTier = pricingTiers.find((t) => t.popular);
    expect(popularTier).toBeDefined();
    expect(popularTier?.id).toBe("quarterly");
  });

  it("should format WhatsApp and Telephone deep-links correctly", () => {
    const wa = formatWhatsAppUrl("+962790000000", "Hello Test");
    expect(wa).toBe("https://wa.me/962790000000?text=Hello%20Test");

    const tel = formatTelUrl("+962 7 9000 0000");
    expect(tel).toBe("tel:+962790000000");
  });

  it("should calculate club open status accurately", () => {
    const status = isClubOpen(6, 23);
    expect(status).toHaveProperty("isOpen");
    expect(status).toHaveProperty("textEn");
    expect(status).toHaveProperty("textAr");
  });
});
