import { useEffect, useRef, type ReactNode } from "react";
import { Callout } from "../../primitives/Callout/Callout";

export interface FormErrorSummaryProps {
  /** Nothing renders while empty. */
  children?: ReactNode;
  /** Move focus to the summary whenever a new message appears. */
  autoFocus?: boolean;
  className?: string;
}

/** Form-level error announced as an alert, for failures such as "We couldn’t save this record. Your entries are still here." */
export function FormErrorSummary({ children, autoFocus = true, className }: FormErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasMessage = children !== undefined && children !== null && children !== false && children !== "";

  useEffect(() => {
    if (hasMessage && autoFocus) ref.current?.focus();
  }, [children, hasMessage, autoFocus]);

  if (!hasMessage) return null;
  return <Callout ref={ref} tone="danger" role="alert" tabIndex={-1} className={className}>{children}</Callout>;
}
