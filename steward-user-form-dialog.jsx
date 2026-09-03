import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  X, ChevronDown, Check, ChevronsUpDown, AlertTriangle, Loader2,
  CircleCheck, Info, Plus, Pencil,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   STEWARD — Add / Edit user dialog
   Continuation of the admin users wireframe: this is what opens when
   the header's "Add user" button or a row's "Edit profile" kebab
   item is clicked. Same tokens, same Field/Input/Button idiom as
   that file and the UI kit showcase — kept self-contained per
   artifact rather than importing across files.
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


/* Flip-on-edge popover positioning — same hook as the UI kit showcase.
   Only SearchCombobox needs it here; the dialog itself is always
   centered, so it doesn't. */
function usePopoverPosition(anchorRef, open, options = {}) {
  const { align = "start", gap = 4, viewportPadding = 8, preferredHeight = 240, matchWidth = false, minWidth } = options;
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
        left, width: matchWidth ? rect.width : undefined, minWidth: !matchWidth ? minWidth : undefined, maxHeight,
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

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════════════════════════ */

function Field({ label, hint, error, required, htmlFor, children }) {
  const message = error || hint;
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="flex items-center gap-1 text-[13px] font-medium" style={{ color: T.ink }}>
          {label}{required && <span style={{ color: T.rose }}>*</span>}
        </label>
      )}
      {children}
      <p className="text-xs leading-snug" style={{ color: error ? T.rose : T.ink2 }}>{message || "\u00A0"}</p>
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

const BTN_SIZE = { sm: "h-8 px-2.5 text-sm gap-1.5", md: "h-9 px-3.5 text-sm gap-1.5" };
const BTN_PALETTE = {
  primary: { bg: T.accent, bgHover: T.accentHover, fg: "#fff", border: "transparent" },
  secondary: { bg: T.surface, bgHover: T.muted, fg: T.ink, border: T.hairline },
};
const BTN_DISABLED = { bg: T.muted, fg: T.ink3, border: T.hairline };
function Button({ variant = "primary", size = "md", loading, disabled, icon: Icon, children, onClick, type = "button" }) {
  const [hover, setHover] = useState(false);
  const isDisabled = Boolean(disabled) && !loading;
  const p = isDisabled ? BTN_DISABLED : BTN_PALETTE[variant];
  const bg = isDisabled ? p.bg : hover ? p.bgHover : p.bg;
  return (
    <button type={type} onClick={onClick} disabled={isDisabled || loading}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={cx("relative inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", isDisabled && "cursor-not-allowed", BTN_SIZE[size])}
      style={{ background: bg, color: p.fg, border: `1px solid ${p.border}`, ...ring() }}>
      {loading && <Loader2 size={14} className="absolute animate-spin" />}
      <span className="inline-flex items-center gap-1.5" style={{ opacity: loading ? 0 : 1 }}>
        {Icon && <Icon size={15} strokeWidth={2.2} />}{children}
      </span>
    </button>
  );
}

function Input({ label, hint, error, required, readOnly, type = "text", value, onChange, onBlur, id }) {
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <input id={id} type={type} value={value} onChange={onChange} onBlur={onBlur} readOnly={readOnly}
        aria-invalid={Boolean(error)}
        className={cx(controlBase, "h-9 px-3")}
        style={{ ...controlStyle(error), background: readOnly ? T.muted : controlStyle(error).background, color: readOnly ? T.ink2 : controlStyle(error).color }} />
    </Field>
  );
}

function Select({ id, label, hint, error, required, value, onChange, onBlur, options, placeholder }) {
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <div className="relative">
        <select id={id} value={value} onChange={onChange} onBlur={onBlur}
          className={cx(controlBase, "h-9 appearance-none px-3 pr-8")} style={controlStyle(error)}>
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: T.ink3 }} />
      </div>
    </Field>
  );
}

