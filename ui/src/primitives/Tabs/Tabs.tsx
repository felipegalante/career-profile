import { Tab as RACTab, TabList as RACTabList, TabPanel as RACTabPanel, Tabs as RACTabs, type TabListProps as RACTabListProps, type TabPanelProps as RACTabPanelProps, type TabProps as RACTabProps, type TabsProps as RACTabsProps } from "react-aria-components";
import { cx } from "../../foundations/classNames";
import styles from "./Tabs.module.css";

export type TabsProps = RACTabsProps;

/**
 * Tab set. Activation is manual, so arrow keys move focus and Enter or Space selects; this keeps
 * route-backed tabs (`href` on `Tab`) from navigating on every arrow press.
 */
export function Tabs({ keyboardActivation = "manual", ...props }: TabsProps) {
  return <RACTabs {...props} keyboardActivation={keyboardActivation} />;
}

export function TabList<T extends object>({ className, ...props }: Omit<RACTabListProps<T>, "className"> & { className?: string }) {
  return <RACTabList {...props} className={cx(styles.list, className)} />;
}

export function Tab({ className, ...props }: Omit<RACTabProps, "className"> & { className?: string }) {
  return <RACTab {...props} className={cx(styles.tab, className)} />;
}

export function TabPanel({ className, ...props }: Omit<RACTabPanelProps, "className"> & { className?: string }) {
  return <RACTabPanel {...props} className={cx(styles.panel, className)} />;
}
