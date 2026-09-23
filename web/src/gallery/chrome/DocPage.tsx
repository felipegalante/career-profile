import type { CSSProperties, ReactNode } from "react";
import { Text } from "@career-profile/ui";
import styles from "./DocPage.module.css";

export function DocPage({ overline, title, description, aside, children }: { overline: string; title: string; description?: ReactNode; aside?: ReactNode; children: ReactNode }) {
  return (
    <main className={styles.ds}>
      <div className={styles.head}>
        <div>
          <Text variant="overline">{overline}</Text>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {aside}
      </div>
      {children}
    </main>
  );
}

export function Specimen({ title, description, children, className, style }: { title?: string; description?: ReactNode; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section className={[styles.specimen, className].filter(Boolean).join(" ")} style={style} data-specimen="">
      {title ? <h2>{title}</h2> : null}
      {description ? <p>{description}</p> : null}
      {children}
    </section>
  );
}

export function TokenGrid({ children }: { children: ReactNode }) {
  return <div className={styles.tokenGrid}>{children}</div>;
}

export function Swatch({ label, background, color, parityId }: { label: string; background: string; color?: string; parityId?: string }) {
  return <div className={styles.swatch} style={{ background, color }} data-parity-id={parityId}>{label}</div>;
}

/** Marks a specimen whose visuals are not defined by any design artifact and still need design review. */
export function NotArtifactBacked() {
  return <span className={styles.unbacked}>Not artifact-backed</span>;
}

export function ShortcutRow({ action, description, keys }: { action: string; description: string; keys: ReactNode }) {
  return (
    <div className={styles.shortcutRow}>
      <div>
        <div className={styles.shortcutAction}>{action}</div>
        <div className={styles.shortcutDesc}>{description}</div>
      </div>
      <div className={styles.shortcutKeys}>{keys}</div>
    </div>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return <div className={styles.demoNote}>{children}</div>;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statNum}>{value}</div>
      <div className={styles.statSub}>{label}</div>
    </div>
  );
}

export function MobileFrame({ src, title }: { src: string; title: string }) {
  return (
    <div className={styles.mobileFrame}>
      <iframe src={src} title={title} />
    </div>
  );
}

export const editorClassName = styles.editor;
