import { Chip, ChipList, MenuItem, RecordActionsMenu, RecordItem, Surface } from "@career-profile/ui";
import { DocPage } from "../../chrome/DocPage";

const records = [
  { title: "Senior Product Engineer", subtitle: "Shopify · Full-time", meta: "Mar 2024 – Current · Vancouver, BC", skills: ["TypeScript", "System Design", "Collaboration"] },
  { title: "Computer Science, M.Sc.", subtitle: "University of British Columbia", meta: "2022 – 2024 · Completed", skills: ["Algorithms", "Databases"] },
  { title: "AWS Certified Solutions Architect – Associate", subtitle: "Amazon Web Services", meta: "Issued Aug 2025 · Expires Aug 2028", skills: ["AWS", "Cloud Architecture"] },
];

export function ProfileRecordsPage() {
  return (
    <DocPage overline="Shared composition" title="Profile records" description="Readable cards for experience, education, and certifications with compact metadata and derived-skill previews.">
      <Surface data-parity-id="records">
        {records.map((record) => (
          <RecordItem
            key={record.title}
            title={record.title}
            subtitle={record.subtitle}
            meta={record.meta}
            action={
              <RecordActionsMenu recordLabel={record.title}>
                <MenuItem id="edit" icon="pencil">Edit</MenuItem>
                <MenuItem id="remove" icon="close" tone="danger">Remove</MenuItem>
              </RecordActionsMenu>
            }
          >
            <ChipList aria-label={`Skills from ${record.title}`}>
              {record.skills.map((skill) => <Chip as="li" key={skill}>{skill}</Chip>)}
            </ChipList>
          </RecordItem>
        ))}
      </Surface>
    </DocPage>
  );
}
