import { useState } from "react";
import { AppShell, Button, ButtonLink, Dialog, DialogTrigger, Grid, PageHeader, Surface, Text, TextField } from "@career-profile/ui";
import { Stat, editorClassName } from "../../chrome/DocPage";
import { demoAccount, demoCommands, demoNavigation } from "./shellDemo";

export function SidebarPage() {
  const [lastCommand, setLastCommand] = useState("None yet");
  return (
    <AppShell navigation={demoNavigation} currentItemId="profile" account={demoAccount} commands={demoCommands(setLastCommand)}>
      <PageHeader title="Skills" description="Organize the skills that best represent your profile" actions={<ButtonLink variant="secondary" href="/shell/mobile">Preview mobile</ButtonLink>} />
      <Surface padding="lg">
        <Text variant="overline" as="div">Shell anatomy</Text>
        <Text variant="record" as="div" className="mt-2">Fixed profile rail + focused content canvas</Text>
        <p className="mt-1.5 mb-0 max-w-[650px] text-ink-2">The primary rail stays intentionally compact: Profile, Professional Focus, and role-gated Administration. Detailed profile records are managed inside Profile rather than as separate navigation modules.</p>
        <Grid columns={3} className="mt-5">
          <Stat value="236" label="px navigation rail" />
          <Stat value="32" label="px page gutter" />
          <Stat value="12" label="px surface radius" />
        </Grid>
      </Surface>
      <Surface padding="lg" className="mt-4">
        <Text variant="section" as="h2">Shortcut test bench</Text>
        <p className="mt-1 text-ink-2">Page state survives Cmd/Ctrl+B, a contenteditable editor keeps Cmd/Ctrl+B for bold, and a blocking dialog wins over Cmd/Ctrl+K.</p>
        <Grid columns={2} className="mt-4">
          <TextField label="Notes" />
          <div>
            <div id="rich-text-label" className="mb-1.5 font-medium">Rich text notes</div>
            <div role="textbox" aria-multiline="true" aria-labelledby="rich-text-label" tabIndex={0} contentEditable suppressContentEditableWarning className={editorClassName} data-testid="rich-text" />
          </div>
        </Grid>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <DialogTrigger>
            <Button>Open blocking dialog</Button>
            <Dialog title="Blocking dialog" footer={<Button slot="close" variant="primary">Done</Button>}>Cmd/Ctrl+K is ignored while this dialog is open.</Dialog>
          </DialogTrigger>
          <Text variant="meta" tone="muted" role="status" data-testid="last-command">Last command: {lastCommand}</Text>
        </div>
      </Surface>
    </AppShell>
  );
}
