import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Check, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, X, Loader2,
  AlertTriangle, Info, CircleCheck, Calendar as CalIcon, Trash2, Eye, EyeOff,
  RotateCw, Plus,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   STEWARD UI KIT — style guide
   Mirrors src/components/ui/*.tsx. This file re-implements each
   component inline (no @/lib/utils, no portals to real DOM outside
   the artifact) so it can run standalone — the real files are the
   source of truth; this is the presentation of them.
   ═══════════════════════════════════════════════════════════════ */
const T = {
  bg: "#FBFBFC", surface: "#FFFFFF", hairline: "#E7E8EC", muted: "#F4F5F7",
  ink: "#15171C", ink2: "#5B6070", ink3: "#8A90A0",
  accent: "#0B5D4E", accentHover: "#094C40", accentSoft: "#E6F0ED",
  amber: "#8A5A00", amberSoft: "#FDF3E0",
  rose: "#8C2F39", roseHover: "#75262E", roseSoft: "#FBEBEC",
};
const cx = (...a) => a.filter(Boolean).join(" ");
const ring = (c = T.accent) => ({ outlineColor: c });

/* usePopoverPosition — mirrors src/components/ui/popover-position.ts.
   Open downward by default; flip upward when there isn't room below AND
   there's more room above; clamp horizontally so nothing renders past
   the viewport edge; re-measure on scroll/resize while open. "top"
   placement anchors the popover's BOTTOM edge above the trigger (via
   `bottom`, not a calculated `top`), so it grows upward correctly
   without ever needing to measure its own rendered height. */
function usePopoverPosition(anchorRef, open, options = {}) {
  const { align = "start", gap = 4, viewportPadding = 8, preferredHeight = 320, matchWidth = false, minWidth } = options;
  const [position, setPosition] = useState(null);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;
    const placement = spaceBelow < Math.min(preferredHeight, 160) && spaceAbove > spaceBelow ? "top" : "bottom";
    const maxHeight = Math.max(120, Math.min(preferredHeight, placement === "top" ? spaceAbove : spaceBelow));
    const width = matchWidth ? rect.width : minWidth;
    let left = align === "end" && width ? rect.right - width : rect.left;
    if (align === "center" && width) left = rect.left + rect.width / 2 - width / 2;
    left = width ? Math.min(Math.max(left, viewportPadding), vw - width - viewportPadding)
                 : Math.min(Math.max(left, viewportPadding), vw - viewportPadding);
    setPosition({
      placement,
      style: {
        position: "fixed",
        top: placement === "top" ? undefined : rect.bottom + gap,
        bottom: placement === "top" ? vh - rect.top + gap : undefined,
        left,
        width: matchWidth ? rect.width : undefined,
        minWidth: !matchWidth ? minWidth : undefined,
        maxHeight,
      },
    });
  }, [anchorRef, align, gap, viewportPadding, preferredHeight, matchWidth, minWidth]);

  useEffect(() => {
    if (!open) { setPosition(null); return; }
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => { window.removeEventListener("scroll", measure, true); window.removeEventListener("resize", measure); };
  }, [open, measure]);

  return position;
}

/* React portals need `document` to exist, which is always true once
   mounted client-side — this just avoids the one-tick mismatch between
   server and first client render. Shared so five components don't each
   carry their own copy. */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/* ── layout chrome for the showcase itself ─────────────────────── */
function Page({ children }) {
  return <div className="min-h-screen w-full" style={{ background: T.bg, color: T.ink }}>{children}</div>;
}
function Section({ id, kicker, title, note, children }) {
  return (
    <section id={id} className="scroll-mt-20 border-t pt-10" style={{ borderColor: T.hairline }}>
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: T.ink3 }}>{kicker}</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
      {note && <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: T.ink2 }}>{note}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
function Demo({ label, spec, children }) {
  return (
    <div className="rounded-lg border" style={{ borderColor: T.hairline, background: T.surface }}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2" style={{ borderColor: T.hairline }}>
        <span className="text-xs font-medium" style={{ color: T.ink }}>{label}</span>
        {spec && <span className="font-mono text-[10px]" style={{ color: T.ink3 }}>{spec}</span>}
      </div>
      <div className="flex flex-wrap items-start gap-4 p-4">{children}</div>
    </div>
  );
}
function Callout({ tone = "note", children }) {
  const map = { note: [T.muted, T.ink2], fix: [T.accentSoft, T.accent], watch: [T.amberSoft, T.amber] };
  const [bg, fg] = map[tone];
  return <p className="rounded-md px-3 py-2 text-xs leading-relaxed" style={{ background: bg, color: fg }}>{children}</p>;
}
const NAV = [
  ["button", "Button"], ["field", "Field"], ["input", "Input"], ["money", "MoneyInput"], ["textarea", "Textarea"],
  ["combobox", "SearchCombobox"], ["tabs", "Tabs"], ["calendar", "Calendar"],
  ["toast", "Toast"], ["confirm", "Confirm & hold-to-delete"], ["tokens", "Tokens"],
];

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES — inline mirrors of src/components/ui
   ═══════════════════════════════════════════════════════════════ */

/* Field ---------------------------------------------------------- */
function Field({ label, hint, error, required, htmlFor, counter, children }) {
  const message = error || hint;
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="flex items-center gap-1 text-[13px] font-medium" style={{ color: T.ink }}>
          {label}{required && <span style={{ color: T.rose }}>*</span>}
        </label>
      )}
      {children}
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs leading-snug" style={{ color: error ? T.rose : T.ink2 }}>{message || "\u00A0"}</p>
        {counter && <span className="shrink-0 text-xs tabular-nums" style={{ color: counter.warn ? T.rose : T.ink3 }}>{counter.text}</span>}
      </div>
    </div>
  );
}
const controlBase = "w-full rounded-md border text-sm transition-colors focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed";
const controlStyle = (error, disabled) => ({
  borderColor: error ? T.rose : T.hairline,
  background: disabled ? T.muted : T.surface,
  color: disabled ? T.ink3 : T.ink,
  ...ring(error ? T.rose : T.accent),
});

/* Button ----------------------------------------------------------- */
const BTN_SIZE = { sm: "h-8 px-2.5 text-sm gap-1.5", md: "h-9 px-3.5 text-sm gap-1.5", lg: "h-10 px-4 text-sm gap-2" };
/* Palette per variant, WITH a hover colour — the previous version set
   background via inline style with no hover mechanism at all, so no
   button in this file ever visibly responded to a pointer. Hover is
   now real React state, since colours here are plain hex (not Tailwind
   utility classes), so a CSS :hover pseudo-class has nothing to attach
   to — this is the standalone-artifact equivalent of what `hover:bg-
   (--primary-hover)` does for free in the real button.tsx. */
const BTN_PALETTE = {
  primary: { bg: T.accent, bgHover: T.accentHover, fg: "#fff", border: "transparent" },
  secondary: { bg: T.surface, bgHover: T.muted, fg: T.ink, border: T.hairline },
  ghost: { bg: "transparent", bgHover: T.muted, fg: T.ink2, fgHover: T.ink, border: "transparent" },
  destructive: { bg: T.rose, bgHover: T.roseHover, fg: "#fff", border: "transparent" },
  link: { bg: "transparent", bgHover: "transparent", fg: T.accent, border: "transparent" },
};
/* One canonical disabled look, substituted for the variant entirely —
   not layered on top of it. A faded destructive button still reads
   "red, dimmed"; a muted one reads "unavailable", which is the actual
   message regardless of what it would have done. */
const BTN_DISABLED = { bg: T.muted, fg: T.ink3, border: T.hairline };

