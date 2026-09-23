import { useState, type HTMLAttributes } from "react";
import { cx } from "../../foundations/classNames";
import { detectModifierPlatform, shortcutLabel } from "../../foundations/platform";
import styles from "./Kbd.module.css";

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <kbd {...props} className={cx(styles.kbd, className)} />;
}

/** Platform-aware hint for a Cmd/Ctrl shortcut, for example `⌘ K` or `Ctrl K`. */
export function ShortcutHint({ keyName, className }: { keyName: string; className?: string }) {
  const [platform] = useState(detectModifierPlatform);
  return <Kbd className={className}>{shortcutLabel(keyName, platform)}</Kbd>;
}
