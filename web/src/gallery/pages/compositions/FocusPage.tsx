import { AppShell, Button, FocusCard, Grid, Icon, PageHeader, Row, Surface, Text } from "@career-profile/ui";
import { demoAccount, demoCommands, demoNavigation } from "../shell/shellDemo";

export function FocusPage() {
  return (
    <AppShell navigation={demoNavigation} currentItemId="focus" account={demoAccount} commands={demoCommands(() => undefined)}>
      <PageHeader title="Professional Focus" description="Describe the areas you want your profile to emphasize." backLink={{ href: "/compositions/profile-empty" }} />
      <Surface padding="lg">
        <Row justify="between">
          <div>
            <Text variant="section" as="h2">Professional Focus</Text>
            <Text variant="meta" tone="faint" as="div">The areas you want your profile to emphasize.</Text>
          </div>
          <Button variant="secondary"><Icon name="pencil" />Edit</Button>
        </Row>
        <Grid columns={3} className="mt-5">
          <FocusCard icon="bar-chart" title="Software & Technology" description="Software engineering, platforms, cloud, and technical product work." isPrimary data-parity-id="focus-card" />
          <FocusCard icon="target" iconTone="accent" title="Product & Strategy" description="Product thinking, strategy, discovery, and cross-functional execution." data-parity-id="focus-card-accent" />
          <FocusCard icon="bar-chart" iconTone="info" title="Data & Analytics" description="Data systems, analysis, decision support, and measurement." data-parity-id="focus-card-info" />
        </Grid>
      </Surface>
    </AppShell>
  );
}
