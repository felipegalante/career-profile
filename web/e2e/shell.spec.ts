import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { galleryUrl, WCAG_TAGS } from "./support/artifacts";

const rail = (page: Page) => page.locator("aside");
const railWidth = async (page: Page) => (await rail(page).boundingBox())?.width;
const palette = (page: Page) => page.getByRole("dialog", { name: "Command palette" });

test.beforeEach(async ({ page }) => {
  await page.goto(galleryUrl("shell/sidebar"));
  await expect(page.getByRole("heading", { level: 1, name: "Skills" })).toBeVisible();
});

test("Cmd+B and Ctrl+B toggle the rail without losing page state or the route", async ({ page }) => {
  const notes = page.getByLabel("Notes", { exact: true });
  await notes.fill("Unsaved draft");
  const url = page.url();
  expect(await railWidth(page)).toBe(236);
  await page.keyboard.press("Meta+b");
  await expect.poll(() => railWidth(page)).toBe(72);
  await page.keyboard.press("Control+b");
  await expect.poll(() => railWidth(page)).toBe(236);
  await expect(notes).toHaveValue("Unsaved draft");
  expect(page.url()).toBe(url);
});

test("a contenteditable editor keeps Cmd/Ctrl+B", async ({ page }) => {
  await page.getByTestId("rich-text").click();
  await page.keyboard.press("Control+b");
  await expect.poll(() => railWidth(page)).toBe(236);
});

test("Cmd/Ctrl+K opens the palette; arrows and Enter run a command; Escape restores focus", async ({ page }) => {
  const notes = page.getByLabel("Notes", { exact: true });
  await notes.focus();
  await page.keyboard.press("Control+k");
  await expect(palette(page)).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Search pages and actions" }).or(page.getByRole("searchbox", { name: "Search pages and actions" }))).toBeFocused();
  await page.keyboard.type("skills");
  await page.keyboard.press("Enter");
  await expect(palette(page)).toBeHidden();
  await expect(page.getByTestId("last-command")).toHaveText("Last command: Edit skills");

  await page.keyboard.press("Meta+k");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");
  await expect(palette(page)).toBeHidden();
  await expect(notes).toBeFocused();
});

test("the command trigger opens the palette and regains focus when it closes", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Search or run a command" });
  await expect(trigger).toHaveAttribute("aria-keyshortcuts", "Meta+K Control+K");
  await trigger.click();
  await expect(palette(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("navigation commands route through the application router", async ({ page }) => {
  await page.keyboard.press("Control+k");
  await page.keyboard.type("professional");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#\/shell\/keyboard-shortcuts$/);
});

test("a blocking dialog wins over Cmd/Ctrl+K", async ({ page }) => {
  await page.getByRole("button", { name: "Open blocking dialog" }).click();
  await expect(page.getByRole("dialog", { name: "Blocking dialog" })).toBeVisible();
  await page.keyboard.press("Control+k");
  await expect(palette(page)).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Blocking dialog" })).toBeVisible();
});

test("collapsed rail links keep their names and show a tooltip on keyboard focus", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect.poll(() => railWidth(page)).toBe(72);
  const focusLink = rail(page).getByRole("link", { name: "Professional Focus" });
  await focusLink.focus();
  await expect(page.getByRole("tooltip")).toHaveText("Professional Focus");
});

test("the account menu lists account actions", async ({ page }) => {
  await rail(page).getByRole("button", { name: /Maya Chen/ }).click();
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem", { name: "Settings" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Sign out" })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test("the open palette has no accessibility violations", async ({ page }) => {
  await page.keyboard.press("Control+k");
  await expect(palette(page)).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test.describe("at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the rail becomes a top bar with a focus-trapping drawer", async ({ page }) => {
    await expect(rail(page)).toBeHidden();
    await expect(page.getByRole("button", { name: "Search or run a command" })).toBeHidden();
    const menuButton = page.getByRole("button", { name: "Open navigation" });
    await menuButton.click();
    const drawer = page.getByRole("dialog", { name: "Navigation" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Professional Focus" })).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Sign out" })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(menuButton).toBeFocused();
  });

  test("the page does not scroll horizontally", async ({ page }) => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});
