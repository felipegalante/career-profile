import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ComboBox, ComboBoxStateContext, Header, Input, ListBox, ListBoxItem, ListBoxSection, Popover, Text, VisuallyHidden, type Key } from "react-aria-components";
import { Icon } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import { FieldLabel, FieldMessages } from "../../primitives/TextField/TextField";
import { Skeleton } from "../../primitives/Skeleton/Skeleton";
import fieldStyles from "../../primitives/TextField/TextField.module.css";
import styles from "./CatalogCombobox.module.css";

export interface CatalogOption {
  id: string;
  label: string;
  /** Right-aligned context such as "Catalog", "At Shopify", a category, or "Already added". */
  meta?: ReactNode;
  /** Visible but not selectable, for values the profile already has. */
  isDisabled?: boolean;
}

export interface CatalogSearchResult {
  options: CatalogOption[];
  /** Whether a visible value matches the normalized query exactly; custom creation is then not offered. */
  hasExactMatch: boolean;
}

export type CatalogSearch<P> = (query: string, context: { signal: AbortSignal; parentContext: P }) => Promise<CatalogSearchResult>;

export type CatalogSelection = { kind: "catalog"; id: string; label: string } | { kind: "custom"; label: string };

export interface CatalogComboboxProps<P = undefined> {
  label: string;
  value: CatalogSelection | null;
  onChange: (value: CatalogSelection | null) => void;
  search: CatalogSearch<P>;
  /** Parent selection for dependent fields; a change reruns the search. */
  parentContext?: P;
  /** Offers "Create custom {noun} “query”" when no visible value matches exactly. */
  onCreateCustom?: (query: string) => void;
  /** Singular noun used in the create option, for example "company" or "major / specialization". */
  customNoun?: string;
  placeholder?: string;
  /** Keeps the label for assistive technology only, when a visible heading already names the field. */
  hideLabel?: boolean;
  description?: ReactNode;
  errorMessage?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  debounceMs?: number;
  minQueryLength?: number;
  className?: string;
}

type SearchStatus = "idle" | "loading" | "results" | "empty" | "error";

interface SearchState {
  status: SearchStatus;
  query: string;
  options: CatalogOption[];
  hasExactMatch: boolean;
}

const CREATE_KEY = "__catalog_create__";
const RETRY_KEY = "__catalog_retry__";
const IDLE: SearchState = { status: "idle", query: "", options: [], hasExactMatch: false };

export const DEFAULT_CATALOG_DEBOUNCE_MS = 250;

/** Bolds the first case-insensitive occurrence of the query as plain text, never as markup. */
function Highlight({ text, query }: { text: string; query: string }) {
  const index = query ? text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) : -1;
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <b>{text.slice(index, index + query.length)}</b>
      {text.slice(index + query.length)}
    </>
  );
}

function OpenBridge({ onReady }: { onReady: (open: () => void) => void }) {
  const state = useContext(ComboBoxStateContext);
  useEffect(() => {
    if (state) onReady(() => state.open(null, "manual"));
  }, [state, onReady]);
  return null;
}

/**
 * Searchable catalog selector shared by every catalog-backed field. It debounces remote search,
 * aborts and ignores stale responses, keeps the typed text separate from the selected value, and
 * shows loading, no-results, error and "Create custom" states inside the listbox popover.
 * The owning form decides what "Create custom" does and validates the selection.
 */