function Textarea({ id, label, hint, value, onChange, rows = 2, placeholder }) {
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <textarea id={id} rows={rows} value={value} onChange={onChange} placeholder={placeholder}
        className={cx(controlBase, "resize-none px-3 py-2 leading-relaxed")} style={controlStyle()} />
    </Field>
  );
}

function MoneyInput({ id, label, hint, error, value, onChange, currency }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const format = (n) => (n === null || Number.isNaN(n) ? "" : n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const sanitize = (raw) => {
    let s = raw.replace(/[^0-9.]/g, "");
    const dot = s.indexOf(".");
    if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "").slice(0, 2);
    return s;
  };
  const toNumber = (s) => (s === "" || s === "." ? null : Number.isFinite(Number(s)) ? Number(s) : null);
  const display = editing ? draft : format(value);
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <div className="relative flex items-center">
        {currency && <span className="pointer-events-none absolute left-3 text-sm" style={{ color: T.ink3 }}>{currency}</span>}
        <input id={id} inputMode="decimal" value={display}
          onFocus={() => { setEditing(true); setDraft(value === null ? "" : String(value)); }}
          onChange={(e) => { const c = sanitize(e.target.value); setDraft(c); onChange(toNumber(c)); }}
          onBlur={() => setEditing(false)}
          className={cx(controlBase, "h-9 tabular-nums text-right pr-3", currency ? "pl-12" : "pl-3")}
          style={controlStyle(error)} />
      </div>
    </Field>
  );
}

/* Static-list combobox — for a long fixed list (staff directory) that
   benefits from search but doesn't need to hit the network. Role and
   Branch below use plain <select> instead: 5-6 options is exactly the
   case a select handles better than a combobox. */
