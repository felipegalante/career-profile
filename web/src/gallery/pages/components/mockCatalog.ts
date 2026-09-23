import type { CatalogOption, CatalogSearch, CatalogSearchResult } from "@career-profile/ui";

export interface MockEntry {
  id: string;
  label: string;
  meta?: CatalogOption["meta"];
  isDisabled?: boolean;
}

const normalize = (value: string) => value.trim().toLocaleLowerCase();

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/** Ranks exact, prefix, then substring matches, mimicking the server catalog search for gallery demos. */
export function rankEntries(entries: MockEntry[], query: string): CatalogSearchResult {
  const needle = normalize(query);
  const rank = (entry: MockEntry) => {
    const label = normalize(entry.label);
    if (label === needle) return 0;
    if (label.startsWith(needle)) return 1;
    if (label.includes(needle)) return 2;
    return -1;
  };
  const options = entries
    .map((entry) => ({ entry, score: rank(entry) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => a.score - b.score || a.entry.label.localeCompare(b.entry.label))
    .slice(0, 8)
    .map(({ entry }) => entry);
  return { options, hasExactMatch: options.some((option) => normalize(option.label) === needle) };
}

export function mockSearch<P = undefined>(entries: MockEntry[] | ((parent: P) => MockEntry[]), delay = 180): CatalogSearch<P> {
  return async (query, { signal, parentContext }) => {
    await wait(delay, signal);
    return rankEntries(typeof entries === "function" ? entries(parentContext) : entries, query);
  };
}

export const neverResolves: CatalogSearch<undefined> = (_query, { signal }) => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError"))));

export const alwaysEmpty: CatalogSearch<undefined> = async () => ({ options: [], hasExactMatch: false });

export const alwaysFails: CatalogSearch<undefined> = async () => {
  throw new Error("Catalog search is unavailable");
};

export const companies: MockEntry[] = ["Shopify", "Shopify Plus", "Shoppers Drug Mart", "Hootsuite", "Northstar Labs", "Amazon Web Services", "Clio", "Slack"].map((label) => ({ id: label.toLowerCase().replace(/\W+/g, "-"), label, meta: "Catalog" }));