function Button({ variant = "primary", size = "md", loading, disabled, disabledReason, icon: Icon, iconRight: IconR, children, onClick, title, type = "button" }) {
  const [hover, setHover] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const isDisabled = Boolean(disabled) && !loading;
  const explainable = isDisabled && Boolean(disabledReason);
  const wrapRef = useRef(null);
  const mounted = useMounted();
  // Same flip-on-edge hook as SearchCombobox/Calendar — a disabled
  // button near the bottom of the viewport used to render its reason
  // tooltip straight off-screen; this makes it flip below instead.
  const tipPosition = usePopoverPosition(wrapRef, showTip, { align: "center", gap: 8, minWidth: 140, preferredHeight: 60 });

  const p = isDisabled ? BTN_DISABLED : BTN_PALETTE[variant];
  const bg = isDisabled ? p.bg : hover ? p.bgHover : p.bg;
  const fg = isDisabled ? p.fg : hover && p.fgHover ? p.fgHover : p.fg;

  const handleClick = (e) => { if (explainable) { e.preventDefault(); return; } onClick?.(e); };

  return (
    <span ref={wrapRef} className="relative inline-flex"
      onMouseEnter={() => { setHover(true); if (explainable) setShowTip(true); }}
      onMouseLeave={() => { setHover(false); setShowTip(false); }}>
      <button type={type}
        disabled={(isDisabled && !explainable) || loading}
        aria-disabled={explainable || undefined}
        onFocus={() => explainable && setShowTip(true)}
        onBlur={() => setShowTip(false)}
        onClick={handleClick}
        title={!explainable ? title : undefined}
        className={cx("relative inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isDisabled && "cursor-not-allowed",
          variant === "link" ? "text-sm underline-offset-2 hover:underline" : BTN_SIZE[size])}
        style={{ background: bg, color: fg, border: `1px solid ${p.border}`, ...ring(variant === "destructive" ? T.rose : T.accent) }}>
        {loading && <Loader2 size={14} className="absolute animate-spin" />}
        <span className="inline-flex items-center gap-1.5" style={{ opacity: loading ? 0 : 1 }}>
          {Icon && <Icon size={size === "lg" ? 16 : 15} strokeWidth={2.2} />}{children}{IconR && <IconR size={15} strokeWidth={2.2} />}
        </span>
      </button>
      {explainable && showTip && tipPosition && mounted && createPortal(
        <span role="tooltip" className="pointer-events-none z-50 w-max max-w-56 rounded-md px-2.5 py-1.5 text-xs leading-snug shadow-lg"
          style={{ ...tipPosition.style, background: T.ink, color: "#fff" }}>
          {disabledReason}
          <span className="absolute left-1/2 size-2 -translate-x-1/2 rotate-45" style={{ background: T.ink, ...(tipPosition.placement === "top" ? { bottom: -4 } : { top: -4 }) }} />
        </span>,
        document.body
      )}
    </span>
  );
}

/* Input / Textarea --------------------------------------------------- */
function Input({ label, hint, error, required, disabled, readOnly, prefix, suffix, type = "text", numeric, placeholder, value, onChange, id }) {
  const [reveal, setReveal] = useState(false);
  const isPw = type === "password";
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <div className="relative flex items-center">
        {prefix && <span className="pointer-events-none absolute left-2.5 text-sm" style={{ color: T.ink3 }}>{prefix}</span>}
        <input id={id} type={isPw && reveal ? "text" : type} disabled={disabled} readOnly={readOnly}
          placeholder={placeholder} value={value} onChange={onChange} aria-invalid={Boolean(error)}
          className={cx(controlBase, "h-9", prefix ? "pl-7" : "pl-3", (suffix || isPw) ? "pr-9" : "pr-3", numeric && "text-right tabular-nums")}
          style={{ ...controlStyle(error, disabled), background: readOnly ? T.muted : controlStyle(error, disabled).background }} />
        {isPw ? (
          <button type="button" onClick={() => setReveal((r) => !r)} aria-label={reveal ? "Hide" : "Show"}
            className="absolute right-2 rounded p-1 focus:outline-none focus-visible:ring-2" style={{ color: T.ink3, ...ring() }}>
            {reveal ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        ) : suffix ? <span className="pointer-events-none absolute right-3 text-sm" style={{ color: T.ink3 }}>{suffix}</span> : null}
      </div>
    </Field>
  );
}
function Textarea({ label, hint, error, required, placeholder, maxLength, rows = 3, value, onChange, id }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (!el) return; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 220) + "px"; }, [value]);
  const len = (value || "").length;
  const counter = maxLength ? { text: `${len}/${maxLength}`, warn: len > maxLength * 0.9 } : null;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id} counter={counter}>
      <textarea ref={ref} id={id} rows={rows} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength}
        className={cx(controlBase, "resize-none px-3 py-2 leading-relaxed")} style={controlStyle(error)} />
    </Field>
  );
}

/* MoneyInput -------------------------------------------------------- */
/* Grouped display ("1,234.50") while blurred, RAW display ("1234.5")
   while focused. Reformatting with commas on every keystroke fights
   the native cursor position — the usual fix is fragile manual
   cursor-index math. Editing a plain number needs none of that; the
   comma only needs to exist once editing stops. Clamping to min/max
   also happens on blur, not per keystroke, for the same reason:
   clamping mid-type turns "50" on the way to "500" (max 1000) into a
   jump the instant you overshoot, which reads as the field fighting
   you rather than helping you. */
function sanitizeMoney(raw, allowNegative, decimals) {
  let s = raw.replace(allowNegative ? /[^0-9.-]/g : /[^0-9.]/g, "");
  if (allowNegative) {
    const negative = s.startsWith("-");
    s = s.replace(/-/g, "");
    if (negative) s = "-" + s;
  }
  const dot = s.indexOf(".");
  if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "");
  if (decimals === 0) s = s.split(".")[0];
  else if (dot !== -1) { const [i, f = ""] = s.split("."); s = i + "." + f.slice(0, decimals); }
  return s;
}
function moneyToNumber(s) {
  if (s === "" || s === "-" || s === ".") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function MoneyInput({ id, label, hint, error, disabled, readOnly, placeholder = "0.00", currency, value, onChange,
  decimals = 2, allowNegative = false, max, min, locale = "en-KE" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const format = (n) => (n === null || Number.isNaN(n) ? "" : n.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }));
  const display = editing ? draft : format(value);
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <div className="relative flex items-center">
        {currency && <span className="pointer-events-none absolute left-3 text-sm" style={{ color: T.ink3 }}>{currency}</span>}
        <input id={id} inputMode="decimal" disabled={disabled} readOnly={readOnly} placeholder={placeholder} value={display}
          onFocus={() => { setEditing(true); setDraft(value === null ? "" : String(value)); }}
          onChange={(e) => { const cleaned = sanitizeMoney(e.target.value, allowNegative, decimals); setDraft(cleaned); onChange(moneyToNumber(cleaned)); }}
          onBlur={() => {
            setEditing(false);
            let n = moneyToNumber(draft);
            if (n !== null) { if (typeof max === "number") n = Math.min(n, max); if (typeof min === "number") n = Math.max(n, min); }
            onChange(n);
          }}
          className={cx(controlBase, "h-9 tabular-nums text-right pr-3", currency ? "pl-12" : "pl-3")}
          style={{ ...controlStyle(error, disabled), background: readOnly ? T.muted : controlStyle(error, disabled).background }} />
      </div>
    </Field>
  );
}

/* SearchCombobox ------------------------------------------------------ */
/* Mirrors the real component's contract: getOptionValue/getOptionLabel
   for identity, options (static) OR onSearch (async) — never both,
   never a magic "local" string. Simulated network below. */
