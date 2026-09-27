import type { HTMLAttributes, ReactNode, TableHTMLAttributes, ThHTMLAttributes } from "react";
import { Button as RACButton, Input, Menu as RACMenu, MenuItem as RACMenuItem, MenuTrigger, Popover, TextField as RACTextField, VisuallyHidden, type Key } from "react-aria-components";
import { Icon } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import { Avatar } from "../../primitives/Avatar/Avatar";
import fieldStyles from "../../primitives/TextField/TextField.module.css";
import selectStyles from "../../primitives/Select/Select.module.css";
import styles from "./DataTable.module.css";

export function TableToolbar({ search, filters, className, ...props }: HTMLAttributes<HTMLDivElement> & { search?: ReactNode; filters?: ReactNode }) {
  return (
    <div {...props} className={cx(styles.toolbar, className)}>
      {search}
      {filters ? <div className={styles.tools}>{filters}</div> : null}
    </div>
  );
}

export interface TableSearchFieldProps {
  /** Accessible name, for example "Search users"; the placeholder carries the visible hint. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Toolbar search that grows to fill the space before the filters. */
export function TableSearchField({ label, value, onChange, placeholder }: TableSearchFieldProps) {
  return (
    <RACTextField aria-label={label} value={value} onChange={onChange} className={cx(fieldStyles.shell, styles.search)}>
      <span className={fieldStyles.lead}><Icon name="search" /></span>
      <Input type="search" placeholder={placeholder} className={cx(fieldStyles.input, fieldStyles.withIcon)} />
    </RACTextField>
  );
}

export interface FilterOption {
  id: Key;
  label: string;
}

export interface FilterSelectProps<T extends FilterOption> {
  /** Filter name shown before the value, for example "Role" renders "Role: All". */
  label: string;
  items: T[];
  value: Key;
  onChange: (value: Key) => void;
  /** Hides the "Label:" prefix when a visible label sits next to the control, as for rows per page. */
  showLabelPrefix?: boolean;
}

/**
 * Filled, borderless filter control. It is a menu button with a single-choice menu, so its
 * accessible name reads like the visible text, for example "Role: All".
 */
export function FilterSelect<T extends FilterOption>({ label, items, value, onChange, showLabelPrefix = true }: FilterSelectProps<T>) {
  const selected = items.find((item) => item.id === value);
  return (
    <MenuTrigger>
      <RACButton className={styles.filter} aria-label={`${label}: ${selected?.label ?? ""}`}>
        <span>{showLabelPrefix ? `${label}: ` : null}{selected?.label}</span>
        <Icon name="chevron-down" />
      </RACButton>
      <Popover className={selectStyles.popover} style={{ minWidth: 180 }} offset={6} placement="bottom end">
        <RACMenu
          aria-label={label}
          className={selectStyles.listbox}
          items={items}
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[value]}
          onSelectionChange={(keys) => {
            const [next] = keys === "all" ? [] : [...keys];
            if (next !== undefined) onChange(next);
          }}
        >
          {(item) => (
            <RACMenuItem id={item.id} textValue={item.label} className={selectStyles.item}>
              {({ isSelected }) => (
                <>
                  {isSelected ? <Icon name="check" /> : null}
                  {item.label}
                </>
              )}
            </RACMenuItem>
          )}
        </RACMenu>
      </Popover>
    </MenuTrigger>
  );
}

/** Named, keyboard-focusable horizontal scroll container, so narrow screens scroll the table instead of the page. */
export function TableScrollRegion({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className={cx(styles.region, className)}>
      {children}
    </div>
  );
}

/** Semantic table with the artifact header and row styling. Pass a caption for assistive technology. */
export function DataTable({ caption, className, children, ...props }: TableHTMLAttributes<HTMLTableElement> & { caption: string }) {
  return (
    <table {...props} className={cx(styles.table, className)}>
      <caption><VisuallyHidden>{caption}</VisuallyHidden></caption>
      {children}
    </table>
  );
}

export type SortDirection = "ascending" | "descending";

export interface SortableHeaderProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "onChange"> {
  label: string;
  /** Current direction when this column is sorted; undefined when another column is sorted. */
  direction?: SortDirection;
  onSort: (direction: SortDirection) => void;
}

/** Column header with a real button; `aria-sort` reports the active direction. */
export function SortableHeader({ label, direction, onSort, ...props }: SortableHeaderProps) {
  return (
    <th {...props} aria-sort={direction ?? "none"}>
      <button type="button" className={styles.sortHead} onClick={() => onSort(direction === "ascending" ? "descending" : "ascending")}>
        {label}
        <Icon name="sort" size={13} />
      </button>
    </th>
  );
}

/** Row spanning every column for loading, empty, no-match and error states. */
export function TableStateRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.stateCell}>{children}</td>
    </tr>
  );
}

export function PersonCell({ name, detail }: { name: string; detail?: ReactNode }) {
  return (
    <div className={styles.person}>
      <Avatar name={name} size="sm" />
      <div>
        <div className={styles.personName}>{name}</div>
        {detail ? <div className={styles.personMeta}>{detail}</div> : null}
      </div>
    </div>
  );
}

type PageEntry = number | "gap-start" | "gap-end";

/** First, last, and the current page with its neighbours; gaps become an ellipsis. */
export function paginationRange(page: number, pageCount: number): PageEntry[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((candidate) => candidate >= 1 && candidate <= pageCount));
  if (page <= 3) [2, 3].forEach((candidate) => pages.add(candidate));
  if (page >= pageCount - 2) [pageCount - 2, pageCount - 1].forEach((candidate) => pages.add(candidate));
  const sorted = [...pages].sort((a, b) => a - b);
  const entries: PageEntry[] = [];
  sorted.forEach((value, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && value - previous > 1) entries.push(index === 1 ? "gap-start" : "gap-end");
    entries.push(value);
  });
  return entries;
}

export interface PaginationProps {
  /** 1-based current page. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  /** Plural noun for the range line, for example "users". */
  itemLabel?: string;
}

/** Range summary, rows-per-page selector and page buttons for server-paginated tables. */
export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 25, 50, 100], itemLabel = "results" }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);
  return (
    <div className={styles.pagination}>
      <div className={styles.range} aria-live="polite">Showing {first}–{last} of {total} {itemLabel}</div>
      <div className={styles.rows}>
        <span aria-hidden="true">Rows per page</span>
        <FilterSelect label="Rows per page" showLabelPrefix={false} items={pageSizeOptions.map((size) => ({ id: size, label: String(size) }))} value={pageSize} onChange={(size) => onPageSizeChange(Number(size))} />
      </div>
      <nav aria-label="Pagination">
        <ul className={styles.pages}>
          <li><RACButton className={styles.page} aria-label="Previous page" isDisabled={page <= 1} onPress={() => onPageChange(page - 1)}>‹</RACButton></li>
          {paginationRange(page, pageCount).map((entry) =>
            typeof entry === "number" ? (
              <li key={entry}>
                <RACButton className={styles.page} aria-label={`Page ${entry}`} aria-current={entry === page ? "page" : undefined} onPress={() => onPageChange(entry)}>{entry}</RACButton>
              </li>
            ) : (
              <li key={entry} aria-hidden="true"><span className={cx(styles.page, styles.gap)}>…</span></li>
            )
          )}
          <li><RACButton className={styles.page} aria-label="Next page" isDisabled={page >= pageCount} onPress={() => onPageChange(page + 1)}>›</RACButton></li>
        </ul>
      </nav>
    </div>
  );
}
