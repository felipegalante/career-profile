import type { AppShellProps, Command } from "@career-profile/ui";

export const demoNavigation: AppShellProps["navigation"] = [
  {
    id: "my-profile",
    label: "My profile",
    items: [
      { id: "profile", label: "Profile", icon: "home", href: "/shell/sidebar" },
      { id: "focus", label: "Professional Focus", icon: "target", href: "/shell/keyboard-shortcuts" },
    ],
  },
];

export const demoAccount: AppShellProps["account"] = {
  name: "Maya Chen",
  subtitle: "Vancouver, BC",
  actions: [
    { id: "account-profile", label: "Profile", icon: "user", href: "/primitives/overlays" },
    { id: "account-settings", label: "Settings", icon: "settings", href: "/primitives/overlays" },
    { id: "sign-out", label: "Sign out", icon: "sign-out", tone: "danger", separated: true, href: "/" },
  ],
};

export function demoCommands(onRun: (label: string) => void): Command[] {
  return [
    { id: "go-profile", label: "Profile", description: "Go to your Profile workspace", group: "Navigation", icon: "home", href: "/shell/sidebar" },
    { id: "go-focus", label: "Professional Focus", group: "Navigation", icon: "target", href: "/shell/keyboard-shortcuts" },
    { id: "go-settings", label: "Account · Settings", group: "Navigation", icon: "user", href: "/primitives/overlays" },
    { id: "add-experience", label: "Add work experience", description: "Open the Work Experience dialog", group: "Profile actions", icon: "plus", onAction: () => onRun("Add work experience") },
    { id: "edit-skills", label: "Edit skills", group: "Profile actions", icon: "trend", onAction: () => onRun("Edit skills") },
    { id: "resume-tools", label: "Open Resume Tools", group: "Profile actions", icon: "file", onAction: () => onRun("Open Resume Tools") },
  ];
}
