import type { ReactNode } from "react";
import { cx } from "../foundations/classNames";
import { BackLink } from "../primitives/Link/Link";
import { CommandTrigger, SidebarToggle } from "./ShellControls";
import styles from "./PageHeader.module.css";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Focused management surfaces show "Back to Profile" above the title. */
  backLink?: { href: string; label?: string };
  /** Page actions; keep one primary CTA per action on a surface. */
  actions?: ReactNode;
  /** Inside AppShell, the command trigger and sidebar toggle lead the actions on desktop. */
  showShellControls?: boolean;
  className?: string;
}

export function PageHeader({ title, description, backLink, actions, showShellControls = true, className }: PageHeaderProps) {
  return (
    <div className={cx(styles.phead, className)}>
      <div>
        {backLink ? <BackLink href={backLink.href}>{backLink.label ?? "Back to Profile"}</BackLink> : null}
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      <div className={styles.actions}>
        {showShellControls ? (
          <span className={styles.shellControls}>
            <CommandTrigger />
            <SidebarToggle />
          </span>
        ) : null}
        {actions}
      </div>
    </div>
  );
}
