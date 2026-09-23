import type { ReactNode } from "react";
import { cx } from "../../foundations/classNames";
import { Callout } from "../../primitives/Callout/Callout";
import { BackLink } from "../../primitives/Link/Link";
import styles from "./Resume.module.css";

export interface ResumePreviewProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Regenerate and Download actions, kept outside the paper. */
  actions?: ReactNode;
  /** Explanatory callout above the paper. */
  note?: ReactNode;
  backHref?: string;
  /** The `ResumePaper` document. */
  children: ReactNode;
}

/** Secondary surface that presents a generated resume on the canvas with actions outside the paper. */
export function ResumePreview({ title = "Resume preview", description, actions, note, backHref, children }: ResumePreviewProps) {
  return (
    <div className={styles.preview}>
      {backHref ? <BackLink href={backHref} /> : null}
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.toolbarTitle}>{title}</h1>
          {description ? <p className={styles.toolbarText}>{description}</p> : null}
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      {note ? <Callout icon={null} className={styles.note}>{note}</Callout> : null}
      {children}
    </div>
  );
}

/** Single-column print-style document: minimal accent color, conventional headings, no profile UI. */
export function ResumePaper({ children, className }: { children: ReactNode; className?: string }) {
  return <article className={cx(styles.paper, className)}>{children}</article>;
}

export function ResumeHeader({ name, role, contact }: { name: string; role?: ReactNode; contact?: ReactNode }) {
  return (
    <header className={styles.head}>
      <div>
        <h2 className={styles.name}>{name}</h2>
        {role ? <div className={styles.role}>{role}</div> : null}
      </div>
      {contact ? <address className={styles.contact}>{contact}</address> : null}
    </header>
  );
}

export function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

export function ResumeSummary({ children }: { children: ReactNode }) {
  return <p className={styles.summary}>{children}</p>;
}

export interface ResumeItemProps {
  title: ReactNode;
  subtitle?: ReactNode;
  date?: ReactNode;
  bullets?: ReactNode[];
}

export function ResumeItem({ title, subtitle, date, bullets }: ResumeItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.itemHead}>
        <div>
          <div className={styles.itemTitle}>{title}</div>
          {subtitle ? <div className={styles.itemSub}>{subtitle}</div> : null}
        </div>
        {date ? <div className={styles.date}>{date}</div> : null}
      </div>
      {bullets && bullets.length > 0 ? <ul className={styles.bullets}>{bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul> : null}
    </div>
  );
}

export function ResumeSkills({ groups }: { groups: Array<{ label: string; skills: string }> }) {
  return (
    <dl className={styles.skills}>
      {groups.map((group) => (
        <div key={group.label} style={{ display: "contents" }}>
          <dt>{group.label}</dt>
          <dd>{group.skills}</dd>
        </div>
      ))}
    </dl>
  );
}
