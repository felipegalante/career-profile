import { useState } from "react";
import { Badge, CatalogCombobox, Grid, ProgressBar, Row, Stack, Surface, Text, type CatalogSelection } from "@career-profile/ui";
import { DocPage, Flow, Specimen } from "../../chrome/DocPage";
import { companies, mockSearch } from "../components/mockCatalog";

const institutions = mockSearch([{ id: "ubc", label: "University of British Columbia", meta: "Catalog" }]);
const majors = mockSearch<string | undefined>(() => [{ id: "cs", label: "Computer Science", meta: "Offered here" }]);

export function OverviewPage() {
  const [company, setCompany] = useState<CatalogSelection | null>(null);
  const [institution, setInstitution] = useState<CatalogSelection | null>({ kind: "catalog", id: "ubc", label: "University of British Columbia" });
  const [major, setMajor] = useState<CatalogSelection | null>(null);
  return (
    <DocPage overline="Career Profile design system" title="A calm system for structured professional data" description="Reusable foundations, primitives, and profile-domain patterns for a data-heavy application. The system favors clarity, compact hierarchy, accessible interaction, and consistent catalog-backed entry." aside={<Badge tone="brand">Foundations v1</Badge>}>
      <Grid columns={3}>
        <Specimen title="Quiet hierarchy" description="Surfaces, typography, and spacing do most of the work. Accent color signals focus and action rather than decoration.">
          <Surface padding="md">
            <Text variant="overline" id="overview-completeness">Profile completeness</Text>
            <Row justify="between" className="mt-2"><Text variant="record">82%</Text><Badge tone="success">On track</Badge></Row>
            <ProgressBar aria-labelledby="overview-completeness" value={82} className="mt-3" />
          </Surface>
        </Specimen>
        <Specimen title="Catalog first, custom always available" description="Search common values quickly, then create a private custom value when the catalog does not fit.">
          <CatalogCombobox label="Company" customNoun="company" placeholder="Search companies…" value={company} onChange={setCompany} search={mockSearch(companies)} onCreateCustom={(query) => setCompany({ kind: "custom", label: query })} />
        </Specimen>
        <Specimen title="Dependent fields reveal progressively" description="Only show child fields after the parent selection makes them meaningful.">
          <Stack gap={12}>
            <CatalogCombobox label="Institution" value={institution} onChange={(next) => { setInstitution(next); setMajor(null); }} search={institutions} />
            {institution ? <CatalogCombobox label="Major / Specialization" value={major} onChange={setMajor} search={majors} parentContext={institution.label} /> : null}
          </Stack>
        </Specimen>
      </Grid>
      <Specimen title="Core composition" description="Desktop uses a stable profile rail and focused work surface. Dialogs, comboboxes, record cards, feedback, and skill lanes share the same tokens and interaction grammar." style={{ marginTop: 16 }}>
        <Flow steps={[["Shell", "Navigation + identity"], ["Page", "Header + content"], ["Record", "Experience / education"], ["Dialog", "Structured editing"]]} />
      </Specimen>
    </DocPage>
  );
}
