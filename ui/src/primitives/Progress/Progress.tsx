import { ProgressBar as RACProgressBar, type ProgressBarProps as RACProgressBarProps } from "react-aria-components";
import { cx } from "../../foundations/classNames";
import styles from "./Progress.module.css";

export type ProgressBarProps = Omit<RACProgressBarProps, "className" | "children"> & { className?: string } & ({ "aria-label": string } | { "aria-labelledby": string });

/** Thin determinate progress track. The visible label lives next to it and names it through aria-labelledby. */
export function ProgressBar({ className, ...props }: ProgressBarProps) {
  return (
    <RACProgressBar {...props} className={cx(styles.progress, className)}>
      {({ percentage }) => <span className={styles.fill} style={{ width: `${percentage ?? 0}%` }} />}
    </RACProgressBar>
  );
}
