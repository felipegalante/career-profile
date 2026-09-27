import { expect, test, type Page } from "@playwright/test";
import { galleryUrl } from "./support/artifacts";

const stack = 'section[aria-label="Notifications"]';
const politeAnnouncer = `${stack} ~ [role="status"]`;
const assertiveAnnouncer = `${stack} ~ [role="alert"]`;

/**
 * Chromium's accessibility-tree view of one element. Modals hide the page with `inert`, which
 * only a real browser applies, so this reads the browser's tree rather than DOM attributes.
 */
async function accessibilityOf(page: Page, selector: string) {
  const cdp = await page.context().newCDPSession(page);
  try {
    const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
    const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector });
    const { nodes } = await cdp.send("Accessibility.getPartialAXTree", { nodeId, fetchRelatives: false });
    return { isExposed: !nodes[0].ignored, reasons: (nodes[0].ignoredReasons ?? []).map((reason) => reason.name) };
  } finally {
    await cdp.detach();
  }
}

test("toast live regions stay exposed while a dialog hides the page and announce the save that closes it", async ({ page }) => {
  await page.goto(galleryUrl("components/profile-record-dialog"));
  await page.getByRole("button", { name: "Open work experience dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Add work experience" });
  await expect(dialog).toBeVisible();

  expect(await accessibilityOf(page, politeAnnouncer)).toEqual({ isExposed: true, reasons: [] });
  expect(await accessibilityOf(page, assertiveAnnouncer)).toEqual({ isExposed: true, reasons: [] });
  expect(await accessibilityOf(page, stack)).toEqual({ isExposed: false, reasons: ["inertElement"] });

  await dialog.getByRole("combobox", { name: "Company" }).pressSequentially("shop");
  await page.getByRole("option", { name: "Shopify", exact: true }).click();
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog.getByRole("alert")).toBeVisible();
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();

  await expect(page.locator(politeAnnouncer)).toContainText("Experience added");
  expect(await accessibilityOf(page, politeAnnouncer)).toEqual({ isExposed: true, reasons: [] });
  expect((await accessibilityOf(page, stack)).isExposed).toBe(true);
});
