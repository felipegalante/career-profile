import { BackLink, Button, ButtonLink, Checkbox, Grid, Icon, PasswordField, Radio, RadioGroup, Row, Select, Stack, TextAreaField, TextField, TextLink } from "@career-profile/ui";
import { DocPage, Specimen } from "../../chrome/DocPage";

const employmentTypes = ["Full-time", "Part-time", "Self-employed", "Contract", "Internship / Co-op", "Apprenticeship", "Seasonal / Summer", "Volunteer", "Other"].map((label) => ({ id: label, label }));

export function ActionsInputsPage() {
  return (
    <DocPage overline="Primitives" title="Actions and inputs" description="Core controls share consistent height, radius, focus, disabled, and validation behavior.">
      <Specimen title="Buttons" description="Primary for one clear next action, secondary for alternatives, ghost for low-emphasis actions.">
        <Row className="flex-wrap">
          <Button variant="primary" data-parity-id="btn-primary">Save changes</Button>
          <Button variant="secondary" data-parity-id="btn-secondary">Cancel</Button>
          <Button variant="ghost" data-parity-id="btn-ghost">Edit</Button>
          <Button variant="danger" data-parity-id="btn-danger">Remove</Button>
          <Button variant="primary" isDisabled data-parity-id="btn-disabled">Saving…</Button>
        </Row>
      </Specimen>
      <Specimen title="Inputs" description="Default, focused, and invalid states." style={{ marginTop: 16 }}>
        <Grid columns={2}>
          <TextField label="Email" defaultValue="maya@example.com" data-parity-id="field-email" />
          <TextField label="Location" defaultValue="Vancouver, BC" autoFocus data-parity-id="field-location" />
          <TextField label="LinkedIn URL" defaultValue="linkedin" isInvalid data-parity-id="field-linkedin" />
        </Grid>
      </Specimen>
      <Specimen title="Checkboxes and selects" description="Use native semantics with system styling." style={{ marginTop: 16 }}>
        <Row className="flex-wrap" gap={22}>
          <Checkbox defaultSelected data-parity-id="check-current">I currently work here</Checkbox>
          <RadioGroup aria-label="Focus" defaultValue="primary">
            <Radio value="primary" data-parity-id="radio-primary">Primary focus</Radio>
          </RadioGroup>
          <div style={{ width: 210 }}>
            <Select label="Employment Type" items={employmentTypes} defaultValue="Full-time" data-parity-id="select-type" />
          </div>
        </Row>
      </Specimen>
      <Specimen title="Password visibility" description="Every password input includes a trailing eye control to show or hide the entered value without changing validation behavior." style={{ marginTop: 16 }}>
        <div style={{ maxWidth: 420 }}>
          <PasswordField label="Password" defaultValue="correct-horse-battery" data-parity-id="field-password" />
        </div>
      </Specimen>
      <Grid columns={2} className="mt-4">
        <Specimen title="Sizes, icons and links" description="Small and large buttons, icon-only buttons with accessible names, button-styled links and text links.">
          <Stack>
            <Row className="flex-wrap">
              <Button variant="secondary" size="sm"><Icon name="plus" />Add experience</Button>
              <Button variant="primary" size="lg">Sign in</Button>
              <Button variant="ghost" isIconOnly aria-label="More actions"><Icon name="more-horizontal" /></Button>
              <ButtonLink variant="secondary" href="#/primitives/actions-inputs"><Icon name="file" />Resume tools</ButtonLink>
            </Row>
            <Row className="flex-wrap">
              <BackLink href="#/">Back to Profile</BackLink>
              <span className="text-ink-2 text-xs">New here? <TextLink href="#/">Create an account</TextLink></span>
            </Row>
          </Stack>
        </Specimen>
        <Specimen title="Field details" description="Required marker, leading icons, helper text, error text and multi-line input.">
          <Stack gap={14}>
            <TextField label="Email" leadingIcon="mail" placeholder="you@example.com" />
            <TextField label="Company" isRequired description="Search the catalog or create a private value." />
            <TextField label="Certification URL" defaultValue="aws certificate" errorMessage="Enter a valid URL, including https://" />
            <TextAreaField label="Summary" placeholder="A short professional summary" />
          </Stack>
        </Specimen>
      </Grid>
    </DocPage>
  );
}
