import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { galleryUrl, WCAG_TAGS } from "./support/artifacts";

test.beforeEach(async ({ page }) => {
  await page.goto(galleryUrl("compositions/admin-users"));
  await expect(page.getByRole("table", { name: "Users" })).toBeVisible();
});

test("filters, search, sorting and pagination work together", async ({ page }) => {
  const range = page.getByText(/^Showing \d+–\d+ of \d+ users$/);
  await expect(range).toHaveText("Showing 1–25 of 128 users");
  await page.getByRole("button", { name: "Page 2" }).click();
  await expect(range).toHaveText("Showing 26–50 of 128 users");

  await page.getByRole("button", { name: "Role: All" }).click();
  await page.getByRole("menuitemradio", { name: "Admin" }).click();
  await expect(range).toHaveText("Showing 1–15 of 15 users");

  await page.getByRole("searchbox", { name: "Search users" }).fill("zzz");
  await expect(page.getByRole("heading", { name: "No matching users" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("searchbox", { name: "Search users" }).fill("");
  await expect(range).toHaveText("Showing 1–25 of 128 users");

  const userHeader = page.getByRole("columnheader", { name: "User" });
  await page.getByRole("button", { name: "User" }).click();
  await expect(userHeader).toHaveAttribute("aria-sort", "ascending");
  await expect(page.getByRole("columnheader", { name: "Created" })).toHaveAttribute("aria-sort", "none");
  await page.getByRole("button", { name: "Rows per page: 25" }).click();
  await page.getByRole("menuitemradio", { name: "50" }).click();
  await expect(range).toHaveText("Showing 1–50 of 128 users");

  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test.describe("at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the table scrolls inside a named region instead of the page", async ({ page }) => {
    const region = page.getByRole("region", { name: "Users table" });
    await expect(region).toBeVisible();
    expect(await region.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await region.focus();
    await expect(region).toBeFocused();
  });
});
