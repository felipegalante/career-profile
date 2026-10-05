import type { ReactNode } from "react";
import { useHref, useNavigate } from "react-router";
import { UiProvider } from "@career-profile/ui";

/** Connects shared UI links, menu items and tabs to the router and hosts the toast region. */
export function UiRoot({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return <UiProvider navigate={navigate} useHref={useHref}>{children}</UiProvider>;
}
