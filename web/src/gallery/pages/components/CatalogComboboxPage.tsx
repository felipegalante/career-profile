import { useState } from "react";
import { CatalogCombobox, Grid, Text, type CatalogSearch, type CatalogSelection } from "@career-profile/ui";
import { DocPage, Specimen } from "../../chrome/DocPage";
import { alwaysEmpty, alwaysFails, companies, mockSearch, neverResolves } from "./mockCatalog";

const skills = mockSearch([
  { id: "typescript", label: "TypeScript", meta: "Already added", isDisabled: true },
  { id: "typescript-testing", label: "TypeScript Testing", meta: "Technical" },
  { id: "javascript", label: "JavaScript", meta: "Technical" },
  { id: "type-theory", label: "Type Theory", meta: "Technical" },
]);

function Example({ label, search, customNoun, parityId, allowCustom = true }: { label: string; search: CatalogSearch<undefined>; customNoun?: string; parityId: string; allowCustom?: boolean }) {
  const [value, setValue] = useState<CatalogSelection | null>(null);
  return (
    <div data-parity-id={parityId}>
      <CatalogCombobox label={label} placeholder={`Search ${label.toLowerCase()}…`} value={value} onChange={setValue} search={search} customNoun={customNoun} onCreateCustom={allowCustom ? (query) => setValue({ kind: "custom", label: query }) : undefined} />
      <Text as="div" variant="meta" tone="muted" className="mt-2">
        {value ? `Selected ${value.kind === "custom" ? "private custom value" : "catalog value"}: ${value.label}` : "Nothing selected"}
      </Text>
    </div>
  );
}

export function CatalogComboboxPage() {
  return (
    <DocPage overline="Shared component" title="CatalogCombobox" description="One accessible search/select primitive for Skills, Company, Job Title, Institution, Major / Specialization, Degree Type, Certification Board, Certification / Exam, and Professional Focus. Type in a field to see each state.">
      <Grid columns={2}>
        <Specimen title="Results + custom creation" description="Exact → prefix → substring ranking; private custom fallback when eligible.">
          <Example label="Company" customNoun="company" search={mockSearch(companies)} parityId="combo-company" />
        </Specimen>
        <Specimen title="Already selected" description="Domains such as Skills can disable already-associated records while keeping them visible.">
          <Example label="Skill" customNoun="skill" search={skills} parityId="combo-skill" />
        </Specimen>
      </Grid>
      <Grid columns={3} className="mt-4">
        <Specimen title="Loading">
          <Example label="Loading example" search={neverResolves} parityId="combo-loading" allowCustom={false} />
        </Specimen>
        <Specimen title="No results">
          <Example label="No results example" customNoun="value" search={alwaysEmpty} parityId="combo-empty" />
        </Specimen>
        <Specimen title="Error">
          <Example label="Error example" search={alwaysFails} parityId="combo-error" allowCustom={false} />
        </Specimen>
      </Grid>
    </DocPage>
  );
}
