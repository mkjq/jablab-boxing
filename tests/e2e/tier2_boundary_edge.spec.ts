import { test, expect } from "@playwright/test";

test.describe("Tier 2: Boundary Value, Viewport Scaling & Resilience", () => {
  test("TC-201: Layout conforms to RTL Arabic specification without horizontal overflow", async ({ page }) => {
    await page.goto("/");

    const htmlDir = await page.getAttribute("html", "dir");
    const htmlLang = await page.getAttribute("html", "lang");

    expect(htmlDir).toBe("rtl");
    expect(htmlLang).toBe("ar");

    // Check no horizontal scrollbar overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test("TC-202: Ultra-compact mobile viewport (320px width) scaling", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");

    // All touch targets must remain visible and accessible
    const saveContactBtn = page.getByRole("button", { name: /حفظ جهة الاتصال/i });
    await expect(saveContactBtn).toBeVisible();

    const coachesSection = page.locator("text=كادر ومدربو جاب لاب النخبوي");
    await expect(coachesSection).toBeVisible();
  });

  test("TC-203: Tablet viewport (768px width) responsive container centering", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    const mainContainer = page.locator("main");
    await expect(mainContainer).toBeVisible();

    // Verify container max-width prevents over-stretching
    const boundingBox = await mainContainer.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(480);
  });

  test("TC-204: Desktop 1080p viewport scaling", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    await expect(page.locator("h1")).toContainText("نادي جاب لاب للملاكمة");
  });

  test("TC-205: vCard API endpoint returns correct headers and content", async ({ request }) => {
    const response = await request.get("/api/vcard");
    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("text/vcard");

    const contentDisposition = response.headers()["content-disposition"];
    expect(contentDisposition).toContain("attachment");

    const text = await response.text();
    expect(text).toContain("BEGIN:VCARD");
    expect(text).toContain("VERSION:3.0");
    expect(text).toContain("Jab Lab Boxing Club");
    expect(text).toContain("END:VCARD");
  });
});
