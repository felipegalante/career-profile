import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./Text.module.css";

export type TextVariant = "body" | "display" | "record" | "section" | "label" | "meta" | "overline";
export type TextTone = "default" | "muted" | "faint" | "danger" | "success" | "brand";

export type TextProps<T extends ElementType = "span"> = {
  as?: T;
  variant?: TextVariant;
  tone?: TextTone;
  mono?: boolean;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/** Artifact type scale (display, record, section, label, meta, overline) and text tones. */
export function Text<T extends ElementType = "span">({ as, variant = "body", tone = "default", mono = false, className, ...rest }: TextProps<T>) {
  const Component: ElementType = as ?? "span";
  const classes = [styles.text, variant !== "body" && styles[variant], tone !== "default" && styles[tone], mono && styles.mono, className].filter(Boolean).join(" ");
  return <Component className={classes} {...rest} />;
}
