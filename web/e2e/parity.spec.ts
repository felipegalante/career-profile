import { expect, test, type Page } from "@playwright/test";
import { artifactUrl, blockRemoteFonts, galleryUrl } from "./support/artifacts";
import { parityDeviations } from "./parity/deviations";
import { parityPairs, type ParityPair } from "./parity/pairs";

async function computedStyles(page: Page, selector: string, pair: ParityPair): Promise<Record<string, string>> {
  const element = page.locator(selector).first();
  await expect(element, `${pair.id}: ${selector}`).toBeAttached();
  if (pair.state === "hover") await element.hover();
  if (pair.state === "focus") await element.focus();
  return element.evaluate((node, properties) => {
    const style = getComputedStyle(node);
    return Object.fromEntries(properties.map((property) => [property, style.getPropertyValue(property)]));
  }, pair.properties);
}

for (const pair of parityPairs) {
  test(`${pair.id} matches ${pair.artifact}`, async ({ page, context }) => {
    await blockRemoteFonts(page);
    await page.goto(artifactUrl(pair.artifact));
    const expected = await computedStyles(page, pair.artifactSelector, pair);

    const gallery = await context.newPage();
    await gallery.goto(galleryUrl(pair.gallery));
    const actual = await computedStyles(gallery, pair.gallerySelector ?? `[data-parity-id="${pair.id}"]`, pair);

    for (const property of pair.properties) {
      const deviation = parityDeviations.find((entry) => entry.id === pair.id && entry.property === property);
      if (deviation) expect(actual[property], `${pair.id} ${property} should still differ: ${deviation.reason}`).not.toBe(expected[property]);
      else expect(actual[property], `${pair.id} ${property}`).toBe(expected[property]);
    }
  });
}

test("every deviation refers to a compared property", () => {
  for (const deviation of parityDeviations) {
    const pair = parityPairs.find((entry) => entry.id === deviation.id);
    expect(pair?.properties, deviation.id).toContain(deviation.property);
  }
});
