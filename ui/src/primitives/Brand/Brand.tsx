import { cx } from "../../foundations/classNames";
import styles from "./Brand.module.css";

export interface BrandProps {
  /** `sidebar` adds the rail padding and 15px name; `plain` matches the public auth panel. */
  variant?: "sidebar" | "plain";
  name?: string;
  className?: string;
  nameClassName?: string;
}

export function Brand({ variant = "plain", name = "Career Profile", className, nameClassName }: BrandProps) {
  return (
    <div className={cx(styles.brand, variant === "sidebar" && styles.sidebar, className)}>
      <div className={styles.logo} aria-hidden="true">CP</div>
      <span className={nameClassName}>{name}</span>
    </div>
  );
}
