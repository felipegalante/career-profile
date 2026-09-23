import { expect, test, type Page } from "@playwright/test";
import { galleryUrl } from "./support/artifacts";

const lane = (page: Page, category: "TECHNICAL" | "FOUNDATIONAL", level: string) => page.locator(`[data-skill-category="${category}"] section[data-proficiency="${level}"]`);
const chip = (page: Page, id: string) => page.locator(`li[data-skill-id="${id}"]`);
const dragArea = (page: Page, id: string) => chip(page, id).locator("[draggable=true]");

test.beforeEach(async ({ page }) => {
  await page.goto(galleryUrl("components/skills"));
  await expect(chip(page, "postgresql")).toBeVisible();
});

test("dragging a chip moves it to another proficiency in the same category", async ({ page }) => {
  await dragArea(page, "postgresql").dragTo(lane(page, "TECHNICAL", "ADVANCED"));
  await expect(lane(page, "TECHNICAL", "ADVANCED").locator('li[data-skill-id="postgresql"]')).toBeVisible();
  await expect(lane(page, "TECHNICAL", "INTERMEDIATE").locator('li[data-skill-id="postgresql"]')).toHaveCount(0);
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(page.getByText("PostgreSQL moved to Advanced. Category remains Technical.")).toBeAttached();
});

test("dragging into the other category is rejected", async ({ page }) => {
  await dragArea(page, "postgresql").dragTo(lane(page, "FOUNDATIONAL", "ADVANCED"));
  await expect(lane(page, "TECHNICAL", "INTERMEDIATE").locator('li[data-skill-id="postgresql"]')).toBeVisible();
  await expect(lane(page, "FOUNDATIONAL", "ADVANCED").locator('li[data-skill-id="postgresql"]')).toHaveCount(0);
});

test("dragging from the remove button neither moves nor removes the skill", async ({ page }) => {
  await chip(page, "aws").getByRole("button", { name: "Remove AWS" }).dragTo(lane(page, "TECHNICAL", "ADVANCED"));
  await expect(lane(page, "TECHNICAL", "INTERMEDIATE").locator('li[data-skill-id="aws"]')).toBeVisible();
});

test("the Move menu is the keyboard path", async ({ page }) => {
  await chip(page, "aws").getByRole("button", { name: "AWS, Intermediate" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menu", { name: "Move AWS" })).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(lane(page, "TECHNICAL", "ADVANCED").locator('li[data-skill-id="aws"]')).toBeVisible();
});

test("removing a skill offers Undo", async ({ page }) => {
  await chip(page, "react").getByRole("button", { name: "Remove React" }).click();
  await expect(chip(page, "react")).toHaveCount(0);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(lane(page, "TECHNICAL", "ADVANCED").locator('li[data-skill-id="react"]')).toBeVisible();
});
