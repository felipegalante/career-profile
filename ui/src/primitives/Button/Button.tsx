import type { Ref } from "react";
import { Button as RACButton, Link as RACLink, type ButtonProps as RACButtonProps, type LinkProps as RACLinkProps } from "react-aria-components";
import { cx } from "../../foundations/classNames";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square 36px button; the accessible name then comes from `aria-label`. */
  isIconOnly?: boolean;
}

type IconOnlyLabel = { isIconOnly: true; "aria-label": string } | { isIconOnly?: false };

export function buttonClassName({ variant = "secondary", size = "md", isIconOnly = false }: ButtonStyleProps, className?: string): string {
  return cx(styles.btn, styles[variant], size !== "md" && styles[size], isIconOnly && styles.icon, className);
}

export type ButtonProps = Omit<RACButtonProps, "className"> & Omit<ButtonStyleProps, "isIconOnly"> & IconOnlyLabel & { className?: string; ref?: Ref<HTMLButtonElement> };

/** Primary, secondary, ghost and danger actions. `isPending` keeps focus but blocks presses while work is in flight. */
export function Button({ variant, size, isIconOnly, className, ...props }: ButtonProps) {
  return <RACButton {...props} className={buttonClassName({ variant, size, isIconOnly }, className)} />;
}

export type ButtonLinkProps = Omit<RACLinkProps, "className"> & Omit<ButtonStyleProps, "isIconOnly"> & IconOnlyLabel & { className?: string; ref?: Ref<HTMLAnchorElement> };

/** A navigation link that looks like a button, such as "Resume tools" or "Add experience" on the Profile page. */
export function ButtonLink({ variant, size, isIconOnly, className, ...props }: ButtonLinkProps) {
  return <RACLink {...props} className={buttonClassName({ variant, size, isIconOnly }, className)} />;
}
