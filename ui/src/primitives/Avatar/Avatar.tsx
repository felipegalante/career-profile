import type { HTMLAttributes } from "react";
import { cx } from "../../foundations/classNames";
import styles from "./Avatar.module.css";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Person's display name; initials are derived from its first and last words. */
  name: string;
  initials?: string;
  /** 30px in table rows, 32px default, 48px in the profile header. */
  size?: "sm" | "md" | "lg";
}

export function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}

/** Initials avatar. Decorative: the person's name is always rendered next to it. */
export function Avatar({ name, initials, size = "md", className, ...props }: AvatarProps) {
  return <span {...props} aria-hidden="true" className={cx(styles.avatar, size !== "md" && styles[size], className)}>{initials ?? initialsFor(name)}</span>;
}
