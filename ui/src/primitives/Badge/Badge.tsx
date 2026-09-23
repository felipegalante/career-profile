import type { HTMLAttributes } from "react";
import { cx } from "../../foundations/classNames";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "outline";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone };

/** Pill status label. Tone reinforces the text; the text alone must carry the meaning. */
export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span {...props} className={cx(styles.badge, tone !== "neutral" && styles[tone], className)} />;
}
