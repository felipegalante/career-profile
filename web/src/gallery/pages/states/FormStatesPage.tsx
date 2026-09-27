import { Button, Callout, FormErrorSummary, Grid, Row, Stack, TextField } from "@career-profile/ui";
import { DocPage, Specimen } from "../../chrome/DocPage";

export function FormStatesPage() {
  return (
    <DocPage overline="States" title="Form states" description="Validation stays close to the field; server errors remain recoverable and do not erase input.">
      <Grid columns={2}>
        <Specimen title="Validation">
          <Stack gap={14}>
            <TextField label="Certification URL" defaultValue="aws certificate" errorMessage="Enter a valid URL, including https://" data-parity-id="field-url" />
            <TextField label="Expiration Date" defaultValue="Jan 2024" errorMessage="Expiration date cannot be before issue date." />
          </Stack>
        </Specimen>
        <Specimen title="Saving">
          <Callout>Saving your changes…</Callout>
          <Row className="mt-4 justify-end">
            <Button variant="secondary" isDisabled>Cancel</Button>
            <Button variant="primary" isPending>Saving…</Button>
          </Row>
          <h2 style={{ marginTop: 24 }}>Server error</h2>
          <FormErrorSummary autoFocus={false}>We couldn’t save this record. Your entries are still here.</FormErrorSummary>
        </Specimen>
      </Grid>
    </DocPage>
  );
}