function fakeSearch(all, delayMs = 500, failOnce) {
  let failed = false;
  return async (query, signal) => {
    await new Promise((res, rej) => {
      const t = setTimeout(res, delayMs);
      signal.addEventListener("abort", () => { clearTimeout(t); rej(new DOMException("aborted", "AbortError")); });
    });
    if (failOnce && !failed) { failed = true; throw new Error("Network error — couldn't reach the server."); }
    const q = query.trim().toLowerCase();
    return q ? all.filter((o) => o.label.toLowerCase().includes(q)) : all;
  };
}
function SearchCombobox({ id, label, hint, error, disabled, options, onSearch, multiple, value, onChange,
  getOptionValue = (o) => o.value, getOptionLabel = (o) => o.label, getOptionMeta, minChars = 0, placeholder = "Search…" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [nonce, setNonce] = useState(0);
  const boxRef = useRef(null);
  const position = usePopoverPosition(boxRef, open, { matchWidth: true, preferredHeight: 240 });
  const mounted = useMounted();
  const isRemote = typeof onSearch === "function";
  const belowMin = query.trim().length < minChars;

  useEffect(() => {
    if (!isRemote || !open || belowMin) { if (isRemote) setRemote([]); return; }
    const controller = new AbortController();
    let live = true;
    const t = setTimeout(async () => {
      setLoading(true); setFetchError(null);
      try { const items = await onSearch(query, controller.signal); if (live) setRemote(items); }
      catch (err) { if (controller.signal.aborted || err.name === "AbortError") return; if (live) setFetchError(err.message); }
      finally { if (live) setLoading(false); }
    }, 300);
    return () => { live = false; clearTimeout(t); controller.abort(); };
  }, [isRemote, open, query, belowMin, nonce]);

  const items = useMemo(() => {
    if (isRemote) return remote;
    const q = query.trim().toLowerCase();
    return !q ? options : options.filter((o) => getOptionLabel(o).toLowerCase().includes(q));
  }, [isRemote, remote, options, query, getOptionLabel]);

  useEffect(() => {
    const h = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) { setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectedValues = new Set(multiple ? (value || []).map(getOptionValue) : value ? [getOptionValue(value)] : []);
  const hasValue = multiple ? (value || []).length > 0 : Boolean(value);

  const pick = (o) => {
    if (multiple) {
      const v = getOptionValue(o);
      const has = value.some((s) => getOptionValue(s) === v);
      onChange(has ? value.filter((s) => getOptionValue(s) !== v) : [...value, o]);
      setQuery("");
    } else { onChange(o); setQuery(""); setOpen(false); }
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && open && items[active]) { e.preventDefault(); pick(items[active]); }
    else if (e.key === "Escape") { setOpen(false); setQuery(""); }
    else if (e.key === "Backspace" && !query && multiple && value.length) onChange(value.slice(0, -1));
  };

  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <div ref={boxRef} className="relative">
        <div onClick={() => !disabled && setOpen(true)}
          className={cx(controlBase, "flex min-h-9 flex-wrap items-center gap-1 px-2 py-1", !disabled && "cursor-text")}
          style={controlStyle(error, disabled)}>
          {multiple && (value || []).map((s) => (
            <span key={getOptionValue(s)} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium" style={{ background: T.accentSoft, color: T.accent }}>
              {getOptionLabel(s)}
              <button onClick={(e) => { e.stopPropagation(); onChange(value.filter((x) => getOptionValue(x) !== getOptionValue(s))); }} aria-label={`Remove ${getOptionLabel(s)}`} className="rounded-full hover:opacity-70">
                <X size={11} />
              </button>
            </span>
          ))}
          {!multiple && value && !query && (
            <span className="pointer-events-none absolute left-3 truncate text-sm" style={{ color: T.ink }}>{getOptionLabel(value)}</span>
          )}
          <input id={id} role="combobox" aria-expanded={open} value={query} disabled={disabled}
            placeholder={hasValue ? "" : placeholder}
            onFocus={() => setOpen(true)} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onKeyDown={onKeyDown}
            className="min-w-16 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none" style={{ color: T.ink }} />
          <span className="ml-auto flex items-center gap-1 pl-1">
            {loading && <Loader2 size={13} className="animate-spin" style={{ color: T.ink3 }} />}
            {hasValue && !disabled && (
              <button onClick={(e) => { e.stopPropagation(); onChange(multiple ? [] : null); }} aria-label="Clear" className="rounded p-0.5" style={{ color: T.ink3 }}>
                <X size={14} />
              </button>
            )}
            <ChevronsUpDown size={14} style={{ color: T.ink3 }} />
          </span>
        </div>
        {open && position && mounted && createPortal(
          <div role="listbox" className="z-40 overflow-auto rounded-md border bg-white py-1 shadow-lg" style={{ ...position.style, borderColor: T.hairline }}>
            {loading ? (
              <p className="flex items-center gap-2 px-3 py-4 text-sm" style={{ color: T.ink2 }}><Loader2 size={14} className="animate-spin" /> Searching…</p>
            ) : fetchError ? (
              <div className="px-3 py-4 text-center">
                <p className="text-sm" style={{ color: T.rose }}>{fetchError}</p>
                <button onClick={() => setNonce((n) => n + 1)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium underline" style={{ color: T.accent }}>
                  <RotateCw size={12} /> Try again
                </button>
              </div>
            ) : belowMin ? (
              <p className="px-3 py-4 text-center text-sm" style={{ color: T.ink2 }}>Type at least {minChars} characters to search.</p>
            ) : items.length === 0 ? (
              <div className="px-3 py-4 text-center">
                <p className="text-sm" style={{ color: T.ink }}>{query ? `No match for “${query}”` : "Nothing to choose from"}</p>
                {query && <p className="mt-0.5 text-xs" style={{ color: T.ink2 }}>Check the spelling, or clear the search.</p>}
              </div>
            ) : (
              items.map((o, i) => {
                const v = getOptionValue(o); const on = selectedValues.has(v); const meta = getOptionMeta?.(o);
                return (
                  <div key={v} role="option" aria-selected={on} onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}
                    className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm" style={{ background: i === active ? T.muted : "transparent", color: T.ink }}>
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border" style={{ borderColor: on ? T.accent : T.hairline, background: on ? T.accent : "transparent" }}>
                      {on && <Check size={11} strokeWidth={3} color="#fff" />}
                    </span>
                    <span className="flex-1 truncate">{getOptionLabel(o)}</span>
                    {meta && <span className="text-xs tabular-nums" style={{ color: T.ink3 }}>{meta}</span>}
                  </div>
                );
              })
            )}
          </div>,
          document.body
        )}
      </div>
    </Field>
  );
}

/* Tabs -------------------------------------------------------------- */
function Tabs({ items, value, onChange, variant = "underline" }) {
  const refs = useRef({});
  const onKeyDown = (e) => {
    const enabled = items.filter((i) => !i.disabled);
    const i = enabled.findIndex((t) => t.id === value);
    let next;
    if (e.key === "ArrowRight") next = enabled[(i + 1) % enabled.length]?.id;
    else if (e.key === "ArrowLeft") next = enabled[(i - 1 + enabled.length) % enabled.length]?.id;
    else if (e.key === "Home") next = enabled[0]?.id;
    else if (e.key === "End") next = enabled[enabled.length - 1]?.id;
    if (!next) return;
    e.preventDefault(); onChange(next); refs.current[next]?.focus();
  };
  if (variant === "segmented") {
    return (
      <div role="tablist" onKeyDown={onKeyDown} className="inline-flex rounded-md border p-0.5" style={{ borderColor: T.hairline, background: T.muted }}>
        {items.map((it) => {
          const on = it.id === value;
          return (
            <button key={it.id} ref={(el) => (refs.current[it.id] = el)} role="tab" aria-selected={on} tabIndex={on ? 0 : -1}
              onClick={() => !it.disabled && onChange(it.id)} disabled={it.disabled}
              className="rounded px-3 py-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2"
              style={{ background: on ? T.surface : "transparent", color: on ? T.ink : T.ink2, boxShadow: on ? "0 1px 2px rgba(0,0,0,.06)" : "none", ...ring() }}>
              {it.label}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div role="tablist" onKeyDown={onKeyDown} className="flex items-end gap-1 overflow-x-auto border-b" style={{ borderColor: T.hairline }}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button key={it.id} ref={(el) => (refs.current[it.id] = el)} role="tab" aria-selected={on} tabIndex={on ? 0 : -1} disabled={it.disabled}
            onClick={() => !it.disabled && onChange(it.id)}
            className="relative flex h-10 shrink-0 items-center gap-2 px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2"
            style={{ color: on ? T.ink : T.ink2, ...ring() }}>
            {it.label}
            {it.count !== undefined && (
              <span className="rounded px-1.5 py-0.5 text-xs tabular-nums" style={{ background: on ? T.accentSoft : T.muted, color: it.urgent && !on ? T.amber : on ? T.accent : T.ink2, fontWeight: it.urgent ? 600 : 500 }}>
                {it.count.toLocaleString()}
              </span>
            )}
            {on && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full" style={{ background: T.accent }} />}
          </button>
        );
      })}
    </div>
  );
}

/* Calendar ------------------------------------------------------------ */
const DOW = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const sameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
const fmt = (d) => (d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "");
function monthCells(y, m) {
  const start = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells = Array(start).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}
function MonthGrid({ y, m, selected, rangeStart, rangeEnd, hover, onPick, onHover, min }) {
  const today = new Date(2026, 6, 30);
  const inRange = (d) => {
    const end = rangeEnd || hover;
    if (!rangeStart || !end || !d) return false;
    const [a, b] = rangeStart <= end ? [rangeStart, end] : [end, rangeStart];
    return d > a && d < b;
  };
  return (
    <div className="w-60">
      <div className="mb-2 grid grid-cols-7">{DOW.map((d, i) => <span key={i} className="text-center text-xs font-medium" style={{ color: T.ink3 }}>{d}</span>)}</div>
      <div className="grid grid-cols-7 gap-y-1">
        {monthCells(y, m).map((d, i) => {
          if (!d) return <span key={i} />;
          const off = min && d < min;
          const isStart = sameDay(d, rangeStart), isEnd = sameDay(d, rangeEnd);
          const on = sameDay(d, selected) || isStart || isEnd;
          const mid = inRange(d);
          return (
            <button key={i} disabled={off} onClick={() => onPick(d)} onMouseEnter={() => onHover && onHover(d)}
              className="relative mx-auto flex h-7 w-7 items-center justify-center text-sm tabular-nums transition-colors disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2"
              style={{ borderRadius: mid ? 0 : 6, background: on ? T.accent : mid ? T.accentSoft : "transparent", color: off ? T.ink3 : on ? "#fff" : T.ink,
                opacity: off ? 0.4 : 1, fontWeight: on ? 600 : 400, boxShadow: sameDay(d, today) && !on ? `inset 0 0 0 1px ${T.accent}` : "none", ...ring() }}>
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function DatePicker({ id, label, hint, value, onChange, min }) {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(new Date(2026, 6, 1));
  const anchorRef = useRef(null);
  const panelRef = useRef(null);
  const position = usePopoverPosition(anchorRef, open, { minWidth: 260, preferredHeight: 340 });
  const mounted = useMounted();
  useEffect(() => {
    const h = (e) => {
      if (!anchorRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const shift = (n) => setCur(new Date(cur.getFullYear(), cur.getMonth() + n, 1));
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <button ref={anchorRef} id={id} onClick={() => setOpen((o) => !o)} className={cx(controlBase, "flex h-9 items-center gap-2 px-3 text-left")} style={controlStyle()}>
        <CalIcon size={15} style={{ color: T.ink3 }} />
        <span className="tabular-nums" style={{ color: value ? T.ink : T.ink3 }}>{value ? fmt(value) : "Select a date"}</span>
      </button>
      {open && position && mounted && createPortal(
        <div ref={panelRef} className="z-40 overflow-auto rounded-lg border bg-white p-3 shadow-lg" style={{ ...position.style, borderColor: T.hairline }}>
          <div className="mb-3 flex items-center justify-between">
            <button onClick={() => shift(-1)} className="rounded p-1 hover:bg-slate-100" style={{ color: T.ink2 }}><ChevronLeft size={16} /></button>
            <span className="text-sm font-medium tabular-nums">{MONTHS[cur.getMonth()]} {cur.getFullYear()}</span>
            <button onClick={() => shift(1)} className="rounded p-1 hover:bg-slate-100" style={{ color: T.ink2 }}><ChevronRight size={16} /></button>
          </div>
          <MonthGrid y={cur.getFullYear()} m={cur.getMonth()} selected={value} min={min} onPick={(d) => { onChange(d); setOpen(false); }} />
        </div>,
        document.body
      )}
    </Field>
  );
}
const PRESETS = [
  ["Today", () => [new Date(2026, 6, 30), new Date(2026, 6, 30)]],
  ["Last 7 days", () => [new Date(2026, 6, 24), new Date(2026, 6, 30)]],
  ["This month", () => [new Date(2026, 6, 1), new Date(2026, 6, 30)]],
  ["Last month", () => [new Date(2026, 5, 1), new Date(2026, 5, 30)]],
  ["Quarter to date", () => [new Date(2026, 6, 1), new Date(2026, 6, 30)]],
  ["Year to date", () => [new Date(2026, 0, 1), new Date(2026, 6, 30)]],
];
function DateRangePicker({ id, label, hint, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(new Date(2026, 5, 1));
  const [start, setStart] = useState(value?.[0] || null);
  const [end, setEnd] = useState(value?.[1] || null);
  const [hover, setHover] = useState(null);
  const anchorRef = useRef(null);
  const panelRef = useRef(null);
  const position = usePopoverPosition(anchorRef, open, { minWidth: 620, preferredHeight: 420 });
  const mounted = useMounted();
  useEffect(() => {
    const h = (e) => {
      if (!anchorRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const pick = (d) => { if (!start || (start && end)) { setStart(d); setEnd(null); setHover(null); } else if (d < start) { setStart(d); setEnd(start); } else setEnd(d); };
  const shift = (n) => setCur(new Date(cur.getFullYear(), cur.getMonth() + n, 1));
  const nights = start && end ? Math.round((end - start) / 86400000) + 1 : null;
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <button ref={anchorRef} id={id} onClick={() => setOpen((o) => !o)} className={cx(controlBase, "flex h-9 items-center gap-2 px-3 text-left")} style={controlStyle()}>
        <CalIcon size={15} style={{ color: T.ink3 }} />
        <span className="tabular-nums" style={{ color: value ? T.ink : T.ink3 }}>{value ? `${fmt(value[0])} – ${fmt(value[1])}` : "Select a range"}</span>
      </button>
      {open && position && mounted && createPortal(
        <div ref={panelRef} className="z-40 flex overflow-auto rounded-lg border bg-white shadow-lg" style={{ ...position.style, borderColor: T.hairline }}>
          <div className="w-36 shrink-0 border-r py-2" style={{ borderColor: T.hairline }}>
            {PRESETS.map(([lbl, fn]) => (
              <button key={lbl} onClick={() => { const [a, b] = fn(); setStart(a); setEnd(b); setCur(new Date(a.getFullYear(), a.getMonth(), 1)); }}
                className="block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50" style={{ color: T.ink }}>{lbl}</button>
            ))}
          </div>
          <div className="p-3">
            <div className="mb-3 flex items-center justify-between">
              <button onClick={() => shift(-1)} className="rounded p-1 hover:bg-slate-100" style={{ color: T.ink2 }}><ChevronLeft size={16} /></button>
              <div className="flex gap-14 text-sm font-medium tabular-nums">
                <span>{MONTHS[cur.getMonth()]} {cur.getFullYear()}</span>
                <span>{MONTHS[(cur.getMonth() + 1) % 12]} {cur.getMonth() === 11 ? cur.getFullYear() + 1 : cur.getFullYear()}</span>
              </div>
              <button onClick={() => shift(1)} className="rounded p-1 hover:bg-slate-100" style={{ color: T.ink2 }}><ChevronRight size={16} /></button>
            </div>
            <div className="flex gap-5" onMouseLeave={() => setHover(null)}>
              <MonthGrid y={cur.getFullYear()} m={cur.getMonth()} rangeStart={start} rangeEnd={end} hover={hover} onPick={pick} onHover={setHover} />
              <MonthGrid y={cur.getMonth() === 11 ? cur.getFullYear() + 1 : cur.getFullYear()} m={(cur.getMonth() + 1) % 12} rangeStart={start} rangeEnd={end} hover={hover} onPick={pick} onHover={setHover} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: T.hairline }}>
              <span className="text-xs tabular-nums" style={{ color: T.ink2 }}>
                {start && end ? `${fmt(start)} – ${fmt(end)} · ${nights} days` : start ? `${fmt(start)} – select an end date` : "Select a start date"}
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => { setStart(null); setEnd(null); }}>Clear</Button>
                <Button size="sm" disabled={!start} onClick={() => { onChange([start, end || start]); setOpen(false); }}>Apply</Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Field>
  );
}

/* Toast --------------------------------------------------------------- */
const TOAST_TONE = {
  success: { icon: CircleCheck, fg: T.accent }, error: { icon: AlertTriangle, fg: T.rose },
  warning: { icon: AlertTriangle, fg: T.amber }, info: { icon: Info, fg: T.ink2 },
};
function Toast({ t, onClose }) {
  const [paused, setPaused] = useState(false);
  const [left, setLeft] = useState(100);
  const sticky = t.tone === "error" || t.sticky;
  useEffect(() => {
    if (sticky || paused) return;
    const id = setInterval(() => setLeft((v) => { if (v <= 0) { clearInterval(id); onClose(); return 0; } return v - 100 / (t.duration / 50); }), 50);
    return () => clearInterval(id);
  }, [paused, sticky]);
  const cfg = TOAST_TONE[t.tone]; const Icon = cfg.icon;
  return (
    <div role={t.tone === "error" ? "alert" : "status"} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      className="pointer-events-auto relative w-full overflow-hidden rounded-lg border bg-white shadow-lg sm:w-80" style={{ borderColor: T.hairline }}>
      <div className="flex gap-2.5 p-3">
        <Icon size={16} className="mt-0.5 shrink-0" style={{ color: cfg.fg }} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium" style={{ color: T.ink }}>{t.title}</p>
          {t.body && <p className="mt-0.5 text-xs leading-snug" style={{ color: T.ink2 }}>{t.body}</p>}
          {t.action && <button onClick={() => { t.action.run?.(); onClose(); }} className="mt-1.5 text-xs font-medium underline underline-offset-2" style={{ color: cfg.fg }}>{t.action.label}</button>}
        </div>
        <button onClick={onClose} aria-label="Dismiss" className="shrink-0 rounded p-0.5" style={{ color: T.ink3 }}><X size={14} /></button>
      </div>
      {!sticky && <span className="absolute bottom-0 left-0 h-0.5 transition-all" style={{ width: `${left}%`, background: cfg.fg, opacity: 0.5 }} />}
    </div>
  );
}
function useToasts() {
  const [list, setList] = useState([]);
  /* Append, not prepend. Combined with the responsive flex-direction
     on the host below, the newest toast always renders nearest its
     anchor point — top on mobile, bottom on desktop — and older ones
     get pushed away from it. Appending + a plain flex-col (the
     previous version) put the NEWEST farthest from a bottom anchor,
     which is backwards. */
  const push = useCallback((t) => setList((l) => [...l, { id: Date.now() + Math.random(), duration: 5000, tone: "info", ...t }].slice(-4)), []);
  const close = useCallback((id) => setList((l) => l.filter((x) => x.id !== id)), []);
  return { list, push, close };
}

/* HoldToConfirm + ConfirmDialog --------------------------------------- */
function HoldToConfirm({ label = "Hold to delete", duration = 1200, onConfirm, onKeyboardFallback, disabled }) {
  const [pct, setPct] = useState(0);
  const [hover, setHover] = useState(false);
  const timer = useRef(null);
  const start = useRef(0);
  const stop = () => { clearInterval(timer.current); timer.current = null; setPct(0); };
  const begin = () => {
    if (disabled || timer.current) return;
    start.current = Date.now();
    timer.current = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start.current) / duration) * 100);
      setPct(p);
      if (p >= 100) { stop(); onConfirm(); }
    }, 16);
  };
  useEffect(() => () => clearInterval(timer.current), []);
  return (
    <button disabled={disabled} onPointerDown={begin} onPointerUp={stop} onPointerLeave={() => { stop(); setHover(false); }} onPointerCancel={stop}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onKeyboardFallback(); } }}
      aria-label={`${label}. Press Enter for a confirmation dialog instead.`}
      className="relative inline-flex h-9 select-none items-center justify-center gap-1.5 overflow-hidden rounded-md px-3.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ background: hover && pct === 0 ? T.roseHover : T.rose, ...ring(T.rose), touchAction: "none" }}>
      {/* the sweep uses the SAME hover colour, so a hover-darken while
          idle never visually competes with the press-and-hold fill */}
      <span className="absolute inset-y-0 left-0 transition-none" style={{ width: `${pct}%`, background: T.roseHover }} />
      <span className="relative inline-flex items-center gap-1.5"><Trash2 size={15} />{pct > 0 ? "Keep holding…" : label}</span>
    </button>
  );
}
function ConfirmDialog({ open, tone = "default", title, body, consequences = [], confirmLabel, mode = "simple", typeToMatch, onConfirm, onCancel, loading }) {
  const [typed, setTyped] = useState("");
  useEffect(() => { if (!open) setTyped(""); }, [open]);
  if (!open) return null;
  const destructive = tone === "destructive";
  const blocked = mode === "type" && typed.trim() !== typeToMatch;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(21,23,28,.45)" }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="px-5 pb-4 pt-5">
          <h3 className="text-base font-semibold" style={{ color: T.ink }}>{title}</h3>
          {body && <p className="mt-1.5 text-sm leading-relaxed" style={{ color: T.ink2 }}>{body}</p>}
          {consequences.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {consequences.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm" style={{ color: T.ink2 }}>
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: destructive ? T.rose : T.ink3 }} /><span>{c}</span>
                </li>
              ))}
            </ul>
          )}
          {mode === "type" && (
            <label className="mt-4 block text-sm" style={{ color: T.ink2 }}>
              Type <span className="font-semibold" style={{ color: T.ink }}>{typeToMatch}</span> to confirm.
              <input value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus className={cx(controlBase, "mt-1.5 h-9 px-2.5")} style={controlStyle()} />
            </label>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t px-5 py-3" style={{ borderColor: T.hairline, background: T.bg }}>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          {mode === "hold" ? (
            <HoldToConfirm label={confirmLabel} onConfirm={onConfirm} onKeyboardFallback={onConfirm} />
          ) : (
            <Button variant={destructive ? "destructive" : "primary"} disabled={blocked} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DATA for the showcase
   ═══════════════════════════════════════════════════════════════ */
const ROLES = [
  { value: "owner", label: "Owner", meta: "1" }, { value: "controller", label: "Controller", meta: "4" },
  { value: "approver", label: "Approver", meta: "12" }, { value: "preparer", label: "Preparer", meta: "38" },
  { value: "auditor", label: "Auditor", meta: "3" }, { value: "viewer", label: "Viewer", meta: "126" },
];
const STAFF = [
  { id: "u1", name: "Amina Wanjiru", email: "amina.w@steward.co.ke" }, { id: "u2", name: "Brian Otieno", email: "b.otieno@steward.co.ke" },
  { id: "u3", name: "Dennis Ndung'u", email: "dennis@steward.co.ke" }, { id: "u4", name: "Faith Kamau", email: "faith.k@steward.co.ke" },
  { id: "u5", name: "Grace Mwende", email: "g.mwende@steward.co.ke" }, { id: "u6", name: "Hassan Ali", email: "h.ali@steward.co.ke" },
];
const searchStaff = fakeSearch(STAFF.map((s) => ({ value: s.id, label: s.name, meta: s.email })), 550);
const searchStaffFails = fakeSearch(STAFF.map((s) => ({ value: s.id, label: s.name, meta: s.email })), 500, true);

/* ═══════════════════════════════════════════════════════════════
   SHOWCASE
   ═══════════════════════════════════════════════════════════════ */
export default function UIKitShowcase() {
  const [tab, setTab] = useState("active");
  const [seg, setSeg] = useState("month");
  const [text, setText] = useState("");
  const [note, setNote] = useState("Reassigned from the Nairobi branch after the Q2 review.");
  const [role, setRole] = useState(null);
  const [multi, setMulti] = useState([ROLES[2]]);
  const [staff, setStaff] = useState(null);
  const [staffRetry, setStaffRetry] = useState(null);
  const [date, setDate] = useState(new Date(2026, 6, 30));
  const [range, setRange] = useState([new Date(2026, 6, 1), new Date(2026, 6, 30)]);
  const [dialog, setDialog] = useState(null);
  const [busy, setBusy] = useState(false);
  const { list, push, close } = useToasts();
  const [limit, setLimit] = useState(150000);
  const [adjustment, setAdjustment] = useState(null);
  const [frameW, setFrameW] = useState("desktop");
  const toastsMounted = useMounted();

  return (
    <Page>
      {/* sticky section nav */}
      <div className="sticky top-0 z-40 border-b" style={{ background: "rgba(251,251,252,.9)", backdropFilter: "blur(6px)", borderColor: T.hairline }}>
        <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-6 py-2 sm:px-10">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded px-2.5 py-1 text-xs font-medium" style={{ color: T.ink2 }}>{label}</a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-10 px-6 py-10 sm:px-10">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: T.ink3 }}>Steward · component library</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">UI kit</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: T.ink2 }}>
            Presentation copy of <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px]">src/components/ui/*.tsx</code>.
            Every control shares one <strong>Field</strong> wrapper, one focus ring, one type scale. The real files are the source of
            truth — this page exists so a review doesn't require reading eleven files to see what changed.
          </p>
        </header>

        {/* BUTTON */}
        <Section id="button" kicker="01" title="Button" note="One primary per region — a second primary means neither is primary. Loading keeps the label and the width, so nothing beside it shifts when a request starts. Hover on every variant is real interaction state now, not a static colour — try it below.">
          <Demo label="Variants — hover each one" spec="primary · secondary · ghost · destructive · link">
            <Button>Save changes</Button><Button variant="secondary">Cancel</Button><Button variant="ghost">Skip</Button>
            <Button variant="destructive">Suspend</Button><Button variant="link">View audit trail</Button>
          </Demo>
          <Demo label="Sizes" spec="h-8 / h-9 / h-10 — matches Input, Select, date triggers">
            <Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button>
          </Demo>
          <Demo label="Loading">
            <Button loading>Save changes</Button><Button variant="destructive" loading>Suspend</Button>
          </Demo>
          <Demo label="Disabled — plain" spec="One canonical muted look, substituted for the variant — not a faded version of it">
            <Button disabled>Save changes</Button>
            <Button variant="destructive" disabled>Suspend</Button>
            <Button variant="secondary" disabled>Export</Button>
          </Demo>
          <Demo label="Disabled — hover or focus for the reason" spec="aria-disabled, not disabled — see callout">
            <Button disabled disabledReason="Requires Owner or Controller role">Suspend access</Button>
            <Button disabled disabledReason="You can't suspend your own account">Suspend Dennis</Button>
            <Button variant="secondary" disabled disabledReason="Approval limit must be set before this role can be assigned">Assign role</Button>
          </Demo>
          <Callout tone="fix">
            A native <code>disabled</code> attribute stops a button receiving pointer AND focus events in every major
            browser — so a tooltip meant to explain the disabling can never fire on it. These three use{" "}
            <code>aria-disabled</code> instead: still unclickable (the handler checks and bails), still keyboard-focusable,
            still hoverable — which is the only way the reason is reachable at all. Plain disabled buttons above have no
            reason to give, so they keep the simpler native attribute. The reason tooltip also flips above the button
            near the bottom of the viewport, same mechanism as the calendar and combobox above.
          </Callout>
        </Section>

        {/* FIELD */}
        <Section id="field" kicker="02" title="Field" note="The wrapper every control below shares — label, hint, error, counter. Extracted because label/error handling used to live inside Input only, so a Select couldn't be labelled the same way and the two drifted.">
          <Callout tone="fix">Error REPLACES hint in a reserved message line. Stacking both makes the field grow ~18px the moment validation fires, shifting the whole form below it.</Callout>
        </Section>

        {/* INPUT */}
        <Section id="input" kicker="03" title="Input" note="Amount fields are right-aligned and tabular — a column of figures that doesn't align vertically can't be scanned. Read-only and disabled are visually distinct: read-only is data you're allowed to see, disabled is a control that isn't available yet.">
          <Demo label="Standard">
            <Input label="Full name" placeholder="Amina Wanjiru" hint="As it appears on their ID" value={text} onChange={(e) => setText(e.target.value)} />
          </Demo>
          <Demo label="Error state">
            <Input label="Work email" required placeholder="name@steward.co.ke" error="This address is already registered" />
          </Demo>
          <Demo label="Prefix / numeric — money">
            <Input label="Approval limit" numeric prefix="KES" placeholder="0.00" hint="Per transaction" />
          </Demo>
          <Demo label="Password — reveal toggle">
            <Input label="Password" type="password" placeholder="••••••••" hint="12 characters minimum" />
          </Demo>
          <Demo label="Read-only vs disabled">
            <Input label="Employee number" value="EMP-004182" readOnly hint="Synced from HR — read only" />
            <Input label="Cost centre" disabled placeholder="Select a branch first" hint="Unavailable until a branch is chosen" />
          </Demo>
        </Section>

        {/* MONEY INPUT */}
        <Section id="money" kicker="04" title="MoneyInput" note="Grouped display (1,234.50) while blurred, raw digits while focused — editing a plain number needs no cursor-position math, and the comma only needs to exist once you're done typing. Clamping to min/max happens on blur too, so overshooting mid-type doesn't yank the value back while you're still entering it.">
          <Demo label="Standard" spec="KES prefix · 2 decimals · thousand separator">
            <MoneyInput id="lim" label="Approval limit" currency="KES" value={limit} onChange={setLimit} max={5000000} hint="Per transaction, this role" />
          </Demo>
          <Demo label="Allows negative — adjustments" spec="allowNegative, no currency prefix">
            <MoneyInput id="adj" label="Balance adjustment" allowNegative value={adjustment} onChange={setAdjustment} hint="Positive to credit, negative to debit" />
          </Demo>
          <Callout tone="note">Try typing “1234.5”, then click away — it becomes 1,234.50. Click back in and it reverts to plain digits for editing. That focus/blur split is the whole trick; no keystroke-by-keystroke cursor math anywhere.</Callout>
        </Section>

        {/* TEXTAREA */}
        <Section id="textarea" kicker="05" title="Textarea" note="Auto-grows to 220px then scrolls. The counter turns rose at 90% of the limit — it should warn before it blocks, not at the moment it blocks.">
          <Demo label="With counter, near the limit">
            <Textarea label="Reason for change" required maxLength={280} value={note} onChange={(e) => setNote(e.target.value)} hint="Recorded in the audit trail" />
          </Demo>
        </Section>

        {/* SEARCHCOMBOBOX */}
        <Section id="combobox" kicker="06" title="SearchCombobox" note="Generic over the item type via getOptionValue / getOptionLabel — identity by value, not by object reference, which is what made the previous version's selected-tick unreliable. options (static) and onSearch (async) are separate props, never a magic 'local' string switch.">
          <Demo label="Static options — single" spec="ROLES array, client-filtered">
            <SearchCombobox label="Role" options={ROLES} value={role} onChange={setRole} hint="Determines approval authority" />
          </Demo>
          <Demo label="Static options — multiple" spec="Backspace on empty query removes the last chip">
            <SearchCombobox label="Notify on approval" options={ROLES} value={multi} onChange={setMulti} multiple hint="Any number of roles" />
          </Demo>
          <Demo label="Async — server search" spec="≥2 chars · 300ms debounce · simulated 550ms latency">
            <SearchCombobox label="Approver" placeholder="Search staff…" minChars={2} onSearch={searchStaff} value={staff} onChange={setStaff}
              getOptionValue={(o) => o.value} getOptionLabel={(o) => o.label} getOptionMeta={(o) => o.meta} hint="Search matches name or email — server-side" />
          </Demo>
          <Demo label="Async — failure + retry" spec="First request always fails, for demonstration">
            <SearchCombobox label="Approver (will fail once)" placeholder="Type ‘a’, then wait…" minChars={1} onSearch={searchStaffFails} value={staffRetry} onChange={setStaffRetry} hint="Shows the error branch — Try again re-fires the request" />
          </Demo>
          <Callout tone="watch">The failure branch is intentional here so you can see it without waiting for a real outage. In the real component this is what a 401 or a dropped connection renders — not a silent empty list.</Callout>
          <Callout tone="fix">The listbox flips above the field when there isn't room below, same mechanism as the calendar. Try opening the Role combobox after scrolling near the bottom of the page.</Callout>
        </Section>

        {/* TABS */}
        <Section id="tabs" kicker="07" title="Tabs" note="Underline = views of one collection. Segmented = mutually exclusive modes. They look interchangeable and are not — using the wrong one misstates the relationship between the options. Both are keyboard-navigable: focus a tab, use ← → Home End.">
          <Demo label="Underline — statuses of one collection">
            <div className="w-full">
              <Tabs value={tab} onChange={setTab} items={[
                { id: "active", label: "Active", count: 1284 }, { id: "pending", label: "Pending", count: 12, urgent: true },
                { id: "suspended", label: "Suspended", count: 3, urgent: true }, { id: "archived", label: "Archived", count: 0, disabled: true },
                { id: "all", label: "All", count: 1345 },
              ]} />
            </div>
          </Demo>
          <Demo label="Segmented — mutually exclusive modes">
            <Tabs variant="segmented" value={seg} onChange={setSeg} items={[
              { id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "quarter", label: "Quarter" },
            ]} />
          </Demo>
        </Section>

        {/* CALENDAR */}
        <Section id="calendar" kicker="08" title="Calendar" note="Today is outlined, never filled — filled means selected, and conflating the two is the classic date-picker bug where the calendar looks pre-populated on open. Range presets carry most of the traffic in a financial product; the two-month grid is the fallback path, not the primary one.">
          <Demo label="Single date">
            <DatePicker label="Effective date" value={date} onChange={setDate} min={new Date(2026, 0, 1)} hint="Cannot precede the current financial year" />
          </Demo>
          <Demo label="Range — presets + two-month grid" spec="Nothing applies until Apply — a half-picked range can't fire a query">
            <DateRangePicker label="Reporting period" value={range} onChange={setRange} hint="Presets follow the financial calendar" />
          </Demo>
          <Callout tone="fix">Both pickers now flip to open upward when there isn't room below — scroll this page near the bottom and open either one to see it. They're also portalled to the document body, same as SearchCombobox, so an ancestor with <code>overflow: hidden</code> (a table cell, a card) can't clip them either — previously the calendar wasn't portalled at all, only bound by its own parent's stacking context.</Callout>
        </Section>

        {/* TOAST */}
        <Section id="toast" kicker="09" title="Toast" note="Position is responsive, not the same corner scaled down — bottom-right on desktop, top on mobile. Auto-dismiss pauses on hover AND on focus-within, so a toast carrying an Undo can't expire while a keyboard user is tabbing toward it. Errors never auto-dismiss.">
          <Demo label="Fire one of each" spec="Watch the bottom-right of the whole page">
            <Button variant="secondary" onClick={() => push({ tone: "success", title: "Role updated", body: "Brian Otieno is now an Approver.", action: { label: "Undo" } })}>Success + Undo</Button>
            <Button variant="secondary" onClick={() => push({ tone: "error", title: "Couldn't suspend Faith Kamau", body: "The request failed. Nothing was changed. Ref 7f3a9c21." })}>Error (sticky)</Button>
            <Button variant="secondary" onClick={() => push({ tone: "warning", title: "3 of 12 skipped", body: "Already suspended, or your own account." })}>Warning</Button>
            <Button variant="secondary" onClick={() => push({ tone: "info", title: "Export queued", body: "1,284 rows. We'll email you when it's ready." })}>Info</Button>
          </Demo>

          {/* Static comparison — this artifact's own viewport width won't
              reliably cross the sm: breakpoint, so this shows the two
              layouts side by side rather than asking you to resize a
              window to see the difference. */}
          <Demo label="Why the position changes" spec="Toggle to compare">
            <div className="w-full">
              <div className="mb-3 inline-flex rounded-md border p-0.5" style={{ borderColor: T.hairline, background: T.muted }}>
                {[["desktop", "Desktop ≥ 640px"], ["mobile", "Mobile < 640px"]].map(([id, lbl]) => (
                  <button key={id} onClick={() => setFrameW(id)}
                    className="rounded px-3 py-1 text-sm font-medium"
                    style={{ background: frameW === id ? T.surface : "transparent", color: frameW === id ? T.ink : T.ink2, boxShadow: frameW === id ? "0 1px 2px rgba(0,0,0,.06)" : "none" }}>
                    {lbl}
                  </button>
                ))}
              </div>

              {frameW === "desktop" ? (
                <div className="relative mx-auto h-56 w-full max-w-md overflow-hidden rounded-lg border" style={{ borderColor: T.hairline, background: T.bg }}>
                  <div className="flex h-8 items-center gap-1.5 border-b px-3" style={{ borderColor: T.hairline, background: T.surface }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: T.hairline }} /><span className="h-2 w-2 rounded-full" style={{ background: T.hairline }} /><span className="h-2 w-2 rounded-full" style={{ background: T.hairline }} />
                  </div>
                  <div className="absolute bottom-3 right-3 w-40 rounded-md border bg-white p-2 shadow-lg" style={{ borderColor: T.hairline }}>
                    <p className="text-[11px] font-medium" style={{ color: T.ink }}>Role updated</p>
                    <p className="text-[10px]" style={{ color: T.ink2 }}>Doesn't cover content, aligns with the notification corner people already check.</p>
                  </div>
                </div>
              ) : (
                <div className="relative mx-auto h-64 w-40 overflow-hidden rounded-2xl border-4" style={{ borderColor: T.ink, background: T.bg }}>
                  <div className="absolute inset-x-0 top-3 mx-3 rounded-md border bg-white p-2 shadow-lg" style={{ borderColor: T.hairline }}>
                    <p className="text-[10px] font-medium" style={{ color: T.ink }}>Role updated</p>
                    <p className="text-[9px] leading-tight" style={{ color: T.ink2 }}>Top, clear of the keyboard.</p>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-24 border-t-2" style={{ borderColor: T.ink3, background: T.muted }}>
                    <p className="pt-2 text-center text-[9px] font-medium" style={{ color: T.ink3 }}>on-screen keyboard</p>
                  </div>
                </div>
              )}
              <p className="mt-3 max-w-md text-xs leading-relaxed" style={{ color: T.ink2 }}>
                {frameW === "desktop"
                  ? "Bottom-right is the convention — Gmail, Slack, most SaaS admin tools. It doesn't compete with primary content or the nav."
                  : "A toast usually fires right after a form submit — exactly when the keyboard is covering the bottom third of the screen. Bottom-anchored is invisible at the moment it matters most; top sidesteps the problem structurally."}
              </p>
            </div>
          </Demo>
        </Section>

        {/* CONFIRM + HOLD */}
        <Section id="confirm" kicker="10" title="Confirm dialog & hold-to-delete" note="The dialog title states the OUTCOME and the confirm button repeats it — never 'Are you sure?' / 'Confirm'. Friction scales with blast radius: simple under 10 affected, type-to-confirm at 200+. Hold-to-delete is a variant for reversible, low-consequence, high-frequency deletes only — never the default for anything irreversible, since a progress bar has nowhere to state consequences.">
          <Demo label="Dialog modes">
            <Button variant="secondary" onClick={() => setDialog("simple")}>Simple · low stakes</Button>
            <Button variant="secondary" onClick={() => setDialog("consequences")}>With consequences</Button>
            <Button variant="secondary" onClick={() => setDialog("type")}>Type to confirm · 200+</Button>
            <Button variant="secondary" onClick={() => setDialog("hold")}>Hold to delete (dialog demo)</Button>
          </Demo>
          <Demo label="Inline hold — no dialog" spec="1.2s · Enter/Space opens a dialog instead — never keyboard-inaccessible">
            <HoldToConfirm onConfirm={() => push({ tone: "success", title: "Draft line removed", action: { label: "Undo" } })} onKeyboardFallback={() => setDialog("hold")} />
          </Demo>
        </Section>

        {/* TOKENS */}
        <Section id="tokens" kicker="11" title="Tokens" note="Three text levels, not two — --text / --muted / --subtle. Two levels forces secondary text and placeholder text to share a value, and a placeholder needs to read as 'not filled in yet', which a shared value can't do.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["--bg", T.bg], ["--surface", T.surface], ["--border / hairline", T.hairline], ["--muted-bg", T.muted],
              ["--text (ink)", T.ink], ["--muted (ink2)", T.ink2], ["--subtle (ink3)", T.ink3],
              ["--primary", T.accent], ["--primary-hover", T.accentHover], ["--primary-soft", T.accentSoft],
              ["--danger", T.rose], ["--danger-hover", T.roseHover], ["--danger-soft", T.roseSoft],
              ["--warning", T.amber], ["--warning-soft", T.amberSoft],
            ].map(([n, c]) => (
              <div key={n} className="flex items-center gap-3 rounded-lg border p-3" style={{ borderColor: T.hairline, background: T.surface }}>
                <span className="h-8 w-8 shrink-0 rounded-md border" style={{ background: c, borderColor: T.hairline }} />
                <div className="min-w-0">
                  <p className="truncate font-mono text-[11px]" style={{ color: T.ink }}>{n}</p>
                  <p className="font-mono text-[10px] uppercase" style={{ color: T.ink3 }}>{c}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <p className="border-t pb-6 pt-8 text-xs" style={{ borderColor: T.hairline, color: T.ink3 }}>
          Real source: Field · Button · Input · Textarea · SearchCombobox · Tabs (+TabsContent) · Calendar / DatePicker / DateRangePicker ·
          ToastProvider / useToast · ConfirmDialog · HoldToConfirm — in src/components/ui/, exported from index.ts.
        </p>
      </div>

      {/* Responsive: top + full-width on mobile (where a toast fires
          right after a form submit, exactly when the on-screen
          keyboard covers the bottom third of the screen), bottom-right
          + fixed width on desktop. Direction flips so the newest toast
          is always nearest its anchor — see useToasts above. */}
      {toastsMounted && createPortal(
        <div className="pointer-events-none fixed z-50 flex gap-2 inset-x-4 top-4 flex-col-reverse sm:inset-x-auto sm:top-auto sm:bottom-4 sm:right-4 sm:flex-col sm:items-end">
          {list.map((t) => <Toast key={t.id} t={t} onClose={() => close(t.id)} />)}
        </div>,
        document.body
      )}

      <ConfirmDialog open={dialog === "simple"} title="Discard unsaved changes?" body="Your edits to this user's profile will be lost." confirmLabel="Discard"
        onCancel={() => setDialog(null)} onConfirm={() => { setDialog(null); push({ tone: "info", title: "Changes discarded" }); }} />
      <ConfirmDialog open={dialog === "consequences"} tone="destructive" title="Suspend Faith Kamau?"
        consequences={["She loses access immediately and is signed out of all sessions.", "2 pending approvals return to their originators.", "Reversible from the Deactivated tab."]}
        confirmLabel="Suspend access" loading={busy} onCancel={() => setDialog(null)}
        onConfirm={() => { setBusy(true); setTimeout(() => { setBusy(false); setDialog(null); push({ tone: "success", title: "Faith Kamau suspended", action: { label: "Undo" } }); }, 900); }} />
      <ConfirmDialog open={dialog === "type"} tone="destructive" title="Suspend 1,281 users?" body="This affects more than 200 accounts, so it needs an explicit confirmation."
        consequences={["Writes 1,281 audit entries under one batch reference.", "3 skipped — 1 is your account, 2 already suspended."]}
        mode="type" typeToMatch="1281" confirmLabel="Suspend 1,281" onCancel={() => setDialog(null)}
        onConfirm={() => { setDialog(null); push({ tone: "warning", title: "Finished with errors", body: "1,262 succeeded · 19 failed." }); }} />
      <ConfirmDialog open={dialog === "hold"} tone="destructive" title="Delete this draft journal entry?" body="It hasn't been posted, so nothing downstream is affected."
        mode="hold" confirmLabel="Hold to delete" onCancel={() => setDialog(null)}
        onConfirm={() => { setDialog(null); push({ tone: "success", title: "Draft deleted", action: { label: "Undo" } }); }} />
    </Page>
  );
}
