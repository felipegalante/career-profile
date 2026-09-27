import type { ReactNode } from "react";
import { Button as RACButton, ListBox, ListBoxItem, Popover, Select as RACSelect, SelectValue, type Key, type SelectProps as RACSelectProps } from "react-aria-components";
import { Icon } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import { FieldLabel, FieldMessages } from "../TextField/TextField";
import fieldStyles from "../TextField/TextField.module.css";
import styles from "./Select.module.css";

export interface SelectOption {
  id: Key;
  label: string;
}

export type SelectProps<T extends SelectOption> = Omit<RACSelectProps<T>, "children" | "className" | "items"> & {
  label: ReactNode;
  items: Iterable<T>;
  description?: ReactNode;
  errorMessage?: ReactNode;
  className?: string;
};

/** Single-choice select: a `.selectbox` trigger opening a listbox that checks the selected option. */
export function Select<T extends SelectOption>({ label, items, description, errorMessage, className, isInvalid, validationBehavior = "aria", ...props }: SelectProps<T>) {
  return (
    <RACSelect {...props} validationBehavior={validationBehavior} isInvalid={isInvalid ?? Boolean(errorMessage)} className={cx(fieldStyles.field, styles.select, className)}>
      <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>
      <RACButton className={styles.selectbox}>
        <SelectValue className={styles.value} />
        <Icon name="chevron-down" />
      </RACButton>
      <FieldMessages description={description} errorMessage={errorMessage} />
      <Popover className={styles.popover} offset={6}>
        <ListBox className={styles.listbox} items={items}>
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.label} className={styles.item}>
              {({ isSelected }) => (
                <>
                  {isSelected ? <Icon name="check" /> : null}
                  {item.label}
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </RACSelect>
  );
}
