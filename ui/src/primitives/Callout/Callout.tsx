import type { HTMLAttributes, ReactNode, Ref } from "react";
import { Icon, type IconName } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import styles from "./Callout.module.css";

export type CalloutTone = "info" | "success" | "warning" | "danger";

const defaultIcons: Record<CalloutTone, IconName> = { info: "target", success: "check", warning: "target", danger: "close" };

export type CalloutProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CalloutTone;
  /** Defaults to the artifact icon for the tone; `null` renders no icon. */
  icon?: IconName | null;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

/** Inline explanation or recoverable issue that stays on the page until the situation changes. */
export function Callout({ tone = "info", icon, className, children, ...props }: CalloutProps) {
  const iconName = icon === undefined ? defaultIcons[tone] : icon;
  return (
    <div {...props} className={cx(styles.callout, tone !== "info" && styles[tone], className)}>
      {iconName ? <Icon name={iconName} className={styles.icon} /> : null}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
