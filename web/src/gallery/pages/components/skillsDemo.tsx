import { useState } from "react";
import type { Proficiency, SkillCategory, SkillCategoryData, SkillChipData } from "@career-profile/ui";

const skill = (label: string, isCustom = false): SkillChipData => ({ id: label.toLowerCase().replace(/\W+/g, "-"), label, isCustom });

export const specimenSkills: SkillCategoryData[] = [
  {
    category: "TECHNICAL",
    lanes: [
      { level: "ADVANCED", skills: [skill("TypeScript"), skill("React"), skill("System Design")] },
      { level: "INTERMEDIATE", skills: [skill("PostgreSQL"), skill("AWS"), skill("GraphQL", true), skill("Docker"), skill("Kubernetes"), skill("Node.js"), skill("Terraform")] },
      { level: "BEGINNER", skills: [] },
    ],
  },
  {
    category: "FOUNDATIONAL",
    lanes: [
      { level: "ADVANCED", skills: [skill("Communication"), skill("Problem Solving")] },
      { level: "INTERMEDIATE", skills: [skill("Mentoring"), skill("Planning"), skill("Facilitation")] },
      { level: "BEGINNER", skills: [skill("Negotiation")] },
    ],
  },
];

export interface SkillLocation {
  category: SkillCategory;
  level: Proficiency;
  index: number;
  skill: SkillChipData;
}

/** Local skill state for gallery demos: move within a category, remove, restore and add. */
export function useSkillBoardState(initial: SkillCategoryData[]) {
  const [categories, setCategories] = useState(initial);

  const find = (id: string): SkillLocation | null => {
    for (const category of categories) {
      for (const lane of category.lanes) {
        const index = lane.skills.findIndex((candidate) => candidate.id === id);
        if (index >= 0) return { category: category.category, level: lane.level, index, skill: lane.skills[index] };
      }
    }
    return null;
  };

  const update = (transform: (lanes: SkillCategoryData["lanes"], category: SkillCategory) => SkillCategoryData["lanes"]) =>
    setCategories((current) => current.map((category) => ({ ...category, lanes: transform(category.lanes, category.category) })));

  const move = (id: string, to: Proficiency) => {
    const location = find(id);
    if (!location) return;
    update((lanes, category) =>
      category !== location.category
        ? lanes
        : lanes.map((lane) => ({
            ...lane,
            skills: lane.level === to ? [...lane.skills.filter((candidate) => candidate.id !== id), location.skill] : lane.skills.filter((candidate) => candidate.id !== id),
          }))
    );
  };

  const remove = (id: string) => {
    const location = find(id);
    update((lanes) => lanes.map((lane) => ({ ...lane, skills: lane.skills.filter((candidate) => candidate.id !== id) })));
    return location;
  };

  const restore = (location: SkillLocation) =>
    update((lanes, category) =>
      category !== location.category ? lanes : lanes.map((lane) => (lane.level !== location.level ? lane : { ...lane, skills: [...lane.skills.slice(0, location.index), location.skill, ...lane.skills.slice(location.index)] }))
    );

  const add = (category: SkillCategory, level: Proficiency, added: SkillChipData) =>
    update((lanes, current) => (current !== category ? lanes : lanes.map((lane) => (lane.level === level ? { ...lane, skills: [...lane.skills, added] } : lane))));

  const has = (id: string) => find(id) !== null;

  return { categories, move, remove, restore, add, has };
}