function SearchCombobox({ id, label, hint, options, value, onChange, placeholder = "Search…" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef(null);
  const position = usePopoverPosition(boxRef, open, { matchWidth: true, preferredHeight: 200 });
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return !q ? options : options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);
  useEffect(() => {
    const h = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) { setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const pick = (o) => { onChange(o); setOpen(false); setQuery(""); };
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div ref={boxRef} className="relative">
        <div onClick={() => setOpen(true)} className={cx(controlBase, "flex h-9 items-center gap-1 px-2")} style={controlStyle()}>
          {value && !query && <span className="pointer-events-none absolute left-3 truncate text-sm" style={{ color: T.ink }}>{value.label}</span>}
          <input id={id} value={query} placeholder={value ? "" : placeholder}
            onFocus={() => setOpen(true)} onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            className="min-w-16 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none" style={{ color: T.ink }} />
          <span className="ml-auto flex items-center gap-1">
            {value && <button onClick={(e) => { e.stopPropagation(); onChange(null); }} aria-label="Clear" className="rounded p-0.5" style={{ color: T.ink3 }}><X size={14} /></button>}
            <ChevronsUpDown size={14} style={{ color: T.ink3 }} />
          </span>
        </div>
        {open && position && (
          <div className="z-[60] overflow-auto rounded-md border bg-white py-1 shadow-lg" style={{ ...position.style, borderColor: T.hairline }}>
            {items.length === 0 ? (
              <p className="px-3 py-3 text-center text-sm" style={{ color: T.ink2 }}>No match for "{query}"</p>
            ) : items.map((o) => (
              <button key={o.value} onClick={() => pick(o)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-slate-50" style={{ color: T.ink }}>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border" style={{ borderColor: value?.value === o.value ? T.accent : T.hairline, background: value?.value === o.value ? T.accent : "transparent" }}>
                  {value?.value === o.value && <Check size={11} strokeWidth={3} color="#fff" />}
                </span>
                <span className="flex-1 truncate">{o.label}</span>
                {o.meta && <span className="text-xs" style={{ color: T.ink3 }}>{o.meta}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  );
}

function Switch({ checked, onChange, id }) {
  return (
    <button type="button" id={id} role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2"
      style={{ background: checked ? T.accent : T.hairline, ...ring() }}>
      <span className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }} />
    </button>
  );
}

/* Small, non-destructive-toned confirm — reused for the discard-changes
   guard. Same copy already established in the UI kit showcase's confirm
   demo, kept consistent rather than re-invented. */
function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: "rgba(21,23,28,.45)" }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="px-5 pb-4 pt-5">
          <h3 className="text-base font-semibold" style={{ color: T.ink }}>{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: T.ink2 }}>{body}</p>
        </div>
        <div className="flex items-center justify-end gap-2 border-t px-5 py-3" style={{ borderColor: T.hairline, background: T.bg }}>
          <Button variant="secondary" onClick={onCancel}>Keep editing</Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

/* Toast — minimal, just enough to confirm a save landed. */
const TOAST_ICON = { success: CircleCheck, info: Info };
function useToasts() {
  const [list, setList] = useState([]);
  const push = useCallback((t) => setList((l) => [...l, { id: Date.now() + Math.random(), ...t }].slice(-3)), []);
  const close = useCallback((id) => setList((l) => l.filter((x) => x.id !== id)), []);
  return { list, push, close };
}
function ToastHost({ list, close }) {
  useEffect(() => {
    const timers = list.map((t) => setTimeout(() => close(t.id), 4000));
    return () => timers.forEach(clearTimeout);
  }, [list]);
  return (
    <div className="pointer-events-none fixed z-[80] flex flex-col gap-2 inset-x-4 top-4 sm:inset-x-auto sm:top-auto sm:bottom-4 sm:right-4">
      {list.map((t) => {
        const Icon = TOAST_ICON[t.tone] || Info;
        return (
          <div key={t.id} className="pointer-events-auto flex w-full items-start gap-2.5 rounded-lg border bg-white p-3 shadow-lg sm:w-80" style={{ borderColor: T.hairline }}>
            <Icon size={16} className="mt-0.5 shrink-0" style={{ color: t.tone === "success" ? T.accent : T.ink2 }} />
            <p className="text-sm font-medium" style={{ color: T.ink }}>{t.title}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DIALOG SHELL — shadcn-Dialog-inspired
   ═══════════════════════════════════════════════════════════════ */

/* Trap Tab within the dialog, focus the first control on open, and
   restore focus to whatever was focused before it opened — the part
   of modal accessibility that's invisible when done right and
   immediately obvious (focus lost to <body>) when skipped. */
function useFocusTrap(open, containerRef) {
  const restoreRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement;
    const focusable = () =>
      containerRef.current?.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const t = setTimeout(() => focusable()?.[0]?.focus(), 0);
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const items = Array.from(focusable() || []);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      restoreRef.current?.focus?.();
    };
  }, [open]);
}

const DIALOG_SIZE = { md: "max-w-md", lg: "max-w-xl", xl: "max-w-2xl" };

/**
 * `onClose` means "the user asked to close" — via X, Escape, or a
 * backdrop click. It does NOT mean "actually close": the caller
 * decides what that means (close immediately if the form is clean,
 * show a discard-changes confirm if it's dirty). This is the same
 * separation Radix's Dialog makes with onOpenChange, kept here
 * because collapsing "asked to close" and "did close" into one event
 * is what makes an unsaved-changes guard hard to bolt on later.
 *
 * `suspendKeys` mutes Escape/backdrop while true — used both while
 * submitting (there's nothing meaningful to cancel once a write is
 * in flight; closing the dialog doesn't un-send the request) and
 * while the nested discard-confirm is open (so one Escape press
 * doesn't fall through and dismiss both layers at once).
 */
function DialogShell({ open, onClose, size = "lg", suspendKeys, children }) {
  const panelRef = useRef(null);
  useFocusTrap(open, panelRef);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && !suspendKeys) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, suspendKeys, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(21,23,28,.45)" }}
      onClick={() => !suspendKeys && onClose()}>
      <div ref={panelRef} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
        className={cx("relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-lg bg-white shadow-xl", DIALOG_SIZE[size])}>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ title, description, onClose, closeDisabled }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4" style={{ borderColor: T.hairline }}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold" style={{ color: T.ink }}>{title}</h2>
        {description && <p className="mt-0.5 text-sm" style={{ color: T.ink2 }}>{description}</p>}
      </div>
      <button type="button" onClick={onClose} disabled={closeDisabled} aria-label="Close"
        className="shrink-0 rounded-md p-1 focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ color: T.ink3, ...ring() }}>
        <X size={18} />
      </button>
    </div>
  );
}
/* Body scrolls; header and footer don't — same instinct as the
   pagination bar staying reachable at the bottom of a long table
   instead of scrolling away with it. */
function DialogBody({ children }) { return <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>; }
function DialogFooter({ children }) {
  return <div className="flex shrink-0 items-center justify-end gap-2 border-t px-5 py-3" style={{ borderColor: T.hairline, background: T.bg }}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════════
   USER FORM DIALOG
   ═══════════════════════════════════════════════════════════════ */

const ROLE_OPTIONS = [
  { value: "Owner", label: "Owner" },
  { value: "Controller", label: "Controller" },
  { value: "Approver", label: "Approver" },
  { value: "Preparer", label: "Preparer" },
  { value: "Auditor", label: "Auditor" },
];
// Only these roles carry per-transaction authority — the field that
// needs a limit is a property of the ROLE, not something every user
// has. Showing it unconditionally would ask "approval limit?" of a
// Preparer who will never approve anything.
const ROLES_NEEDING_LIMIT = new Set(["Approver", "Controller"]);

const BRANCH_OPTIONS = [
  { value: "nairobi-hq", label: "Nairobi HQ" },
  { value: "mombasa", label: "Mombasa" },
  { value: "kisumu", label: "Kisumu" },
  { value: "nakuru", label: "Nakuru" },
];

const STAFF_DIRECTORY = [
  { value: "u1", label: "Amina Wanjiru", meta: "Controller" },
  { value: "u2", label: "Brian Otieno", meta: "Approver" },
  { value: "u3", label: "Dennis Ndung'u", meta: "Owner" },
  { value: "u5", label: "Grace Mwende", meta: "Auditor" },
];

function emptyForm() {
  return { name: "", email: "", role: "", branch: "", reportsTo: null, approvalLimit: null, mfaRequired: true, reason: "" };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Simulated network call. Rejects with either `fieldErrors` (mapped
   straight onto the form, the same shape as the table contract's
   ApiError.errors[]) or a plain message (a generic banner) — the two
   failure shapes a real submit handler actually needs to tell apart. */
function fakeSave(values, { emailTaken, serverError, slow } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (emailTaken) {
        reject(Object.assign(new Error("Validation failed"), {
          fieldErrors: { email: "This address is already registered" },
        }));
      } else if (serverError) {
        reject(new Error("Couldn't reach the server. Check your connection and try again."));
      } else {
        resolve(values);
      }
    }, slow ? 1800 : 700);
  });
}

/**
 * @param mode        "add" | "edit"
 * @param initial     prefill values in edit mode; null in add mode
 * @param isSelf      true when editing the currently signed-in admin's
 *                    own record — drives the self-demotion warning
 * @param simulate    demo-only: { emailTaken, serverError, slow }
 */
function UserFormDialog({ open, mode, initial, isSelf, simulate, onClose, onSaved }) {
  const [values, setValues] = useState(() => initial ?? emptyForm());
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const initialRef = useRef(initial ?? emptyForm());
  // Ignore a response that arrives after the dialog has already been
  // abandoned — same "supersede, don't apply" pattern as useTableData's
  // AbortController handling, just without a real fetch to abort.
  const submitToken = useRef(0);

  useEffect(() => {
    if (!open) return;
    const start = initial ?? emptyForm();
    setValues(start);
    initialRef.current = start;
    setTouched({});
    setSubmitAttempted(false);
    setFormError(null);
    setFieldErrors({});
    setConfirmDiscard(false);
  }, [open, initial]);

  const isDirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(initialRef.current), [values]);

  const set = (key) => (v) => {
    setValues((s) => ({ ...s, [key]: v }));
    // A server-side field error (e.g. "email taken") should clear the
    // moment they start changing that field — leaving it visible after
    // they've already edited the value reads as the app not noticing.
    if (fieldErrors[key]) setFieldErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };
  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (!values.name.trim()) e.name = "Name is required";
    if (!values.email.trim()) e.email = "Email is required";
    else if (!EMAIL_RE.test(values.email)) e.email = "Enter a valid email address";
    if (!values.role) e.role = "Select a role";
    if (!values.branch) e.branch = "Select a branch";
    if (ROLES_NEEDING_LIMIT.has(values.role) && (values.approvalLimit === null || values.approvalLimit <= 0)) {
      e.approvalLimit = "Required for this role";
    }
    return { ...e, ...fieldErrors };
  }, [values, fieldErrors]);

  // Client-side errors stay quiet until the field has been visited or a
  // submit was attempted — nobody needs "Name is required" before
  // they've typed a single character. Server errors (already in
  // fieldErrors) show immediately, since they only exist after a
  // submit already happened.
  const showError = (key) => (touched[key] || submitAttempted || fieldErrors[key]) ? errors[key] : undefined;

  const requestClose = () => {
    if (submitting) return; // nothing meaningful to cancel mid-write — see DialogShell's suspendKeys note
    if (isDirty) setConfirmDiscard(true);
    else onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (Object.keys(errors).length > 0) return;

    const token = ++submitToken.current;
    setSubmitting(true);
    setFormError(null);
    try {
      const saved = await fakeSave(values, simulate);
      if (submitToken.current !== token) return; // superseded — dialog moved on
      onSaved(saved, mode);
      onClose();
    } catch (err) {
      if (submitToken.current !== token) return;
      if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      else setFormError(err.message || "Something went wrong. Try again.");
    } finally {
      if (submitToken.current === token) setSubmitting(false);
    }
  };

  const showLimit = ROLES_NEEDING_LIMIT.has(values.role);
  const selfDemotion = isSelf && mode === "edit" && initial?.role === "Owner" && values.role && values.role !== "Owner";

  return (
    <>
      <DialogShell open={open} onClose={requestClose} size="lg" suspendKeys={submitting || confirmDiscard}>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader
            title={mode === "add" ? "Add user" : `Edit ${initial?.name ?? "user"}`}
            description={mode === "add"
              ? "They'll receive an email invite to set up their account."
              : "Changes take effect on their next sign-in."}
            onClose={requestClose}
            closeDisabled={submitting}
          />

          <DialogBody>
            {formError && (
              <div className="mb-4 flex items-start gap-2 rounded-md px-3 py-2 text-sm" style={{ background: T.roseSoft, color: T.rose }}>
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {selfDemotion && (
              <div className="mb-4 flex items-start gap-2 rounded-md px-3 py-2 text-sm" style={{ background: T.amberSoft, color: T.amber }}>
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <span>You're removing your own Owner privileges. Once saved, you won't be able to undo this yourself — another owner will need to restore it.</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="name" label="Full name" required value={values.name}
                onChange={(e) => set("name")(e.target.value)} onBlur={blur("name")} error={showError("name")} />

              <Input id="email" label="Work email" required type="email" value={values.email}
                onChange={(e) => set("email")(e.target.value)} onBlur={blur("email")} error={showError("email")}
                readOnly={mode === "edit"}
                hint={mode === "edit" ? 'Locked — use "Change email" from the row menu' : undefined} />

              <Select id="role" label="Role" required value={values.role} placeholder="Select a role"
                options={ROLE_OPTIONS} onChange={(e) => set("role")(e.target.value)} onBlur={blur("role")} error={showError("role")} />

              <Select id="branch" label="Branch" required value={values.branch} placeholder="Select a branch"
                options={BRANCH_OPTIONS} onChange={(e) => set("branch")(e.target.value)} onBlur={blur("branch")} error={showError("branch")} />

              <div className="sm:col-span-2">
                <SearchCombobox id="reportsTo" label="Reports to" options={STAFF_DIRECTORY}
                  value={values.reportsTo} onChange={set("reportsTo")} hint="Optional — leave blank for senior roles" />
              </div>

              {showLimit && (
                <div className="sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]">
                  <MoneyInput id="approvalLimit" label="Approval limit" currency="KES" value={values.approvalLimit}
                    onChange={set("approvalLimit")} error={showError("approvalLimit")} hint="Per transaction, this role" />
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-md border px-3 py-2.5" style={{ borderColor: T.hairline }}>
              <div>
                <p className="text-sm font-medium" style={{ color: T.ink }}>Require MFA</p>
                <p className="text-xs" style={{ color: T.ink2 }}>They can't sign in without it once this is saved.</p>
              </div>
              <Switch id="mfaRequired" checked={values.mfaRequired} onChange={set("mfaRequired")} />
            </div>

            {mode === "edit" && (
              <div className="mt-5">
                <Textarea id="reason" label="Reason for change" placeholder="Optional context for the audit trail…" rows={2}
                  value={values.reason} onChange={(e) => set("reason")(e.target.value)} hint="Recorded alongside this change" />
              </div>
            )}
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="secondary" disabled={submitting} onClick={requestClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>{mode === "add" ? "Add user" : "Save changes"}</Button>
          </DialogFooter>
        </form>
      </DialogShell>

      <ConfirmDialog open={confirmDiscard} title="Discard unsaved changes?" body="Your edits will be lost."
        confirmLabel="Discard" onCancel={() => setConfirmDiscard(false)} onConfirm={() => { setConfirmDiscard(false); onClose(); }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEMO HARNESS
   A compact echo of the users table's header + rows — not the full
   admin-users-wireframe — just enough to show this dialog opening
   from its two real entry points: the header's "Add user" and a
   row's "Edit profile".
   ═══════════════════════════════════════════════════════════════ */

const SAMPLE_ROWS = [
  { id: "u3", name: "Dennis Ndung'u", email: "dennis@steward.co.ke", role: "Owner", branch: "nairobi-hq", reportsTo: null, approvalLimit: null, mfaRequired: true, init: "DN", self: true },
  { id: "u1", name: "Amina Wanjiru", email: "amina.w@steward.co.ke", role: "Controller", branch: "nairobi-hq", reportsTo: STAFF_DIRECTORY[2], approvalLimit: 500000, mfaRequired: true, init: "AW" },
  { id: "u2", name: "Brian Otieno", email: "b.otieno@steward.co.ke", role: "Approver", branch: "mombasa", reportsTo: STAFF_DIRECTORY[0], approvalLimit: 150000, mfaRequired: true, init: "BO" },
  { id: "u4", name: "Faith Kamau", email: "faith.k@steward.co.ke", role: "Preparer", branch: "kisumu", reportsTo: STAFF_DIRECTORY[0], approvalLimit: null, mfaRequired: false, init: "FK" },
];

function RoleBadge({ role }) {
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
      style={{ background: role === "Owner" ? T.accentSoft : T.muted, color: role === "Owner" ? T.accent : T.ink2 }}>
      {role}
    </span>
  );
}

function ToggleChip({ on, onClick, children }) {
  return (
    <button onClick={onClick} className="rounded px-2 py-1 font-medium"
      style={{ background: on ? T.accent : "#2A2D36", color: "#fff" }}>
      {children}
    </button>
  );
}

export default function UserFormDialogDemo() {
  const [rows, setRows] = useState(SAMPLE_ROWS);
  const [dialog, setDialog] = useState(null); // { mode: "add" | "edit", row?: ... }
  const [simEmailTaken, setSimEmailTaken] = useState(false);
  const [simServerError, setSimServerError] = useState(false);
  const [simSlow, setSimSlow] = useState(false);
  const { list, push, close } = useToasts();

  const openAdd = () => setDialog({ mode: "add" });
  const openEdit = (row) => setDialog({ mode: "edit", row });
  const closeDialog = () => setDialog(null);

  const handleSaved = (values, mode) => {
    if (mode === "add") {
      setRows((rs) => [{ ...values, id: `u${Date.now()}`, init: values.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() }, ...rs]);
      push({ tone: "success", title: `${values.name} invited` });
    } else {
      setRows((rs) => rs.map((r) => (r.id === dialog.row.id ? { ...r, ...values } : r)));
      push({ tone: "success", title: "Changes saved" });
    }
  };

  const initialValues = dialog?.mode === "edit" ? {
    name: dialog.row.name, email: dialog.row.email, role: dialog.row.role, branch: dialog.row.branch,
    reportsTo: dialog.row.reportsTo, approvalLimit: dialog.row.approvalLimit, mfaRequired: dialog.row.mfaRequired, reason: "",
  } : null;

  return (
    <div className="min-h-screen w-full pb-24" style={{ background: T.bg, color: T.ink }}>
      {/* demo controls — not part of the design */}
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b px-4 py-2 text-xs" style={{ background: T.ink, borderColor: T.ink, color: "#C9CDD8" }}>
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#8A90A0" }}>simulate on submit</span>
        <ToggleChip on={simEmailTaken} onClick={() => setSimEmailTaken((v) => !v)}>Email already taken</ToggleChip>
        <ToggleChip on={simServerError} onClick={() => setSimServerError((v) => !v)}>Server error</ToggleChip>
        <ToggleChip on={simSlow} onClick={() => setSimSlow((v) => !v)}>Slow (1.8s)</ToggleChip>
        <span className="ml-auto hidden sm:block" style={{ color: "#6E7482" }}>
          Try editing Dennis (marked "you") and changing the role away from Owner.
        </span>
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-8 sm:px-10">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
            <p className="mt-1 text-sm" style={{ color: T.ink2 }}>People with access to this organisation.</p>
          </div>
          <Button icon={Plus} onClick={openAdd}>Add user</Button>
        </div>

        <div className="overflow-hidden rounded-lg border" style={{ borderColor: T.hairline, background: T.surface }}>
          {rows.map((r, i) => (
            <div key={r.id} className={cx("flex items-center gap-3 px-4 py-3", i > 0 && "border-t")} style={{ borderColor: T.hairline }}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium" style={{ background: T.muted, color: T.ink2 }}>{r.init}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium" style={{ color: T.ink }}>{r.name}</span>
                  {r.self && <span className="text-xs" style={{ color: T.ink3 }}>(you)</span>}
                </span>
                <span className="block truncate text-xs" style={{ color: T.ink2 }}>{r.email}</span>
              </span>
              <RoleBadge role={r.role} />
              <Button variant="secondary" size="sm" icon={Pencil} onClick={() => openEdit(r)}>Edit</Button>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-xl text-xs leading-relaxed" style={{ color: T.ink3 }}>
          This list is a stand-in for the full admin-users-wireframe table — same "Add user" header button, same
          per-row "Edit profile" entry point, wired to the dialog below.
        </p>
      </div>

      <UserFormDialog
        open={Boolean(dialog)}
        mode={dialog?.mode}
        initial={initialValues}
        isSelf={dialog?.mode === "edit" && Boolean(dialog.row?.self)}
        simulate={{ emailTaken: simEmailTaken, serverError: simServerError, slow: simSlow }}
        onClose={closeDialog}
        onSaved={handleSaved}
      />

      <ToastHost list={list} close={close} />
    </div>
  );
}
