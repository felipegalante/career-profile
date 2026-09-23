import { Grid, Surface, Text } from "@career-profile/ui";
import { DocPage } from "../../chrome/DocPage";

const principles = [
  ["Reveal complexity when it becomes useful", "Dependent profile fields stay hidden until their parent selection provides context."],
  ["Search before typing from scratch", "Catalog-backed fields use the same ranked search and private custom fallback."],
  ["Keep domain records readable", "Experience, education, and certifications use consistent record cards before opening forms."],
  ["Make edits recoverable", "Mutation feedback is specific; optimistic interactions have rollback or explicit retry."],
  ["Use semantics, not color alone", "Statuses, proficiency, and errors always include text or shape in addition to color."],
  ["Own the source of truth", "Backend authorization, normalization, uniqueness, and profile ownership remain authoritative."],
];

export function PrinciplesPage() {
  return (
    <DocPage overline="Overview" title="System principles" description="The rules that keep Career Profile consistent as profile modules grow.">
      <Grid columns={2}>
        {principles.map(([title, body], index) => (
          <Surface key={title} padding="lg">
            <Text variant="overline" as="div">{String(index + 1).padStart(2, "0")}</Text>
            <Text variant="section" as="h2" className="mt-1.5">{title}</Text>
            <p className="mt-1.5 mb-0 text-ink-2">{body}</p>
          </Surface>
        ))}
      </Grid>
    </DocPage>
  );
}
