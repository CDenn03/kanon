"use client";

import { useState, useRef, useEffect, useMemo, useCallback, useId, forwardRef } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronsUpDown, X, Loader2, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePopoverPosition, useMounted } from "@/hooks";
import { Field, controlBase, controlClasses } from "./field";

export interface ComboboxOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface SearchComboboxProps<T = ComboboxOption> {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  options?: T[];
  onSearch?: (query: string, signal: AbortSignal) => Promise<T[]>;
  multiple?: boolean;
  value: T | T[] | null;
  onChange: (value: T | T[] | null) => void;
  getOptionValue?: (o: T) => string;
  getOptionLabel?: (o: T) => string;
  getOptionMeta?: (o: T) => string | undefined;
  minChars?: number;
  placeholder?: string;
}

export function SearchCombobox<T = ComboboxOption>({
  id,
  label,
  hint,
  error,
  disabled,
  required,
  options,
  onSearch,
  multiple,
  value,
  onChange,
  getOptionValue = (o: T) => (o as ComboboxOption).value,
  getOptionLabel = (o: T) => (o as ComboboxOption).label,
  getOptionMeta,
  minChars = 0,
  placeholder = "Search…",
}: SearchComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [remote, setRemote] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const position = usePopoverPosition(boxRef, open, { matchWidth: true, preferredHeight: 240 });
  const mounted = useMounted();
  const listboxId = useId();
  const isRemote = typeof onSearch === "function";
  const belowMin = query.trim().length < minChars;

  useEffect(() => {
    if (!isRemote || !open || belowMin) {
      if (isRemote) setRemote([]);
      return;
    }
    const controller = new AbortController();
    let live = true;
    const t = setTimeout(async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const items = await onSearch!(query, controller.signal);
        if (live) setRemote(items);
      } catch (err: unknown) {
        if (controller.signal.aborted || (err instanceof DOMException && err.name === "AbortError")) return;
        if (live) setFetchError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (live) setLoading(false);
      }
    }, 300);
    return () => {
      live = false;
      clearTimeout(t);
      controller.abort();
    };
  }, [isRemote, open, query, belowMin, nonce, onSearch]);

  const items = useMemo(() => {
    if (isRemote) return remote;
    const q = query.trim().toLowerCase();
    if (!q) return options || [];
    return (options || []).filter((o) => {
      const lbl = getOptionLabel(o).toLowerCase();
      const meta = getOptionMeta?.(o)?.toLowerCase();
      return lbl.includes(q) || (meta ? meta.includes(q) : false);
    });
  }, [isRemote, remote, options, query, getOptionLabel, getOptionMeta]);

  const activeIndex = items.length === 0 ? 0 : Math.min(Math.max(active, 0), items.length - 1);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setPortalContainer(null);
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    const dialog = boxRef.current?.closest<HTMLElement>('[role="dialog"]');
    setPortalContainer(dialog ?? document.body);
    setOpen(true);
  }, [disabled]);

  useEffect(() => {
    const h = (e: globalThis.MouseEvent) => {
      const t = e.target as Node;
      if (!boxRef.current?.contains(t) && !popoverRef.current?.contains(t)) {
        close();
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const valueArray = multiple ? ((value as T[]) || []) : value ? [value as T] : [];
  const selectedValues = new Set(valueArray.map(getOptionValue));
  const hasValue = multiple ? ((value as T[]) || []).length > 0 : Boolean(value);

  const pick = useCallback(
    (o: T) => {
      if (multiple) {
        const v = getOptionValue(o);
        const arr = (value as T[]) || [];
        const has = arr.some((s) => getOptionValue(s) === v);
        onChange(has ? arr.filter((s) => getOptionValue(s) !== v) : [...arr, o]);
        setQuery("");
        inputRef.current?.focus();
      } else {
        onChange(o);
        close();
      }
    },
    [multiple, value, onChange, getOptionValue, close]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openMenu();
        setActive((i) => Math.min(i + 1, items.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(items.length - 1);
        break;
      case "Enter":
        if (open && items[activeIndex]) {
          e.preventDefault();
          pick(items[activeIndex]);
        }
        break;
      case "Escape":
        close();
        break;
      case "Backspace":
        if (!query && multiple && (value as T[]).length) {
          onChange((value as T[]).slice(0, -1));
        }
        break;
    }
  };

  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} required={required}>
      <div ref={boxRef} className="relative">
        <div
          onClick={openMenu}
          className={cn(
            controlBase,
            controlClasses(error, disabled),
            "flex min-h-10 flex-wrap items-center gap-1 px-2 py-1",
            !disabled && "cursor-text",
            "focus-within:border-border focus-within:ring-0 focus-visible:border-border focus-visible:ring-0",
            error && "focus-within:border-error focus-visible:border-error"
          )}
        >
          {multiple &&
            ((value as T[]) || []).map((s) => (
              <span
                key={getOptionValue(s)}
                className="inline-flex items-center gap-1 rounded bg-accent-light px-1.5 py-0.5 text-xs font-medium text-accent"
              >
                {getOptionLabel(s)}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange((value as T[]).filter((x) => getOptionValue(x) !== getOptionValue(s)));
                  }}
                  aria-label={`Remove ${getOptionLabel(s)}`}
                  className="rounded-full hover:opacity-70"
                >
                  <X size={11} aria-hidden />
                </button>
              </span>
            ))}
          {!multiple && value && !query && (
            <span className="pointer-events-none absolute left-3 truncate text-sm text-text">
              {getOptionLabel(value as T)}
            </span>
          )}
          <input
            id={id}
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={open ? listboxId : undefined}
            aria-activedescendant={open && items.length > 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
            aria-required={required}
            value={query}
            disabled={disabled}
            placeholder={hasValue ? "" : placeholder}
            onFocus={openMenu}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            style={{ outline: "none" }}
            className="min-w-16 flex-1 cursor-text bg-transparent px-1 py-0.5 text-sm text-text placeholder:text-text-tertiary"
          />
          <span className="ml-auto flex items-center gap-1 pl-1">
            {loading && <Loader2 size={13} className="animate-spin text-text-tertiary" aria-hidden />}
            {hasValue && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(multiple ? [] : null);
                }}
                aria-label="Clear"
                className="rounded p-0.5 text-text-tertiary hover:text-text"
              >
                <X size={14} aria-hidden />
              </button>
            )}
            <ChevronsUpDown size={14} className="text-text-tertiary" aria-hidden />
          </span>
        </div>
        {open &&
          position &&
          mounted &&
          portalContainer &&
          createPortal(
            <ComboboxDropdown
              ref={popoverRef}
              listboxId={listboxId}
              multiple={multiple}
              items={items}
              loading={loading}
              fetchError={fetchError}
              belowMin={belowMin}
              minChars={minChars}
              query={query}
              active={activeIndex}
              selectedValues={selectedValues}
              position={position}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              getOptionMeta={getOptionMeta}
              onPick={pick}
              onSetActive={setActive}
              onRetry={() => setNonce((n) => n + 1)}
            />,
            portalContainer
          )}
      </div>
    </Field>
  );
}

