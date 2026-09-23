import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { galleryUrl, WCAG_TAGS } from "./support/artifacts";

test("catalog search supports keyboard selection and private custom values", async ({ page }) => {
  await page.goto(galleryUrl("components/catalog-combobox"));
  const company = page.getByRole("combobox", { name: "Company" });
  await company.pressSequentially("shop");
  await expect(page.getByRole("option", { name: "Create custom company “shop”" })).toBeVisible();
  // React Aria hides content outside an open combobox from screen readers; Tab closes the listbox
  // before focus can move there, so the outside-content aria-hidden-focus report does not apply.
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).disableRules(["aria-hidden-focus"]).analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(company).toHaveValue("Shopify");
  await expect(page.getByText("Selected catalog value: Shopify")).toBeVisible();

  await company.fill("");
  await company.pressSequentially("Shopify Labs");
  await page.getByRole("option", { name: "Create custom company “Shopify Labs”" }).click();
  await expect(page.getByText("Selected private custom value: Shopify Labs")).toBeVisible();
});

test("failed searches offer a keyboard-reachable retry", async ({ page }) => {
  await page.goto(galleryUrl("components/catalog-combobox"));
  await page.getByRole("combobox", { name: "Error example" }).pressSequentially("soft");
  await expect(page.getByRole("listbox").getByText("Search failed.")).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Retry search" })).toHaveAttribute("data-focused", "true");
});

test("dependent fields appear with their parent and clear when it changes", async ({ page }) => {
  await page.goto(galleryUrl("patterns/dependent-fields"));
  await expect(page.getByRole("combobox", { name: "Job Title" })).toHaveCount(0);
  const company = page.getByRole("combobox", { name: "Company" });
  await company.pressSequentially("hoot");
  await page.getByRole("option", { name: "Hootsuite" }).click();
  const title = page.getByRole("combobox", { name: "Job Title" });
  await expect(title).toBeVisible();
  await title.pressSequentially("soft");
  await page.getByRole("option", { name: "Software Engineer" }).click();
  await expect(title).toHaveValue("Software Engineer");

  await company.fill("");
  await company.pressSequentially("clio");
  await page.getByRole("option", { name: "Clio" }).click();
  await expect(page.getByRole("combobox", { name: "Job Title" })).toHaveValue("");
});
