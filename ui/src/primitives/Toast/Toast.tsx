import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Button as RACButton } from "react-aria-components";
import { Icon } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import styles from "./Toast.module.css";

export type ToastTone = "success" | "danger";

export interface ToastOptions {
  tone?: ToastTone;
  title: string;
  description?: string;
  action?: { label: string; onAction: () => void };
  /** Milliseconds before the toast hides. Defaults to 2600, or 8000 when the toast has an action. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

export const TOAST_DURATION = 2600;
export const ACTION_TOAST_DURATION = 8000;
const MAX_VISIBLE = 3;

interface ToastApi {
  show: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside ToastProvider (rendered by UiProvider).");
  return api;
}

export interface ToastViewProps extends ToastOptions, Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  onDismiss?: () => void;
}

/** Presentational toast: full semantic surface, icon, title, optional description and action, dismiss button. */
export function ToastView({ tone = "success", title, description, action, onDismiss, className, duration: _duration, ...props }: ToastViewProps) {
  return (
    <div {...props} className={cx(styles.toast, styles[tone], className)}>
      <Icon name={tone === "success" ? "check" : "close"} className={styles.icon} />
      <div className={styles.content}>
        <b>{title}</b>
        {description ? <div className={styles.description}>{description}</div> : null}
        {action ? <div className={styles.actions}><RACButton className={styles.action} onPress={action.onAction}>{action.label}</RACButton></div> : null}
      </div>
      {onDismiss ? (
        <RACButton className={styles.dismiss} aria-label="Dismiss notification" onPress={onDismiss}>
          <Icon name="close" size={16} />
        </RACButton>
      ) : null}
    </div>
  );
}

function TimedToast({ entry, onDismiss }: { entry: ToastEntry; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState({ hover: false, focus: false });
  const remaining = useRef(entry.duration ?? (entry.action ? ACTION_TOAST_DURATION : TOAST_DURATION));
  const isPaused = paused.hover || paused.focus;

  useEffect(() => {
    if (isPaused) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismiss(entry.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt));
    };
  }, [isPaused, entry.id, onDismiss]);

  return (
    <div
      onPointerEnter={() => setPaused((state) => ({ ...state, hover: true }))}
      onPointerLeave={() => setPaused((state) => ({ ...state, hover: false }))}
      onFocus={() => setPaused((state) => ({ ...state, focus: true }))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused((state) => ({ ...state, focus: false }));
      }}
    >
      <ToastView
        tone={entry.tone}
        title={entry.title}
        description={entry.description}
        onDismiss={() => onDismiss(entry.id)}
        action={entry.action ? { label: entry.action.label, onAction: () => { entry.action?.onAction(); onDismiss(entry.id); } } : undefined}
      />
    </div>
  );
}

/**
 * Queues short-lived mutation feedback in a fixed top-right region. Success toasts are polite
 * status messages; danger toasts are assertive alerts. Timers pause while hovered or focused.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const show = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    const entry: ToastEntry = { tone: "success", ...options, id };
    setToasts((current) => [...current, entry].slice(-MAX_VISIBLE));
    return id;
  }, []);
  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <section aria-label="Notifications" className={styles.region}>
        <div role="status" aria-live="polite" className={styles.live}>
          {toasts.filter((toast) => toast.tone !== "danger").map((toast) => <TimedToast key={toast.id} entry={toast} onDismiss={dismiss} />)}
        </div>
        <div role="alert" aria-live="assertive" className={styles.live}>
          {toasts.filter((toast) => toast.tone === "danger").map((toast) => <TimedToast key={toast.id} entry={toast} onDismiss={dismiss} />)}
        </div>
      </section>
    </ToastContext.Provider>
  );
}
