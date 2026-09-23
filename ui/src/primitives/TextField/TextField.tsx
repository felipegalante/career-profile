import { useLayoutEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { Button as RACButton, FieldError, Input, Label, Text, TextArea, TextField as RACTextField, type TextFieldProps as RACTextFieldProps } from "react-aria-components";
import { Icon, type IconName } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import styles from "./TextField.module.css";

interface FieldChromeProps {
  label: ReactNode;
  /** Helper text below the control. */
  description?: ReactNode;
  /** Shown below the control and marks it invalid. */
  errorMessage?: ReactNode;
  placeholder?: string;
  className?: string;
}

export type TextFieldProps = Omit<RACTextFieldProps, "children" | "className"> & FieldChromeProps & {
  leadingIcon?: IconName;
  /** Content pinned inside the right edge of the input, such as a visibility toggle. */
  trailing?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
};

export function FieldLabel({ children, isRequired }: { children: ReactNode; isRequired?: boolean }) {
  return (
    <Label className={styles.label}>
      {children}
      {isRequired ? <span aria-hidden="true">*</span> : null}
    </Label>
  );
}

export function FieldMessages({ description, errorMessage }: Pick<FieldChromeProps, "description" | "errorMessage">) {
  return (
    <>
      {description ? <Text slot="description" className={styles.help}>{description}</Text> : null}
      <FieldError className={cx(styles.help, styles.error)}>{errorMessage}</FieldError>
    </>
  );
}

/**
 * Labelled text input. Validation is reported by the caller through `errorMessage`
 * (`validationBehavior="aria"`), so required fields never trigger native browser bubbles.
 */
export function TextField({ label, description, errorMessage, placeholder, className, leadingIcon, trailing, inputRef, isInvalid, validationBehavior = "aria", ...props }: TextFieldProps) {
  return (
    <RACTextField {...props} validationBehavior={validationBehavior} isInvalid={isInvalid ?? Boolean(errorMessage)} className={cx(styles.field, className)}>
      <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>
      <div className={styles.shell}>
        {leadingIcon ? <span className={styles.lead}><Icon name={leadingIcon} /></span> : null}
        <Input ref={inputRef} placeholder={placeholder} className={cx(styles.input, leadingIcon && styles.withIcon, trailing !== undefined && styles.withTrail)} />
        {trailing !== undefined ? <span className={styles.trail}>{trailing}</span> : null}
      </div>
      <FieldMessages description={description} errorMessage={errorMessage} />
    </RACTextField>
  );
}

export type TextAreaFieldProps = Omit<RACTextFieldProps, "children" | "className"> & FieldChromeProps & { rows?: number };

export function TextAreaField({ label, description, errorMessage, placeholder, className, rows, isInvalid, validationBehavior = "aria", ...props }: TextAreaFieldProps) {
  return (
    <RACTextField {...props} validationBehavior={validationBehavior} isInvalid={isInvalid ?? Boolean(errorMessage)} className={cx(styles.field, className)}>
      <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>
      <TextArea placeholder={placeholder} rows={rows} className={cx(styles.input, styles.textarea)} />
      <FieldMessages description={description} errorMessage={errorMessage} />
    </RACTextField>
  );
}

export type PasswordFieldProps = Omit<TextFieldProps, "type" | "trailing" | "inputRef">;

/**
 * Password input with a trailing show/hide button. Toggling keeps the value and, when the input
 * has focus, the caret position; pointer presses leave focus in the input.
 */
export function PasswordField({ label, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selection = useRef<[number | null, number | null] | null>(null);
  const subject = typeof label === "string" ? label.toLowerCase() : "password";

  useLayoutEffect(() => {
    const input = inputRef.current;
    const range = selection.current;
    selection.current = null;
    if (input && range && document.activeElement === input) input.setSelectionRange(range[0], range[1]);
  }, [visible]);

  function toggle() {
    const input = inputRef.current;
    if (input) selection.current = [input.selectionStart, input.selectionEnd];
    setVisible((current) => !current);
  }

  return (
    <TextField
      {...props}
      label={label}
      type={visible ? "text" : "password"}
      inputRef={inputRef}
      trailing={
        <RACButton className={styles.toggle} aria-label={`${visible ? "Hide" : "Show"} ${subject}`} preventFocusOnPress onPress={toggle}>
          <Icon name={visible ? "eye-off" : "eye"} />
        </RACButton>
      }
    />
  );
}
