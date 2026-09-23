import type { CSSProperties } from "react";
import { VisuallyHidden } from "react-aria-components";
import { cx } from "../../foundations/classNames";
import styles from "./Skeleton.module.css";

export interface SkeletonProps {
  size?: "line" | "lg";
  width?: CSSProperties["width"];
  className?: string;
}

/** Static placeholder bar; the artifacts define no shimmer animation. */
export function Skeleton({ size = "line", width, className }: SkeletonProps) {
  return <div aria-hidden="true" className={cx(styles.skeleton, size === "lg" && styles.lg, className)} style={width === undefined ? undefined : { width }} />;
}

export interface LoadingSkeletonProps {
  /** Announced to assistive technology while the placeholder is visible. */
  label?: string;
  /** Widths of the line placeholders after the large title bar. */
  lines?: Array<CSSProperties["width"]>;
  className?: string;
}

/** Collection loading state: a title bar and text lines, announced as a status. */
export function LoadingSkeleton({ label = "Loading", lines = ["100%", "84%", "68%"], className }: LoadingSkeletonProps) {
  return (
    <div role="status" className={cx(styles.stack, className)}>
      <VisuallyHidden>{label}</VisuallyHidden>
      <Skeleton size="lg" />
      {lines.map((width, index) => <Skeleton key={index} width={width} />)}
    </div>
  );
}
