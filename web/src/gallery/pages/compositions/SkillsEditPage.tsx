import { useState } from "react";
import { AppShell, ButtonLink, Callout, CatalogCombobox, PageHeader, SkillBoard, Surface, Text, useToast, type CatalogSearch, type CatalogSelection, type SkillCategory } from "@career-profile/ui";
import { demoAccount, demoCommands, demoNavigation } from "../shell/shellDemo";
import { rankEntries } from "../components/mockCatalog";
import { specimenSkills, useSkillBoardState } from "../components/skillsDemo";

const catalog: Array<{ id: string; label: string; category: SkillCategory }> = [
  ...["TypeScript", "TypeScript Testing", "JavaScript", "Rust", "Go", "Python", "Figma", "Swift"].map((label) => ({ id: label.toLowerCase().replace(/\W+/g, "-"), label, category: "TECHNICAL" as const })),
  ...["Communication", "Stakeholder Management", "Storytelling", "Time Management"].map((label) => ({ id: label.toLowerCase().replace(/\W+/g, "-"), label, category: "FOUNDATIONAL" as const })),
];

export function SkillsEditPage() {
  const toast = useToast();
  const board = useSkillBoardState(specimenSkills);
  const [selection, setSelection] = useState<CatalogSelection | null>(null);

  const search: CatalogSearch<undefined> = async (query) => rankEntries(catalog.map((entry) => ({ ...entry, meta: board.has(entry.id) ? "Already added" : entry.category === "TECHNICAL" ? "Technical" : "Foundational", isDisabled: board.has(entry.id) })), query);

  function addSkill(value: CatalogSelection | null) {
    setSelection(null);
    if (!value) return;
    const entry = value.kind === "catalog" ? catalog.find((candidate) => candidate.id === value.id) : undefined;
    const category = entry?.category ?? "TECHNICAL";
    const id = entry?.id ?? `custom-${value.label.toLowerCase().replace(/\W+/g, "-")}`;
    board.add(category, "INTERMEDIATE", { id, label: value.label, isCustom: value.kind === "custom" });
    toast.show({ title: "Skill added at Intermediate", description: `${value.label} is now in your profile.` });
  }

  return (
    <AppShell navigation={demoNavigation} currentItemId="profile" account={demoAccount} commands={demoCommands(() => undefined)}>
      <PageHeader title="Edit skills" description="Reorganize proficiency, remove skills, or add catalog/custom skills." backLink={{ href: "/compositions/profile" }} actions={<ButtonLink variant="primary" href="/compositions/profile">Done</ButtonLink>} />
      <Callout className="mb-4">Drag skills between levels or use a skill's Move menu. New skills start at Intermediate.</Callout>
      <SkillBoard
        mode="edit"
        collapsedCount={5}
        categories={board.categories}
        onMove={(id, to) => board.move(id, to)}
        onRemove={(id) => {
          const removed = board.remove(id);
          if (removed) toast.show({ title: `${removed.skill.label} removed from your profile`, action: { label: "Undo", onAction: () => board.restore(removed) } });
        }}
      />
      <Surface padding="md" className="mt-4">
        <Text variant="section" as="h2" id="add-skill-title">Add a skill</Text>
        <CatalogCombobox label="Search skill catalog" hideLabel placeholder="Search skill catalog…" className="mt-2.5" value={selection} onChange={addSkill} search={search} customNoun="skill" onCreateCustom={(query) => addSkill({ kind: "custom", label: query })} />
      </Surface>
    </AppShell>
  );
}
