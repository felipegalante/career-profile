import { Callout, CommandTrigger, Grid, Kbd, SidebarToggle, Stack, Text } from "@career-profile/ui";
import { DemoNote, DocPage, ShortcutRow, Specimen } from "../../chrome/DocPage";

export function KeyboardShortcutsPage() {
  return (
    <DocPage overline="Application shell" title="Keyboard shortcuts" description="Required desktop accelerators for navigation and command access. Visible controls remain available for every shortcut action.">
      <Grid columns={2}>
        <Specimen title="Required shortcuts" description={<>Use the platform modifier: <b>⌘</b> on macOS and <b>Ctrl</b> on Windows/Linux.</>}>
          <ShortcutRow action="Toggle sidebar" description="Collapse or expand the authenticated navigation rail." keys={<><Kbd>⌘ B</Kbd><Text tone="muted">/</Text><Kbd>Ctrl B</Kbd></>} />
          <ShortcutRow action="Open command palette" description="Search navigation and relevant actions." keys={<><Kbd>⌘ K</Kbd><Text tone="muted">/</Text><Kbd>Ctrl K</Kbd></>} />
          <ShortcutRow action="Close palette" description="Restore focus to the control that opened it." keys={<Kbd>Esc</Kbd>} />
          <ShortcutRow action="Navigate commands" description="Move the active command and invoke it." keys={<><Kbd>↑ ↓</Kbd><Kbd>Enter</Kbd></>} />
        </Specimen>
        <Specimen title="Discoverability" description="Shortcut hints appear beside the same visible controls users can click or focus.">
          <Stack className="mt-[18px] items-start">
            <CommandTrigger onPress={() => undefined} />
            <SidebarToggle onPress={() => undefined} isExpanded />
            <DemoNote>The implementation swaps ⌘ for Ctrl on Windows/Linux and exposes <Text mono>aria-keyshortcuts</Text> on direct shortcut controls.</DemoNote>
          </Stack>
          <h2 style={{ marginTop: 26 }}>Conflict rules</h2>
          <Stack>
            <Callout icon={null}><b>Blocking modal wins</b><Text as="div" variant="meta" className="mt-[3px]">Do not stack the command palette over a modal/dialog that already traps focus.</Text></Callout>
            <Callout icon={null}><b>Rich text can reserve bold</b><Text as="div" variant="meta" className="mt-[3px]">Do not intercept Cmd/Ctrl+B inside an intentional contenteditable editor.</Text></Callout>
          </Stack>
        </Specimen>
      </Grid>
    </DocPage>
  );
}
