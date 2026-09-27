import { SkillBoard, Text, useToast } from "@career-profile/ui";
import { DocPage, Specimen } from "../../chrome/DocPage";
import { specimenSkills, useSkillBoardState } from "./skillsDemo";

export function SkillsPage() {
  const toast = useToast();
  const board = useSkillBoardState(specimenSkills);
  return (
    <DocPage overline="Domain component" title="Skill components" description="Category cards, proficiency lanes, skill chips, custom labels, and edit controls.">
      <SkillBoard
        mode="edit"
        categories={board.categories}
        onMove={(id, to) => board.move(id, to)}
        onRemove={(id) => {
          const removed = board.remove(id);
          if (removed) toast.show({ title: `${removed.skill.label} removed from your profile`, action: { label: "Undo", onAction: () => board.restore(removed) } });
        }}
      />
      <Specimen title="Accessible move menu" description="Drag and drop is required. Pressing a chip (click, Enter or Space) opens its Move menu, the equivalent keyboard-accessible interaction. The × button removes the skill." style={{ marginTop: 16 }}>
        <Text variant="meta" tone="muted">Try dragging a Technical chip into a Foundational lane: the other category dims and rejects the drop.</Text>
      </Specimen>
    </DocPage>
  );
}
