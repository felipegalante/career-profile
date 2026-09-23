import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Page } from "@playwright/test";

const artifactRoot = resolve(import.meta.dirname, "../../../docs/design/artifacts");

/** file:// URL of a design artifact page; artifacts load their shared stylesheet by relative path. */
export function artifactUrl(relativePath: string): string {
  return pathToFileURL(resolve(artifactRoot, relativePath)).href;
}

/** Artifacts import Geist from Google Fonts; computed styles do not depend on it, so skip the network. */
export async function blockRemoteFonts(page: Page): Promise<void> {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
}

export function galleryUrl(path: string): string {
  return `/gallery.html#/${path}`;
}

export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
