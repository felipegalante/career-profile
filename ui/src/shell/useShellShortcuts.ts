import { useEffect, useRef } from "react";
import { isBlockingDialogOpen } from "../primitives/Dialog/Dialog";

export interface ShellShortcutHandlers {
  onToggleSidebar: () => void;
  onOpenPalette: () => void;
}

function isRichTextTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || target.closest('[contenteditable="true"], [contenteditable=""]') !== null;
}

/** Cmd/Ctrl plus a letter, without Alt or Shift so browser and OS combinations stay untouched. */
export function isModifierShortcut(event: KeyboardEvent, key: string): boolean {
  return (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === key;
}

/**
 * Cmd/Ctrl+B toggles the sidebar and Cmd/Ctrl+K opens the command palette. The browser default
 * is prevented only when a shortcut is accepted. Both yield to an open blocking dialog, and
 * Cmd/Ctrl+B yields to contenteditable editors that use it for bold.
 */
export function useShellShortcuts(handlers: ShellShortcutHandlers, enabled = true): void {
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(() => {
    if (!enabled) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing) return;
      if (isModifierShortcut(event, "b")) {
        if (isRichTextTarget(event.target) || isBlockingDialogOpen()) return;
        event.preventDefault();
        latest.current.onToggleSidebar();
      } else if (isModifierShortcut(event, "k")) {
        if (isBlockingDialogOpen()) return;
        event.preventDefault();
        latest.current.onOpenPalette();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}
