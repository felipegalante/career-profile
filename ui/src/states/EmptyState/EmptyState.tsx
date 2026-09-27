import type { HTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon: IconName;
  title: ReactNode;
  description?: ReactNode;
  /** Usually one Button; omit when the surrounding surface already offers the action. */
  action?: ReactNode;
  /** `danger` is the load-failure variant with a Retry action. */
  tone?: "brand" | "danger";
  headingLevel?: 2 | 3 | 4;
}

/** Empty, no-results and error states for collections. Never leave a blank card instead. */
export function EmptyState({ icon, title, description, action, tone = "brand", headingLevel = 3, className, ...props }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div {...props} className={cx(styles.empty, tone === "danger" && styles.danger, className)}>
      <div className={styles.iconbox} aria-hidden="true"><Icon name={icon} /></div>
      <Heading className={styles.title}>{title}</Heading>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action}
    </div>
  );
}
