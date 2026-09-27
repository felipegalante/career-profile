import type { ReactNode, Ref } from "react";
import { Link as RACLink, type LinkProps as RACLinkProps } from "react-aria-components";
import { Icon } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import styles from "./Link.module.css";

export type TextLinkProps = Omit<RACLinkProps, "className"> & { className?: string; ref?: Ref<HTMLAnchorElement> };

/** Emphasized inline link, as in "New here? Create an account". */
export function TextLink({ className, ...props }: TextLinkProps) {
  return <RACLink {...props} className={cx(styles.text, className)} />;
}

export type BackLinkProps = Omit<RACLinkProps, "className" | "children"> & { className?: string; children?: ReactNode; ref?: Ref<HTMLAnchorElement> };

/** "Back to Profile" control shown above the title of focused management surfaces. */
export function BackLink({ className, children = "Back to Profile", ...props }: BackLinkProps) {
  return (
    <RACLink {...props} className={cx(styles.back, className)}>
      <Icon name="arrow-left" size={16} />
      <span>{children}</span>
    </RACLink>
  );
}
