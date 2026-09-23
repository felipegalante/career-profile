import { ariaKeyShortcuts } from "../foundations/platform";
import { ShortcutHint } from "../primitives/Kbd/Kbd";
import { useShell } from "./ShellContext";
import styles from "./ShellControls.module.css";

/* Native buttons: React Aria's Button does not forward aria-keyshortcuts. */

export interface CommandTriggerProps {
  label?: string;
  /** Defaults to opening the AppShell palette; required outside AppShell. */
  onPress?: () => void;
}

/** Visible entry point for the command palette; mirrors Cmd/Ctrl+K. */
export function CommandTrigger({ label = "Search or run a command", onPress }: CommandTriggerProps) {
  const shell = useShell();
  const open = onPress ?? (shell?.hasPalette ? shell.openPalette : undefined);
  if (!open) return null;
  return (
    <button type="button" className={styles.trigger} aria-keyshortcuts={ariaKeyShortcuts("k")} onClick={open}>
      <span>{label}</span>
      <span aria-hidden="true"><ShortcutHint keyName="k" /></span>
    </button>
  );
}

export interface SidebarToggleProps {
  label?: string;
  /** Defaults to the AppShell rail; `onPress` and `isExpanded` are required outside AppShell. */
  onPress?: () => void;
  isExpanded?: boolean;
}

/** Visible control for collapsing the navigation rail; mirrors Cmd/Ctrl+B. */
export function SidebarToggle({ label = "Toggle navigation", onPress, isExpanded }: SidebarToggleProps) {
  const shell = useShell();
  const toggle = onPress ?? shell?.toggleCollapsed;
  if (!toggle) return null;
  return (
    <button type="button" className={styles.toggle} aria-keyshortcuts={ariaKeyShortcuts("b")} aria-expanded={isExpanded ?? (shell ? !shell.isCollapsed : undefined)} aria-controls={shell?.sidebarId} onClick={toggle}>
      <span>{label}</span>
      <span aria-hidden="true"><ShortcutHint keyName="b" /></span>
    </button>
  );
}
