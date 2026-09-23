import { describe, expect, it } from "vitest";
import { ariaKeyShortcuts, detectModifierPlatform, shortcutLabel } from "./platform";

const nav = (platform: string, uaPlatform?: string) => ({ platform, userAgentData: uaPlatform ? { platform: uaPlatform } : undefined }) as unknown as Navigator;

describe("platform shortcut labels", () => {
  it("uses the command symbol on Apple platforms and Ctrl elsewhere", () => {
    expect(detectModifierPlatform(nav("MacIntel"))).toBe("apple");
    expect(detectModifierPlatform(nav("", "macOS"))).toBe("apple");
    expect(detectModifierPlatform(nav("Win32"))).toBe("other");
    expect(detectModifierPlatform(nav("Linux x86_64"))).toBe("other");
    expect(shortcutLabel("k", "apple")).toBe("⌘ K");
    expect(shortcutLabel("b", "other")).toBe("Ctrl B");
  });

  it("exposes both modifier variants to assistive technology", () => {
    expect(ariaKeyShortcuts("k")).toBe("Meta+K Control+K");
  });
});
