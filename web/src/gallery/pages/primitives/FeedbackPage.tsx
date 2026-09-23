import { Avatar, Badge, Button, Callout, Chip, ChipList, Grid, Kbd, LoadingSkeleton, ProgressBar, Row, ShortcutHint, Skeleton, Stack, Stepper, Text, ToastView, useToast } from "@career-profile/ui";
import { DocPage, NotArtifactBacked, Specimen } from "../../chrome/DocPage";

function LiveToasts() {
  const toast = useToast();
  return (
    <Row className="flex-wrap">
      <Button onPress={() => toast.show({ title: "Skill added at Intermediate", description: "GraphQL is now in your profile." })}>Show success toast</Button>
      <Button onPress={() => toast.show({ tone: "danger", title: "This skill is already in your profile." })}>Show danger toast</Button>
      <Button onPress={() => toast.show({ title: "TypeScript removed from your profile", action: { label: "Undo", onAction: () => toast.show({ title: "TypeScript restored" }) } })}>Show Undo toast</Button>
    </Row>
  );
}

export function FeedbackPage() {
  return (
    <DocPage overline="Primitives" title="Feedback and disclosure" description="Success, warning, danger, loading, and progressive disclosure patterns.">
      <Grid columns={2}>
        <Specimen title="Callouts" description="Inline explanations and recoverable issues.">
          <Stack>
            <Callout data-parity-id="callout-info">Company selection determines which job titles are suggested first.</Callout>
            <Callout tone="success" data-parity-id="callout-success">Profile updated.</Callout>
            <Callout tone="warning" data-parity-id="callout-warning">Changing Institution will clear the selected Major / Specialization.</Callout>
            <Callout tone="danger" data-parity-id="callout-danger">Could not save this record. Try again.</Callout>
          </Stack>
        </Specimen>
        <Specimen title="Toasts" description="Short-lived mutation feedback.">
          <ToastView title="Skill added at Intermediate" description="GraphQL is now in your profile." onDismiss={() => undefined} data-parity-id="toast-success" className="w-auto" />
          <ToastView tone="danger" title="This skill is already in your profile." onDismiss={() => undefined} className="mt-3 w-auto" />
          <h2 style={{ marginTop: 24 }}>Loading</h2>
          <Stack>
            <div data-parity-id="skeleton-lg"><Skeleton size="lg" /></div>
            <Skeleton width="82%" />
            <Skeleton width="68%" />
          </Stack>
        </Specimen>
      </Grid>
      <Grid columns={2} className="mt-4">
        <Specimen title="Live toasts" description="Toasts announce through the notification region. Timers pause while hovered or focused.">
          <LiveToasts />
          <div className="mt-4 flex items-center gap-2"><NotArtifactBacked /><Text variant="meta" tone="muted">The Undo action button is not drawn in any artifact.</Text></div>
          <ToastView title="TypeScript removed from your profile" action={{ label: "Undo", onAction: () => undefined }} onDismiss={() => undefined} className="mt-3 w-auto" />
        </Specimen>
        <Specimen title="Badges, avatars and chips" description="Status pills, initials avatars and label chips.">
          <Stack>
            <Row className="flex-wrap">
              <Badge>User</Badge>
              <Badge tone="brand" data-parity-id="badge-brand">Admin</Badge>
              <Badge tone="success" data-parity-id="badge-success">Complete</Badge>
              <Badge tone="warning">Incomplete</Badge>
              <Badge tone="danger">Expired</Badge>
              <Badge tone="outline">Catalog</Badge>
            </Row>
            <Row>
              <Avatar name="Alex Rivera" size="sm" />
              <Avatar name="Maya Chen" />
              <Avatar name="Maya Chen" size="lg" data-parity-id="avatar-lg" />
            </Row>
            <ChipList className="mt-0">
              <Chip as="li" data-parity-id="chip-brand">TypeScript</Chip>
              <Chip as="li" tone="neutral" data-parity-id="chip-neutral">Product &amp; Strategy</Chip>
              <Chip as="li" tone="custom" data-parity-id="chip-custom">GraphQL <Text variant="meta">Custom</Text></Chip>
              <Chip as="li" tone="neutral">+4 more</Chip>
            </ChipList>
          </Stack>
        </Specimen>
        <Specimen title="Progress, steps and shortcuts" description="Completion track, onboarding stepper and keyboard hints.">
          <Stack>
            <div>
              <Row justify="between"><Text variant="overline" id="completeness-label">Profile completeness</Text><Badge tone="success">On track</Badge></Row>
              <ProgressBar aria-labelledby="completeness-label" value={82} className="mt-3" data-parity-id="progress" />
            </div>
            <Stepper steps={["Basics", "Career context", "Professional focus", "Skills"]} current={2} data-parity-id="stepper" />
            <Row><Kbd data-parity-id="kbd">Esc</Kbd><ShortcutHint keyName="k" /><Kbd>↑ ↓</Kbd><Kbd>Enter</Kbd></Row>
          </Stack>
        </Specimen>
        <Specimen title="Loading state" description="Collection placeholder announced as a status.">
          <LoadingSkeleton label="Loading work experience" />
        </Specimen>
      </Grid>
    </DocPage>
  );
}
