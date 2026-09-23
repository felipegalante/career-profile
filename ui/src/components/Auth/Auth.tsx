import type { ReactNode } from "react";
import { Icon } from "../../foundations/Icon";
import { Text } from "../../foundations/Text";
import { Brand } from "../../primitives/Brand/Brand";
import { Chip } from "../../primitives/Chip/Chip";
import styles from "./Auth.module.css";

export const AUTH_TAGLINE = "Structured professional profiles, without the busywork.";

export interface AuthLayoutProps {
  children: ReactNode;
  /** Decorative right-hand panel, usually `AuthShowcase`; hidden at 860px and below. */
  art?: ReactNode;
  /** Line under the card; pass null to omit it. */
  footer?: ReactNode;
}

/** Public split layout for sign in, registration, password setup and onboarding. */
export function AuthLayout({ children, art, footer = AUTH_TAGLINE }: AuthLayoutProps) {
  return (
    <main className={styles.public}>
      <section className={styles.panel}>
        <Brand />
        <div className={styles.card}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </section>
      {art}
    </main>
  );
}

export interface AuthHeaderProps {
  overline: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
}

/** Overline, page heading and lead paragraph at the top of an auth card. */
export function AuthHeader({ overline, title, lead }: AuthHeaderProps) {
  return (
    <>
      <Text variant="overline" as="div">{overline}</Text>
      <h1 className={styles.title}>{title}</h1>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </>
  );
}

export interface AuthShowcaseProps {
  overline: string;
  title: string;
  description: string;
  records: Array<{ kind: string; title: string; meta: string }>;
  skills: { overline: string; title: string; chips: string[]; note: string };
  benefits: string[];
}

/**
 * The "professional story" illustration beside the auth card. It repeats product copy
 * decoratively, so it is hidden from assistive technology.
 */
export function AuthShowcase({ overline, title, description, records, skills, benefits }: AuthShowcaseProps) {
  return (
    <section className={styles.art} aria-hidden="true">
      <div className={styles.showcase}>
        <div>
          <Text variant="overline" as="div">{overline}</Text>
          <h2 className={styles.showcaseTitle}>{title}</h2>
          <p className={styles.showcaseText}>{description}</p>
        </div>
        <div className={styles.illustration}>
          <div className={styles.illustrationGrid}>
            <div className={styles.illustrationStack}>
              {records.map((record) => (
                <div className={styles.illustrationCard} key={record.kind}>
                  <Text variant="overline" as="div">{record.kind}</Text>
                  <div className={styles.illustrationTitle}>{record.title}</div>
                  <div className={styles.illustrationMeta}>{record.meta}</div>
                </div>
              ))}
            </div>
            <div className={styles.illustrationArrow}>→</div>
            <div className={styles.illustrationCard}>
              <Text variant="overline" as="div">{skills.overline}</Text>
              <div className={styles.illustrationTitle}>{skills.title}</div>
              <div className={styles.illustrationSkills}>{skills.chips.map((chip) => <Chip key={chip}>{chip}</Chip>)}</div>
              <div className={styles.illustrationNote}>{skills.note}</div>
            </div>
          </div>
        </div>
        <div className={styles.benefits}>
          {benefits.map((benefit) => (
            <div className={styles.benefit} key={benefit}>
              <Icon name="check" size={16} strokeWidth={2} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
