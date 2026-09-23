import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Button as RACButton, Menu as RACMenu, Popover, Pressable, Separator, VisuallyHidden, isTextDropItem, useDrag, useDrop } from "react-aria-components";
import { cx } from "../../foundations/classNames";
import { Badge } from "../../primitives/Badge/Badge";
import { Button } from "../../primitives/Button/Button";
import { Surface } from "../../primitives/Layout/Layout";
import { MenuItem, MenuSection } from "../../primitives/Menu/Menu";
import menuStyles from "../../primitives/Menu/Menu.module.css";
import chipStyles from "../../primitives/Chip/Chip.module.css";
import styles from "./Skills.module.css";

export type SkillCategory = "TECHNICAL" | "FOUNDATIONAL";
export type Proficiency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export const proficiencyLabels: Record<Proficiency, string> = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" };
export const categoryLabels: Record<SkillCategory, string> = { TECHNICAL: "Technical", FOUNDATIONAL: "Foundational" };
const proficiencySteps: Record<Proficiency, number> = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3 };
const PROFICIENCY_ORDER: Proficiency[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export interface SkillChipData {
  id: string;
  label: string;
  /** Viewer-private custom skill; shows the custom treatment and a "Custom" label. */
  isCustom?: boolean;
}

export interface SkillLaneData {
  level: Proficiency;
  skills: SkillChipData[];
  /** Total skills at this level when `skills` is a partial page; defaults to `skills.length`. */
  total?: number;
}

export interface SkillCategoryData {
  category: SkillCategory;
  lanes: SkillLaneData[];
  /** Total skills in the category for the header badge; defaults to the sum of lane totals. */
  total?: number;
}

/** Drag data is keyed by category so a lane can accept or reject a drop from the types alone. */
const dragType = (category: SkillCategory) => `application/x-career-profile-skill-${category.toLowerCase()}`;

interface BoardState {
  mode: "view" | "edit";
  collapsedCount: number;
  activeCategory: SkillCategory | null;
  setActiveCategory: (category: SkillCategory | null) => void;
  /** Most recently moved skill; its new lane keeps it visible even while collapsed. */
  lastMovedId: string | null;
  move: (skill: SkillChipData, category: SkillCategory, to: Proficiency) => void;
  remove: (skill: SkillChipData) => void;
}

const BoardContext = createContext<BoardState | null>(null);

function useBoard(): BoardState {
  const board = useContext(BoardContext);
  if (!board) throw new Error("Skill lanes and chips must be rendered inside SkillBoard.");
  return board;
}

/** Proficiency as text plus a three-step bar indicator; color is never the only cue. */
export function ProficiencyIndicator({ level, as: Component = "div" }: { level: Proficiency; as?: "div" | "h3" | "h4" }) {
  const steps = proficiencySteps[level];
  return (
    <Component className={styles.level}>
      {proficiencyLabels[level]}
      <span className={styles.dots} aria-hidden="true">
        {[1, 2, 3].map((step) => <i key={step} className={cx(styles.dot, step <= steps && styles.dotOn)} />)}
      </span>
    </Component>
  );
}

interface SkillChipProps {
  skill: SkillChipData;
  category: SkillCategory;
  level: Proficiency;
}

function ViewChip({ skill }: { skill: SkillChipData }) {
  return (
    <li className={cx(chipStyles.chip, skill.isCustom && chipStyles.custom)}>
      {skill.label}
      {skill.isCustom ? <span className={styles.customMeta}>Custom</span> : null}
    </li>
  );
}

/**
 * Editable skill chip. Dragging the chip body moves it between proficiency lanes of its own
 * category; pressing the body (click, Enter or Space) opens the Move menu, which is the keyboard
 * and assistive-technology path; the × button removes the skill without starting a drag.
 */
function EditChip({ skill, category, level }: SkillChipProps) {
  const board = useBoard();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { dragProps, isDragging } = useDrag({
    hasDragButton: true,
    getAllowedDropOperations: () => ["move"],
    getItems: () => [{ [dragType(category)]: skill.id, "text/plain": skill.label }],
    onDragStart: () => requestAnimationFrame(() => board.setActiveCategory(category)),
    onDragEnd: () => board.setActiveCategory(null),
  });

  return (
    <li className={cx(styles.chip, skill.isCustom && styles.custom, isDragging && styles.dragging)} data-skill-id={skill.id}>
      <span {...dragProps} className={styles.dragArea} title={`Drag ${skill.label} between ${categoryLabels[category]} proficiency levels`}>
        <Pressable onPress={() => setMenuOpen(true)}>
          <span ref={triggerRef} role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={isMenuOpen} aria-label={`${skill.label}${skill.isCustom ? " Custom" : ""}, ${proficiencyLabels[level]}`} className={styles.trigger}>
            <span aria-hidden="true" className={styles.handle}>⋮⋮</span>
            {skill.label}
            {skill.isCustom ? <span className={styles.customMeta}>Custom</span> : null}
          </span>
        </Pressable>
      </span>
      <RACButton className={styles.remove} aria-label={`Remove ${skill.label}`} onPress={() => board.remove(skill)}>×</RACButton>
      <Popover triggerRef={triggerRef} isOpen={isMenuOpen} onOpenChange={setMenuOpen} placement="bottom start" offset={6}>
        <RACMenu
          aria-label={`Move ${skill.label}`}
          autoFocus="first"
          className={menuStyles.menu}
          onAction={(key) => {
            setMenuOpen(false);
            if (key === "remove") board.remove(skill);
            else if (key !== level) board.move(skill, category, key as Proficiency);
          }}
        >
          <MenuSection selectionMode="single" selectedKeys={[level]}>
            {PROFICIENCY_ORDER.map((target) => (
              <MenuItem key={target} id={target}>{target === level ? proficiencyLabels[target] : `Move to ${proficiencyLabels[target]}`}</MenuItem>
            ))}
          </MenuSection>
          <Separator className={menuStyles.separator} />
          <MenuItem id="remove" tone="danger">Remove skill</MenuItem>
        </RACMenu>
      </Popover>
    </li>
  );
}

export interface ProficiencyLaneProps extends SkillLaneData {
  category: SkillCategory;
}

/** One proficiency level of a category: indicator, "Showing n of m", chips and Show all / Show fewer. */
export function ProficiencyLane({ category, level, skills, total }: ProficiencyLaneProps) {
  const board = useBoard();
  const ref = useRef<HTMLElement>(null);
  const [isExpanded, setExpanded] = useState(false);
  const { dropProps, isDropTarget } = useDrop({
    ref,
    isDisabled: board.mode !== "edit",
    getDropOperation: (types) => (types.has(dragType(category)) ? "move" : "cancel"),
    onDrop: async (event) => {
      const item = event.items.find((candidate) => isTextDropItem(candidate) && candidate.types.has(dragType(category)));
      if (!item || !isTextDropItem(item)) return;
      const id = await item.getText(dragType(category));
      const label = await item.getText("text/plain");
      if (skills.some((skill) => skill.id === id)) return;
      board.move({ id, label }, category, level);
    },
  });

  const count = total ?? skills.length;
  const collapsed = skills.slice(0, board.collapsedCount);
  const moved = skills.find((skill) => skill.id === board.lastMovedId);
  const visible = isExpanded ? skills : moved && !collapsed.includes(moved) ? [...collapsed, moved] : collapsed;
  const isAvailable = board.mode === "edit" && board.activeCategory === category;

  return (
    <section ref={ref} {...dropProps} aria-label={`${proficiencyLabels[level]} ${categoryLabels[category]} skills`} className={cx(styles.lane, isAvailable && styles.dropAvailable, isDropTarget && styles.dragOver)} data-proficiency={level}>
      <div className={styles.laneHead}>
        <ProficiencyIndicator level={level} as="h4" />
        <span className={styles.count}>Showing {visible.length} of {count}</span>
      </div>
      <ul className={chipStyles.list}>
        {visible.length === 0 ? <li className={styles.emptyLane}>No skills at this level</li> : null}
        {visible.map((skill) => (board.mode === "edit" ? <EditChip key={skill.id} skill={skill} category={category} level={level} /> : <ViewChip key={skill.id} skill={skill} />))}
      </ul>
      {skills.length > visible.length || isExpanded ? (
        <div className={styles.more}>
          <Button variant="ghost" size="sm" onPress={() => setExpanded((current) => !current)} aria-expanded={isExpanded}>
            {isExpanded ? "Show fewer" : `Show all ${count}`}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

export type SkillCategoryCardProps = SkillCategoryData;

/** Technical or Foundational card with a count badge and its proficiency lanes. */
export function SkillCategoryCard({ category, lanes, total }: SkillCategoryCardProps) {
  const board = useBoard();
  const count = total ?? lanes.reduce((sum, lane) => sum + (lane.total ?? lane.skills.length), 0);
  const isBlocked = board.mode === "edit" && board.activeCategory !== null && board.activeCategory !== category;
  return (
    <Surface className={cx(styles.card, isBlocked && styles.blocked)} data-skill-category={category} aria-labelledby={`skill-card-${category}`}>
      <div className={styles.cardHead}>
        <h3 id={`skill-card-${category}`} className={styles.cardTitle}>{categoryLabels[category]}</h3>
        <Badge>{count} {count === 1 ? "skill" : "skills"}</Badge>
      </div>
      {lanes.map((lane) => <ProficiencyLane key={lane.level} category={category} {...lane} />)}
    </Surface>
  );
}

export interface SkillBoardProps {
  categories: SkillCategoryData[];
  /** `view` renders read-only chips; `edit` enables drag, the Move menu and removal. */
  mode?: "view" | "edit";
  /** Chips shown per lane before "Show all". */
  collapsedCount?: number;
  /** Called when a chip moves to another proficiency in the same category. Category never changes. */
  onMove?: (skillId: string, to: Proficiency, category: SkillCategory) => void;
  onRemove?: (skillId: string) => void;
  /** Explains that category is fixed; shown in edit mode unless disabled. */
  showCategoryRule?: boolean;
  children?: ReactNode;
}

/** Technical and Foundational skill cards side by side (stacked at 860px and below), with move announcements. */
export function SkillBoard({ categories, mode = "view", collapsedCount = 3, onMove, onRemove, showCategoryRule = true }: SkillBoardProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [lastMovedId, setLastMovedId] = useState<string | null>(null);

  const move = useCallback((skill: SkillChipData, category: SkillCategory, to: Proficiency) => {
    onMove?.(skill.id, to, category);
    setLastMovedId(skill.id);
    setAnnouncement(`${skill.label} moved to ${proficiencyLabels[to]}. Category remains ${categoryLabels[category]}.`);
  }, [onMove]);
  const remove = useCallback((skill: SkillChipData) => {
    onRemove?.(skill.id);
    setAnnouncement(`${skill.label} removed from your profile.`);
  }, [onRemove]);

  const board = useMemo<BoardState>(() => ({ mode, collapsedCount, activeCategory, setActiveCategory, lastMovedId, move, remove }), [mode, collapsedCount, activeCategory, lastMovedId, move, remove]);

  return (
    <BoardContext.Provider value={board}>
      {mode === "edit" && showCategoryRule ? (
        <div className={styles.rule}>Category is fixed: Technical skills can move only between Technical proficiency levels, and Foundational skills can move only between Foundational proficiency levels.</div>
      ) : null}
      <div className={styles.grid}>
        {categories.map((data) => <SkillCategoryCard key={data.category} {...data} />)}
      </div>
      <VisuallyHidden role="status" aria-live="polite">{announcement}</VisuallyHidden>
    </BoardContext.Provider>
  );
}
