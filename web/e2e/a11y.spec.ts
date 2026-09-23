import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { galleryRoutes } from "../src/gallery/routes";
import { galleryUrl, WCAG_TAGS } from "./support/artifacts";

for (const route of galleryRoutes) {
  test(`gallery ${route.path} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(galleryUrl(route.path));
    await expect(page.locator("h1").first()).toBeAttached();
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target.join(" ")) }))).toEqual([]);
  });
}
