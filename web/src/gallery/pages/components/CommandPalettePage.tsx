import { AppShell, PageHeader, Surface, Text } from "@career-profile/ui";
import { demoAccount, demoCommands, demoNavigation } from "../shell/shellDemo";

export function CommandPalettePage() {
  return (
    <AppShell navigation={demoNavigation} currentItemId="profile" account={demoAccount} commands={demoCommands(() => undefined)} defaultPaletteOpen>
      <PageHeader title="Profile" description="Command palette open state" />
      <Surface padding="lg">
        <Text variant="section" as="div">Application content remains in place</Text>
        <p className="text-ink-2">The command palette overlays the current context and returns focus when closed.</p>
      </Surface>
    </AppShell>
  );
}
