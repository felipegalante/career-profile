import type { HTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import { Avatar } from "../../primitives/Avatar/Avatar";
import { Badge } from "../../primitives/Badge/Badge";
import { Button } from "../../primitives/Button/Button";
import { Surface } from "../../primitives/Layout/Layout";
import { Menu, MenuTrigger } from "../../primitives/Menu/Menu";
import styles from "./Profile.module.css";

type HeadingLevel = 2 | 3 | 4;

export interface ProfileHeroProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  name: string;
  subtitle?: ReactNode;
  /** Status badge pinned to the right, for example completeness. */
  status?: ReactNode;
}

/** Profile identity card: large avatar, name, subtitle and an optional status. */
export function ProfileHero({ name, subtitle, status, className, ...props }: ProfileHeroProps) {
  return (
    <Surface {...props} className={cx(styles.hero, className)}>
      <Avatar name={name} size="lg" />
      <div className={styles.heroSummary}>
        <div className={styles.heroName}>{name}</div>
        {subtitle ? <div className={styles.heroSubtitle}>{subtitle}</div> : null}
      </div>
      {status ? <div className={styles.heroStatus}>{status}</div> : null}
    </Surface>
  );
}

export interface ProfileSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** One action for the section, such as "Add experience" or "Edit skills". */
  action?: ReactNode;
  /** `embedded` sits inside the Profile workspace; `page` heads a focused management surface. */
  variant?: "embedded" | "page";
  /** Removes body padding so record rows run edge to edge. */
  flush?: boolean;
  headingLevel?: HeadingLevel;
  children?: ReactNode;
}

/** Card with a titled header and a body, used for each Profile area and each management list. */
export function ProfileSection({ title, description, action, variant = "embedded", flush = false, headingLevel = 2, className, children, ...props }: ProfileSectionProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Surface {...props} className={cx(variant === "embedded" && styles.section, className)}>
      <div className={cx(styles.head, variant === "page" && styles.headPage)}>
        <div>
          <Heading className={styles.title}>{title}</Heading>
          {description ? <div className={styles.description}>{description}</div> : null}
        </div>
        {action}
      </div>
      {children !== undefined ? <div className={cx(variant === "embedded" && styles.body, flush && styles.flush)}>{children}</div> : null}
    </Surface>
  );
}

export interface RecordItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Dates, status and location line. */
  meta?: ReactNode;
  /** Edit link or `RecordActionsMenu`. */
  action?: ReactNode;
  /** Derived-skill chips under the record, usually a `ChipList`. */
  children?: ReactNode;
  /** No padding, for single records inside the two-column Profile cards. */
  compact?: boolean;
  headingLevel?: HeadingLevel;
}

/** Experience, education or certification row with its derived-skill preview. */
export function RecordItem({ title, subtitle, meta, action, children, compact = false, headingLevel = 3, className, ...props }: RecordItemProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div {...props} className={cx(styles.record, compact && styles.compact, className)}>
      <div className={styles.recordHead}>
        <div>
          <Heading className={styles.recordTitle}>{title}</Heading>
          {subtitle ? <p className={styles.recordSubtitle}>{subtitle}</p> : null}
          {meta ? <div className={styles.recordMeta}>{meta}</div> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export interface RecordActionsMenuProps {
  /** Record name used in the button label, for example "Senior Product Engineer". */
  recordLabel: string;
  /** MenuItem elements such as Edit and Remove. */
  children: ReactNode;
  onAction?: (key: string | number) => void;
}

/** The record "⋯" button and its contextual menu, labelled with the record name. */
export function RecordActionsMenu({ recordLabel, children, onAction }: RecordActionsMenuProps) {
  return (
    <MenuTrigger>
      <Button variant="ghost" isIconOnly aria-label={`Actions for ${recordLabel}`}><Icon name="more-horizontal" /></Button>
      <Menu aria-label={`Actions for ${recordLabel}`} onAction={onAction}>{children}</Menu>
    </MenuTrigger>
  );
}

export interface ProfilePlaceholderProps {
  icon: IconName;
  title: ReactNode;
  description: ReactNode;
  /** Only an action that works; omit it until the area can be edited. */
  action?: ReactNode;
  headingLevel?: HeadingLevel;
}

/** Empty-profile row inviting the user to start an area. */
export function ProfilePlaceholder({ icon, title, description, action, headingLevel = 3 }: ProfilePlaceholderProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={styles.placeholder}>
      <div className={styles.placeholderCopy}>
        <div className={styles.placeholderIcon} aria-hidden="true"><Icon name={icon} size={20} /></div>
        <div>
          <Heading className={styles.placeholderTitle}>{title}</Heading>
          <p className={styles.placeholderDescription}>{description}</p>
        </div>
      </div>
      {action ? <div className={styles.placeholderAction}>{action}</div> : null}
    </div>
  );
}

export interface FocusCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  icon: IconName;
  iconTone?: "brand" | "accent" | "info";
  title: ReactNode;
  description?: ReactNode;
  isPrimary?: boolean;
  headingLevel?: HeadingLevel;
}

/** Professional Focus area: icon, label, description and a "Primary" badge; no decorative border. */
export function FocusCard({ icon, iconTone = "brand", title, description, isPrimary = false, headingLevel = 3, className, ...props }: FocusCardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Surface {...props} className={cx(styles.focusCard, className)}>
      <div className={styles.focusHead}>
        <div className={styles.focusTitle}>
          <div className={cx(styles.focusIcon, iconTone !== "brand" && styles[iconTone])} aria-hidden="true"><Icon name={icon} /></div>
          <Heading className={styles.focusLabel}>{title}</Heading>
        </div>
        {isPrimary ? <Badge tone="brand">Primary</Badge> : null}
      </div>
      {description ? <p className={styles.focusDescription}>{description}</p> : null}
    </Surface>
  );
}
