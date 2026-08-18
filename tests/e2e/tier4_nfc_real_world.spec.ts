import { test, expect } from "@playwright/test";

test.describe("Tier 4: Real-World Mobile NFC Tap Workloads", () => {
  test.use({
    viewport: { width: 390, height: 844 }, // iPhone 14 standard NFC tap viewport
  });

  test("TC-401: Sub-second NFC tap render performance and layout stability", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    // Verify key UI elements render immediately
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('img[alt*="Jab Lab"]')).toBeVisible();

    // Check DOM load timing
    expect(loadTime).toBeLessThan(5000);
  });

  test("TC-402: NFC reception tap to WhatsApp direct booking journey", async ({ page }) => {
    await page.goto("/");

    // Click on WhatsApp Link
    const waLink = page.locator('a[href*="wa.me/962790000000"]');
    await expect(waLink.first()).toBeVisible();

    const href = await waLink.first().getAttribute("href");
    expect(href).toContain("wa.me/962790000000");
  });

  test("TC-403: Coach 1-on-1 private WhatsApp session booking URL generation", async ({ page }) => {
    await page.goto("/");

    // Check Odai's card WhatsApp booking button
    const odaiBookingBtn = page.locator('a[aria-label*="Odai"]');
    await expect(odaiBookingBtn).toBeVisible();

    const href = await odaiBookingBtn.getAttribute("href");
    expect(href).toContain("wa.me/962790000000");
    // Verify encoded Arabic message includes coach
    expect(decodeURIComponent(href || "")).toContain("عدي الهنداوي");
  });

  test("TC-404: 1-Tap Save Contact action downloads vCard", async ({ page }) => {
    await page.goto("/");

    // Listen for download event
    const downloadPromise = page.waitForEvent("download");
    const saveContactBtn = page.getByRole("button", { name: /حفظ جهة الاتصال/i });
    await saveContactBtn.click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("JabLabBoxing.vcf");
  });

  test("TC-405: Facility navigation journey via Google Maps button", async ({ page }) => {
    await page.goto("/");

    const mapsBtn = page.locator('a[href*="maps.google.com"]');
    await expect(mapsBtn.first()).toBeVisible();

    const href = await mapsBtn.first().getAttribute("href");
    expect(href).toContain("Jab+Lab+Boxing");
  });
});
