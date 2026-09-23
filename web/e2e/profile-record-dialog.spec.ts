import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { galleryUrl, WCAG_TAGS } from "./support/artifacts";

test("record dialog validates, blocks dismissal while saving, recovers from errors and confirms", async ({ page }) => {
  await page.goto(galleryUrl("components/profile-record-dialog"));
  const opener = page.getByRole("button", { name: "Open work experience dialog" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Add work experience" });
  await expect(dialog).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);

  await dialog.getByRole("textbox", { name: "Start Date" }).press("Enter");
  await expect(dialog.getByText("Select or create a company.")).toBeVisible();

  const company = dialog.getByRole("combobox", { name: "Company" });
  await company.pressSequentially("shop");
  await page.getByRole("option", { name: "Shopify", exact: true }).click();
  await expect(dialog.getByRole("combobox", { name: "Job Title" })).toBeVisible();

  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog.getByRole("button", { name: "Saving…" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toHaveText("We couldn’t save this record. Your entries are still here.");
  await expect(company).toHaveValue("Shopify");

  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("status").getByText("Experience added")).toBeVisible();
  await expect(opener).toBeFocused();
});
