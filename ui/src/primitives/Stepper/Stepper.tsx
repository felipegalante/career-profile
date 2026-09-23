import { Fragment, type HTMLAttributes } from "react";
import { VisuallyHidden } from "react-aria-components";
import { cx } from "../../foundations/classNames";
import styles from "./Stepper.module.css";

export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  /** Step names, announced to assistive technology; the dots show step numbers. */
  steps: string[];
  /** 1-based index of the current step. Every step up to it is filled. */
  current: number;
}

export function Stepper({ steps, current, className, "aria-label": ariaLabel = "Setup progress", ...props }: StepperProps) {
  return (
    <ol {...props} aria-label={ariaLabel} className={cx(styles.stepper, className)}>
      {steps.map((name, index) => {
        const number = index + 1;
        const state = number < current ? "completed" : number === current ? "current" : "upcoming";
        return (
          <Fragment key={name}>
            {index > 0 ? <li aria-hidden="true" className={styles.bar} /> : null}
            <li className={cx(styles.dot, number <= current && styles.on)} aria-current={state === "current" ? "step" : undefined}>
              <span aria-hidden="true">{number}</span>
              <VisuallyHidden>{`${name}, ${state}`}</VisuallyHidden>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
