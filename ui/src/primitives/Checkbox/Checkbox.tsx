import type { ReactNode } from "react";
import { Checkbox as RACCheckbox, Label, Radio as RACRadio, RadioGroup as RACRadioGroup, type CheckboxProps as RACCheckboxProps, type RadioGroupProps as RACRadioGroupProps, type RadioProps as RACRadioProps } from "react-aria-components";
import { Icon } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import styles from "./Checkbox.module.css";

export type CheckboxProps = Omit<RACCheckboxProps, "className" | "children"> & { children: ReactNode; className?: string };

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <RACCheckbox {...props} className={cx(styles.control, className)}>
      {({ isSelected }) => (
        <>
          <span className={styles.check} aria-hidden="true">{isSelected ? <Icon name="check" /> : null}</span>
          {children}
        </>
      )}
    </RACCheckbox>
  );
}

export type RadioGroupProps = Omit<RACRadioGroupProps, "className" | "children"> & { label?: ReactNode; children: ReactNode; className?: string };

export function RadioGroup({ label, children, className, ...props }: RadioGroupProps) {
  return (
    <RACRadioGroup {...props} className={cx(styles.group, className)}>
      {label ? <Label className={styles.groupLabel}>{label}</Label> : null}
      {children}
    </RACRadioGroup>
  );
}

export type RadioProps = Omit<RACRadioProps, "className" | "children"> & { children: ReactNode; className?: string };

export function Radio({ children, className, ...props }: RadioProps) {
  return (
    <RACRadio {...props} className={cx(styles.control, className)}>
      <span className={styles.radio} aria-hidden="true" />
      {children}
    </RACRadio>
  );
}
