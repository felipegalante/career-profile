import { Button, EmptyState, Grid, LoadingSkeleton } from "@career-profile/ui";
import { DocPage, Specimen } from "../../chrome/DocPage";

export function CollectionStatesPage() {
  return (
    <DocPage overline="States" title="Collection states" description="Lists and catalogs define intentional loading, empty, no-results, error, and populated states.">
      <Grid columns={2}>
        <Specimen title="Empty">
          <EmptyState icon="briefcase" title="No work experience yet" description="Add your first role to start building your professional history." action={<Button variant="primary">Add experience</Button>} data-parity-id="empty" />
        </Specimen>
        <Specimen title="No search results">
          <EmptyState icon="search" title="No matching institutions" description="Try another spelling or create a private custom institution." action={<Button variant="secondary">Create custom</Button>} />
        </Specimen>
        <Specimen title="Loading">
          <LoadingSkeleton label="Loading institutions" />
        </Specimen>
        <Specimen title="Error">
          <EmptyState icon="close" tone="danger" title="Couldn’t load this section" description="Your saved data is unchanged. Try again." action={<Button variant="secondary">Retry</Button>} data-parity-id="empty-error" />
        </Specimen>
      </Grid>
    </DocPage>
  );
}
