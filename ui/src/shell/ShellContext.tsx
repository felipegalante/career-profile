import { createContext, useContext } from "react";

export interface ShellState {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  openPalette: () => void;
  hasPalette: boolean;
  sidebarId: string;
}

export const ShellContext = createContext<ShellState | null>(null);

/** Shell state for controls rendered inside AppShell; null outside it. */
export function useShell(): ShellState | null {
  return useContext(ShellContext);
}
