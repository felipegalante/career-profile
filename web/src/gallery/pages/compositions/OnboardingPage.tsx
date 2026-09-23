import { AuthHeader, AuthLayout, Button, Grid, Row, Select, Stack, Stepper, TextField } from "@career-profile/ui";
import { DemoShowcase } from "./authShowcase";

const languages = ["English", "French", "Spanish", "Portuguese"].map((label) => ({ id: label, label }));

export function OnboardingPage() {
  return (
    <AuthLayout art={<DemoShowcase />}>
      <Stepper steps={["Basics", "Career context", "Professional focus", "Skills"]} current={1} className="mb-7" />
      <AuthHeader overline="Step 1 of 4" title="Tell us the basics" lead="Start with the information that identifies your profile." />
      <Stack gap={14}>
        <Grid columns={2}>
          <TextField label="First name" isRequired defaultValue="Maya" />
          <TextField label="Last name" isRequired defaultValue="Chen" />
        </Grid>
        <TextField label="Location" placeholder="City, region, country" />
        <Select label="Preferred language" items={languages} defaultValue="English" />
      </Stack>
      <Row justify="between" className="mt-6">
        <Button variant="ghost">Skip for now</Button>
        <Button variant="primary" size="lg">Continue</Button>
      </Row>
    </AuthLayout>
  );
}