export function CatalogCombobox<P = undefined>({
  label,
  value,
  onChange,
  search,
  parentContext,
  onCreateCustom,
  customNoun,
  placeholder,
  hideLabel = false,
  description,
  errorMessage,
  isRequired,
  isDisabled,
  debounceMs = DEFAULT_CATALOG_DEBOUNCE_MS,
  minQueryLength = 1,
  className,
}: CatalogComboboxProps<P>) {
  const [inputValue, setInputValue] = useState(value?.label ?? "");
  const [isSearching, setIsSearching] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [state, setState] = useState<SearchState>(IDLE);
  const openRef = useRef<() => void>(() => undefined);
  const searchRef = useRef(search);
  searchRef.current = search;

  useEffect(() => {
    if (!isSearching) setInputValue(value?.label ?? "");
  }, [value, isSearching]);

  const query = inputValue.trim();

  useEffect(() => {
    if (!isSearching || query.length < minQueryLength) {
      setState(IDLE);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setState((current) => ({ ...current, status: "loading", query }));
      searchRef.current(query, { signal: controller.signal, parentContext: parentContext as P }).then(
        (result) => {
          if (controller.signal.aborted) return;
          setState({ status: result.options.length > 0 ? "results" : "empty", query, options: result.options, hasExactMatch: result.hasExactMatch });
        },
        () => {
          if (!controller.signal.aborted) setState({ status: "error", query, options: [], hasExactMatch: false });
        }
      );
    }, debounceMs);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, isSearching, parentContext, retryCount, debounceMs, minQueryLength]);

  // Results arrive after the keystroke that React Aria uses to decide whether to open, so open explicitly.
  useEffect(() => {
    if (isSearching && state.status !== "idle") openRef.current();
  }, [isSearching, state.status]);

  const canCreate = Boolean(onCreateCustom) && (state.status === "results" || state.status === "empty") && !state.hasExactMatch && state.query.length > 0;
  const createLabel = `Create custom ${customNoun ? `${customNoun} ` : ""}“${state.query}”`;

  function select(key: Key | null) {
    if (key === null) {
      if (query === "") onChange(null);
      return;
    }
    const option = state.options.find((candidate) => candidate.id === key);
    if (!option) return;
    setIsSearching(false);
    setInputValue(option.label);
    onChange({ kind: "catalog", id: option.id, label: option.label });
  }

  function createCustom() {
    const typed = state.query;
    setIsSearching(false);
    onCreateCustom?.(typed);
  }

  function onBlur() {
    setIsSearching(false);
    if (query === "") {
      if (value) onChange(null);
      setInputValue("");
    } else {
      setInputValue(value?.label ?? "");
    }
  }

  const announcement = state.status === "loading" ? "Searching…" : state.status === "error" ? "Search failed" : state.status === "empty" ? "No catalog matches" : "";

  return (
    <ComboBox
      className={cx(fieldStyles.field, className)}
      value={value?.kind === "catalog" ? value.id : null}
      onChange={select}
      inputValue={inputValue}
      onInputChange={(next) => {
        setInputValue(next);
        setIsSearching(true);
      }}
      onBlur={onBlur}
      allowsCustomValue
      allowsEmptyCollection={state.status !== "idle"}
      defaultFilter={() => true}
      menuTrigger="input"
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={Boolean(errorMessage)}
      validationBehavior="aria"
    >
      <OpenBridge onReady={(open) => (openRef.current = open)} />
      {hideLabel ? <VisuallyHidden><FieldLabel isRequired={isRequired}>{label}</FieldLabel></VisuallyHidden> : <FieldLabel isRequired={isRequired}>{label}</FieldLabel>}
      <div className={fieldStyles.shell}>
        <span className={fieldStyles.lead}><Icon name="search" /></span>
        <Input placeholder={placeholder} className={cx(fieldStyles.input, fieldStyles.withIcon)} />
      </div>
      <FieldMessages description={description} errorMessage={errorMessage} />
      <VisuallyHidden role="status">{announcement}</VisuallyHidden>
      <Popover className={styles.popover} offset={4} placement="bottom start">
        <ListBox
          className={styles.listbox}
          renderEmptyState={() =>
            state.status === "loading" ? (
              <div aria-hidden="true">
                <div className={styles.loadingRow}><Skeleton width={150} /></div>
                <div className={styles.loadingRow}><Skeleton width={210} /></div>
              </div>
            ) : state.status === "empty" ? (
              <div className={styles.empty}><b>No catalog matches</b><p>Try another search.</p></div>
            ) : null
          }
        >
          {state.status === "results" ? (
            <>
              {canCreate ? (
                <ListBoxItem id={CREATE_KEY} textValue={createLabel} onAction={createCustom} className={cx(styles.option, styles.create)}>
                  <Icon name="plus" />
                  <Text slot="label" className={styles.createLabel}>{createLabel}</Text>
                  <Text slot="description" className={styles.meta}>Only visible to you</Text>
                </ListBoxItem>
              ) : null}
              {state.options.map((option) => (
                <ListBoxItem key={option.id} id={option.id} textValue={option.label} isDisabled={option.isDisabled} className={styles.option}>
                  <Text slot="label" className={styles.label}><Highlight text={option.label} query={state.query} /></Text>
                  {option.meta ? <Text slot="description" className={cx(styles.meta, styles.faint)}>{option.meta}</Text> : null}
                </ListBoxItem>
              ))}
            </>
          ) : null}
          {state.status === "empty" && canCreate ? (
            <ListBoxSection>
              <Header className={cx(styles.empty, styles.emptyWithAction)}><b>No catalog matches</b><p>Try another search or create a private custom value.</p></Header>
              <ListBoxItem id={CREATE_KEY} textValue={createLabel} aria-label={createLabel} onAction={createCustom} className={styles.emptyAction}>
                <span className={styles.emptyButton}>Create custom</span>
              </ListBoxItem>
            </ListBoxSection>
          ) : null}
          {state.status === "error" ? (
            <ListBoxSection>
              <Header className={styles.error}><Icon name="close" />Search failed.</Header>
              <ListBoxItem
                id={RETRY_KEY}
                textValue="Retry search"
                aria-label="Retry search"
                onAction={() => {
                  setRetryCount((count) => count + 1);
                  window.setTimeout(() => openRef.current(), 0);
                }}
                className={cx(styles.option, styles.retry)}
              >
                Retry
              </ListBoxItem>
            </ListBoxSection>
          ) : null}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}
