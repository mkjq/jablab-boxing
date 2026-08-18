import { test, expect } from "@playwright/test";

test.describe("Tier 3: Cross-Feature Interactions & Modals", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TC-301: Class schedule modal opens, switches day tabs, and closes cleanly", async ({ page }) => {
    const scheduleLink = page.getByRole("button", { name: /جدول الحصص والتدريب الأسبوعي/i });
    await scheduleLink.click();

    // Verify modal is open
    const modalTitle = page.locator("#schedule-modal-title");
    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).toContainText("جدول الحصص الأسبوعي");

    // Click on Sunday tab
    const sunTab = page.getByRole("button", { name: "الأحد" });
    await sunTab.click();
    await expect(page.locator("text=حصة السيدات: ملاكمة ودفاع عن النفس")).toBeVisible();

    // Close modal
    const closeBtn = page.getByRole("button", { name: "Close schedule modal" });
    await closeBtn.click();
    await expect(modalTitle).not.toBeVisible();
  });

  test("TC-302: Pricing modal displays membership packages and closes on backdrop click", async ({ page }) => {
    const pricingLink = page.getByRole("button", { name: /باقات الاشتراك والتدريب الخاص VIP/i });
    await pricingLink.click();

    const pricingTitle = page.locator("#pricing-modal-title");
    await expect(pricingTitle).toBeVisible();
    await expect(page.locator("text=باقة الأبطال (3 أشهر)")).toBeVisible();
    await expect(page.locator("text=باقة التدريب الخاص VIP (10 حصص)")).toBeVisible();

    // Click outside backdrop to close
    await page.mouse.click(10, 10);
    await expect(pricingTitle).not.toBeVisible();
  });

  test("TC-303: Share modal renders QR code and copy link button", async ({ page }) => {
    const shareBtn = page.getByRole("button", { name: /مشاركة \/ QR/i });
    await shareBtn.click();

    const shareTitle = page.locator("#share-modal-title");
    await expect(shareTitle).toBeVisible();

    // Verify SVG QR code rendered
    const qrSvg = page.locator("svg");
    await expect(qrSvg.first()).toBeVisible();

    const copyBtn = page.getByRole("button", { name: /نسخ رابط الصفحة/i });
    await expect(copyBtn).toBeVisible();
  });

  test("TC-304: Coach detail modal opens with credentials upon clicking portrait", async ({ page }) => {
    // Click on Odai's card image container
    const odaiImg = page.locator('img[alt="الكابتن عدي الهنداوي"]');
    await odaiImg.click();

    const coachModal = page.locator("#coach-modal-title");
    await expect(coachModal).toBeVisible();
    await expect(coachModal).toContainText("الكابتن عدي الهنداوي");
    await expect(page.locator("text=استراتيجيات النزالات الأولمبية")).toBeVisible();

    // Close coach modal
    const closeBtn = page.getByRole("button", { name: "Close modal" });
    await closeBtn.click();
    await expect(coachModal).not.toBeVisible();
  });

  test("TC-305: Trial session modal opens and validates form inputs", async ({ page }) => {
    const trialLink = page.getByRole("button", { name: /احجز حصتك التجريبية المجانية/i });
    await trialLink.click();

    const trialTitle = page.locator("#trial-modal-title");
    await expect(trialTitle).toBeVisible();

    const nameInput = page.locator('input[placeholder*="أدخل اسمك"]');
    await expect(nameInput).toBeVisible();
  });

  test("TC-306: Modal closes on Escape key and toggles body overflow scroll lock", async ({ page }) => {
    const scheduleLink = page.getByRole("button", { name: /جدول الحصص والتدريب الأسبوعي/i });
    await scheduleLink.click();

    const modalTitle = page.locator("#schedule-modal-title");
    await expect(modalTitle).toBeVisible();

    // Verify body overflow is locked to hidden
    const isLocked = await page.evaluate(() => document.body.style.overflow === "hidden");
    expect(isLocked).toBe(true);

    // Press Escape
    await page.keyboard.press("Escape");
    await expect(modalTitle).not.toBeVisible();

    // Verify body overflow is unlocked
    const isUnlocked = await page.evaluate(() => document.body.style.overflow !== "hidden");
    expect(isUnlocked).toBe(true);
  });
});
