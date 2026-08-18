import { test, expect } from "@playwright/test";

test.describe("Tier 1: Foundational Feature & Structural Coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TC-101: Club brand header and bilingual titles render properly", async ({ page }) => {
    // Assert logo image is present and visible
    const logo = page.locator('img[alt*="Jab Lab"]');
    await expect(logo).toBeVisible();

    // Assert Arabic and English brand names
    const heading = page.locator("h1");
    await expect(heading).toContainText("نادي جاب لاب للملاكمة");
    await expect(page.locator("text=JAB LAB BOXING CLUB")).toBeVisible();
  });

  test("TC-102: Quick action bar renders with 5 active touchpoints", async ({ page }) => {
    const callButton = page.locator('a[aria-label*="Call Jab Lab"]');
    await expect(callButton).toHaveAttribute("href", /^tel:\+962/);

    const whatsappButton = page.locator('a[aria-label*="Chat on WhatsApp"]');
    await expect(whatsappButton).toHaveAttribute("href", /wa\.me\/962/);

    const mapsButton = page.locator('a[aria-label*="Google Maps"]');
    await expect(mapsButton).toHaveAttribute("href", /maps\.google\.com/);

    const instagramButton = page.locator('a[aria-label*="Instagram"]');
    await expect(instagramButton).toHaveAttribute("href", /instagram\.com/);

    const shareButton = page.locator('button[aria-label*="Share Jab Lab"]');
    await expect(shareButton).toBeVisible();
  });

  test("TC-103: NFC smart utility bar renders Save Contact and Share triggers", async ({ page }) => {
    const saveContactBtn = page.getByRole("button", { name: /حفظ جهة الاتصال/i });
    await expect(saveContactBtn).toBeVisible();

    const shareBtn = page.getByRole("button", { name: /مشاركة \/ QR/i });
    await expect(shareBtn).toBeVisible();
  });

  test("TC-104: Elite coaches section renders exactly 4 champion cards", async ({ page }) => {
    await expect(page.locator("text=كادر ومدربو جاب لاب النخبوي")).toBeVisible();

    // Verify all 4 coaches by name
    await expect(page.locator("text=الكابتن عدي الهنداوي")).toBeVisible();
    await expect(page.locator("text=الكابتن محمد التلاوي")).toBeVisible();
    await expect(page.locator("text=الكابتن عبدالله البوريني")).toBeVisible();
    await expect(page.locator("text=الكابتن ضياء الحارثي")).toBeVisible();
  });

  test("TC-105: Action links, working hours and gym amenities render cleanly", async ({ page }) => {
    await expect(page.locator("text=احجز حصتك التجريبية المجانية")).toBeVisible();
    await expect(page.locator("text=جدول الحصص والتدريب الأسبوعي")).toBeVisible();
    await expect(page.locator("text=باقات الاشتراك والتدريب الخاص VIP")).toBeVisible();
    await expect(page.locator("text=تجهيزات ومرافق جاب لاب")).toBeVisible();
    await expect(page.locator("text=FORGED IN DISCIPLINE • BUILT FOR GREATNESS")).toBeVisible();
  });
});
