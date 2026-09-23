import type { CSSProperties, ReactNode } from "react";
import { Header, Menu as RACMenu, MenuItem as RACMenuItem, MenuSection as RACMenuSection, Popover, Separator, type MenuItemProps as RACMenuItemProps, type MenuProps as RACMenuProps, type MenuSectionProps as RACMenuSectionProps, type PopoverProps } from "react-aria-components";
import { Icon, type IconName } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import styles from "./Menu.module.css";

export { MenuTrigger } from "react-aria-components";

export type MenuListProps<T extends object> = Omit<RACMenuProps<T>, "className" | "style"> & { width?: CSSProperties["width"]; className?: string };

/** The styled menu list. Renders inline on its own, or inside `Menu` as a popover. */
export function MenuList<T extends object>({ width, className, ...props }: MenuListProps<T>) {
  return <RACMenu {...props} className={cx(styles.menu, className)} style={width === undefined ? undefined : { width }} />;
}

export type MenuProps<T extends object> = MenuListProps<T> & { placement?: PopoverProps["placement"] };

/** Contextual action menu opened by the button inside a surrounding `MenuTrigger`. */
export function Menu<T extends object>({ placement = "bottom end", ...props }: MenuProps<T>) {
  return (
    <Popover placement={placement} offset={6} className={styles.popover}>
      <MenuList {...props} />
    </Popover>
  );
}

export type MenuItemProps = Omit<RACMenuItemProps, "className" | "children"> & {
  children: ReactNode;
  icon?: IconName;
  tone?: "default" | "danger";
  className?: string;
};

/** Menu row; a selected row in a selectable section shows the check icon in place of its icon. */
export function MenuItem({ children, icon, tone = "default", className, textValue, ...props }: MenuItemProps) {
  return (
    <RACMenuItem {...props} textValue={textValue ?? (typeof children === "string" ? children : undefined)} className={cx(styles.item, tone === "danger" && styles.danger, className)}>
      {({ isSelected, selectionMode }) => (
        <>
          {selectionMode !== "none" && isSelected ? <Icon name="check" /> : icon ? <Icon name={icon} /> : null}
          <span className={styles.label}>{children}</span>
        </>
      )}
    </RACMenuItem>
  );
}

export type MenuSectionProps<T extends object> = Omit<RACMenuSectionProps<T>, "className" | "children" | "items"> & { title?: ReactNode; children: ReactNode };

export function MenuSection<T extends object>({ title, children, ...props }: MenuSectionProps<T>) {
  return (
    <RACMenuSection {...props}>
      {title ? <Header className={styles.sectionHeader}>{title}</Header> : null}
      {children}
    </RACMenuSection>
  );
}

export function MenuSeparator() {
  return <Separator className={styles.separator} />;
}
