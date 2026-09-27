import { useState } from "react";
import { Badge, CatalogCombobox, Grid, Text, type CatalogSelection } from "@career-profile/ui";
import { DocPage, Flow, Specimen } from "../../chrome/DocPage";
import { mockSearch } from "../components/mockCatalog";

const institutions = mockSearch([
  { id: "ubc", label: "University of British Columbia", meta: <Badge>Catalog</Badge> },
  { id: "sfu", label: "Simon Fraser University", meta: <Badge>Catalog</Badge> },
  { id: "north-shore", label: "North Shore Design Institute", meta: <Badge tone="brand">Custom</Badge> },
]);

export function CatalogCustomValuesPage() {
  const [value, setValue] = useState<CatalogSelection | null>(null);
  return (
    <DocPage overline="Interaction pattern" title="Catalog values and private custom values" description="Global catalog values provide speed and consistency. Custom values guarantee the user is never blocked by an incomplete catalog.">
      <Flow steps={[["Search", "Normalized query"], ["Rank visible values", "Exact → fuzzy"], ["Exact match?", "Reuse it"], ["No match", "Offer custom"]]} />
      <Grid columns={2} className="mt-5">
        <Specimen title="Catalog and custom results" description="Catalog values are visible to all authenticated users; a private custom value is visible only to the user who created it. Try “north” or a new name.">
          <CatalogCombobox label="Institution" customNoun="institution" placeholder="Search institutions…" value={value} onChange={setValue} search={institutions} onCreateCustom={(query) => setValue({ kind: "custom", label: query })} />
          <Text as="div" variant="meta" tone="muted" className="mt-2">{value ? `${value.kind === "custom" ? "Custom" : "Catalog"}: ${value.label}` : "Nothing selected"}</Text>
        </Specimen>
        <Specimen title="Source badges" description="The badge names the source in text, so color is never the only cue.">
          <div className="flex items-center gap-2"><Badge>Catalog</Badge><Text tone="muted">Visible to all authenticated users.</Text></div>
          <div className="mt-3 flex items-center gap-2"><Badge tone="brand">Custom</Badge><Text tone="muted">Visible only to the user who created it.</Text></div>
        </Specimen>
      </Grid>
    </DocPage>
  );
}
