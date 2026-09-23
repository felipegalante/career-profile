import type { ReactNode } from "react";
import { Tooltip as RACTooltip, TooltipTrigger, type TooltipProps as RACTooltipProps } from "react-aria-components";
import styles from "./Tooltip.module.css";

export interface TooltipProps {
  content: ReactNode;
  /** A single focusable element (React Aria Button or Link, or any usePress/Focusable element). */
  children: ReactNode;
  placement?: RACTooltipProps["placement"];
  isDisabled?: boolean;
  delay?: number;
}

/**
 * Supplementary label on hover and keyboard focus. It is exposed as a description, so the
 * trigger must still carry its own accessible name.
 */
export function Tooltip({ content, children, placement = "right", isDisabled, delay = 300 }: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} isDisabled={isDisabled}>
      {children}
      <RACTooltip placement={placement} offset={8} className={styles.tooltip}>{content}</RACTooltip>
    </TooltipTrigger>
  );
}
