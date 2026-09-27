export type ModifierPlatform = "apple" | "other";

type NavigatorWithUserAgentData = Navigator & { userAgentData?: { platform?: string } };

export function detectModifierPlatform(nav: NavigatorWithUserAgentData | undefined = typeof navigator === "undefined" ? undefined : navigator): ModifierPlatform {
  const platform = nav?.userAgentData?.platform || nav?.platform || "";
  return /mac|iphone|ipad|ipod/i.test(platform) ? "apple" : "other";
}

/** Visible shortcut hint, for example `⌘ K` on Apple platforms and `Ctrl K` elsewhere. */
export function shortcutLabel(key: string, platform: ModifierPlatform = detectModifierPlatform()): string {
  return `${platform === "apple" ? "⌘" : "Ctrl"} ${key.toUpperCase()}`;
}

/** `aria-keyshortcuts` value covering both the Meta and Control variants of a shortcut. */
export function ariaKeyShortcuts(key: string): string {
  const upper = key.toUpperCase();
  return `Meta+${upper} Control+${upper}`;
}
