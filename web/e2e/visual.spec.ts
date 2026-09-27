import { expect, test, type Page } from "@playwright/test";
import { galleryUrl } from "./support/artifacts";

const pages: Array<{ path: string; name: string; width: number }> = [
  { path: "foundations/color", name: "color-1280", width: 1280 },
  { path: "primitives/actions-inputs", name: "actions-inputs-1280", width: 1280 },
  { path: "compositions/profile", name: "profile-1280", width: 1280 },
  { path: "compositions/skills-edit", name: "skills-edit-1280", width: 1280 },
  { path: "compositions/admin-users", name: "admin-users-1280", width: 1280 },
  { path: "compositions/login", name: "login-1280", width: 1280 },
  { path: "compositions/profile", name: "profile-390", width: 390 },
  { path: "compositions/admin-users", name: "admin-users-390", width: 390 },
];

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
}

for (const target of pages) {
  test(`${target.name} matches its baseline @visual`, async ({ page }) => {
    await page.setViewportSize({ width: target.width, height: 900 });
    await page.goto(galleryUrl(target.path));
    await expect(page.locator("h1").first()).toBeVisible();
    await settle(page);
    await expect(page).toHaveScreenshot(`${target.name}.png`, { fullPage: true, animations: "disabled", caret: "hide" });
  });
}
