import type { ReactNode } from "react";
import { RouterProvider } from "react-aria-components";
import { ToastProvider } from "../primitives/Toast/Toast";

export interface UiProviderProps {
  /** Client-side navigation used by library links, menu items and tabs with an `href`. */
  navigate?: (href: string) => void;
  /** Converts a router path into a real href, for routers with a base path or hash history. */
  useHref?: (href: string) => string;
  children: ReactNode;
}

/** Root provider for the shared UI: router integration and the notification region. */
export function UiProvider({ navigate, useHref, children }: UiProviderProps) {
  const content = <ToastProvider>{children}</ToastProvider>;
  return navigate ? <RouterProvider navigate={navigate} useHref={useHref}>{content}</RouterProvider> : content;
}