interface ComboboxDropdownProps<T> {
  listboxId: string;
  multiple?: boolean;
  items: T[];
  loading: boolean;
  fetchError: string | null;
  belowMin: boolean;
  minChars: number;
  query: string;
  active: number;
  selectedValues: Set<string>;
  position: { style: React.CSSProperties };
  getOptionValue: (o: T) => string;
  getOptionLabel: (o: T) => string;
  getOptionMeta?: (o: T) => string | undefined;
  onPick: (o: T) => void;
  onSetActive: (i: number) => void;
  onRetry: () => void;
}

const ComboboxDropdown = forwardRef(function ComboboxDropdown<T>(
  {
    listboxId,
    multiple,
    items,
    loading,
    fetchError,
    belowMin,
    minChars,
    query,
    active,
    selectedValues,
    position,
    getOptionValue,
    getOptionLabel,
    getOptionMeta,
    onPick,
    onSetActive,
    onRetry,
  }: ComboboxDropdownProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div
      ref={ref}
      id={listboxId}
      role="listbox"
      aria-label="Options"
      className="z-40 max-h-60 overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
      style={position.style}
    >
      {loading ? (
        <p className="flex items-center gap-2 px-3 py-4 text-sm text-text-secondary">
          <Loader2 size={14} className="animate-spin" aria-hidden /> Searching…
        </p>
      ) : fetchError ? (
        <div className="px-3 py-4 text-center">
          <p className="text-sm text-error">{fetchError}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 rounded text-xs font-medium text-accent underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <RotateCw size={12} aria-hidden /> Try again
          </button>
        </div>
      ) : belowMin ? (
        <p className="px-3 py-4 text-center text-sm text-text-secondary">
          Type at least {minChars} character{minChars !== 1 && "s"} to search.
        </p>
      ) : items.length === 0 ? (
        <div className="px-3 py-4 text-center">
          <p className="text-sm text-text">{query ? `No match for "${query}"` : "Nothing to choose from"}</p>
          {query && <p className="mt-0.5 text-xs text-text-secondary">Check the spelling, or clear the search.</p>}
        </div>
      ) : (
        items.map((o, i) => {
          const v = getOptionValue(o);
          const on = selectedValues.has(v);
          const meta = getOptionMeta?.(o);
          const isActive = i === active;
          return (
            <div
              key={v}
              ref={isActive ? activeRef : undefined}
              id={`${listboxId}-opt-${i}`}
              role="option"
              aria-selected={on}
              onMouseEnter={() => onSetActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPick(o)}
              className={cn(
                "flex cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm text-text transition-colors hover:bg-bg-hover",
                isActive && "bg-bg-secondary"
              )}
            >
              {multiple && (
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                    on ? "border-accent bg-accent" : "border-border bg-transparent"
                  )}
                >
                  {on && <Check size={11} strokeWidth={3} className="text-on-accent" />}
                </span>
              )}
              <span className="flex-1 truncate">{getOptionLabel(o)}</span>
              {meta && <span className="text-xs tabular-nums text-text-tertiary">{meta}</span>}
              {!multiple && on && <Check size={14} className="shrink-0 text-accent" aria-hidden />}
            </div>
          );
        })
      )}
    </div>
  );
}) as <T>(props: ComboboxDropdownProps<T> & { ref?: React.Ref<HTMLDivElement> }) => React.ReactElement;
