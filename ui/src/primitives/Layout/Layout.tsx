import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from "react";
import { cx } from "../../foundations/classNames";
import styles from "./Layout.module.css";

type Polymorphic<T extends ElementType, P> = P & { as?: T; children?: ReactNode } & Omit<ComponentPropsWithoutRef<T>, keyof P | "as" | "children">;

export type SurfaceProps<T extends ElementType = "section"> = Polymorphic<T, { padding?: "none" | "md" | "lg" }>;

/** White card surface with the artifact 12px radius and first elevation. */
export function Surface<T extends ElementType = "section">({ as, padding = "none", className, ...props }: SurfaceProps<T>) {
  const Component: ElementType = as ?? "section";
  return <Component {...props} className={cx(styles.surface, padding === "md" && styles.padMd, padding === "lg" && styles.padLg, className)} />;
}

function withGap(style: CSSProperties | undefined, gap: number | undefined): CSSProperties | undefined {
  return gap === undefined ? style : { ...style, gap };
}

export type StackProps<T extends ElementType = "div"> = Polymorphic<T, { gap?: number }>;

/** Vertical flow; 16px gap by default. */
export function Stack<T extends ElementType = "div">({ as, gap, className, style, ...props }: StackProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component {...props} style={withGap(style, gap)} className={cx(styles.stack, className)} />;
}

export type GridProps<T extends ElementType = "div"> = Polymorphic<T, { columns: 2 | 3 | 4; gap?: number }>;

/** Equal columns that collapse to one column at 860px and below. */
export function Grid<T extends ElementType = "div">({ as, columns, gap, className, style, ...props }: GridProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component {...props} style={withGap(style, gap)} className={cx(styles[`grid${columns}`], className)} />;
}

export type RowProps<T extends ElementType = "div"> = Polymorphic<T, { justify?: "start" | "between"; gap?: number }>;

/** Horizontal, vertically centred flow: 10px gap, or 16px with space-between. */
export function Row<T extends ElementType = "div">({ as, justify = "start", gap, className, style, ...props }: RowProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component {...props} style={withGap(style, gap)} className={cx(justify === "between" ? styles.between : styles.row, className)} />;
}
