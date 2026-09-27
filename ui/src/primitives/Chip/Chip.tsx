import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../foundations/classNames";
import styles from "./Chip.module.css";

export type ChipTone = "brand" | "neutral" | "custom";

export type ChipProps = HTMLAttributes<HTMLElement> & { tone?: ChipTone; as?: "span" | "li" };

/** Label chip used for skills, focus areas and "+N more" overflow. */
export function Chip({ tone = "brand", as: Component = "span", className, ...props }: ChipProps) {
  return <Component {...props} className={cx(styles.chip, tone !== "brand" && styles[tone], className)} />;
}

export type ChipListProps = HTMLAttributes<HTMLUListElement> & { children: ReactNode };

/** Wrapping list of chips with the artifact 6px gap and 12px top offset. Children should be `<Chip as="li">`. */
export function ChipList({ className, ...props }: ChipListProps) {
  return <ul {...props} className={cx(styles.list, className)} />;
}
