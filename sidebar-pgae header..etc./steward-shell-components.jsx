import { useState, useRef, useEffect, useCallback } from "react";
import {
  LayoutGrid, Users, Wallet, Settings, Search, Bell, ChevronDown,
  LogOut, ChevronsLeft, ChevronsRight, ChevronRight, ChevronLeft, ChevronsLeft as First,
  ChevronsRight as Last, Plus, Eye, Pencil, Trash2, Check, MoreHorizontal, Building2,
  X, Lock, Menu as MenuGlyph, ShieldCheck,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   STEWARD — shell components
   Mirrors src/components/ui/{badge,avatar,switch,card,breadcrumb,
   page-header,pagination,menu,sidebar,navbar}.tsx. No react-dom here —
   this preview sandbox doesn't support it (same constraint that broke
   the earlier toast/dialog artifacts) — Menu's dropdown renders fixed
   in-tree instead of portalled. The real .tsx files DO portal Menu;
   your actual app has react-dom available.
   ═══════════════════════════════════════════════════════════════ */
const T = {
  bg: "#FBFBFC", surface: "#FFFFFF", hairline: "#E7E8EC", muted: "#F4F5F7",
  ink: "#15171C", ink2: "#5B6070", ink3: "#8A90A0",
  accent: "#0B5D4E", accentHover: "#094C40", accentSoft: "#E6F0ED",
  amber: "#8A5A00", amberSoft: "#FDF3E0",
  rose: "#8C2F39", roseSoft: "#FBEBEC",
};
const cx = (...a) => a.filter(Boolean).join(" ");
const ring = (c = T.accent) => ({ outlineColor: c });

/* Flip-on-edge popover positioning — same hook used throughout the kit. */
function usePopoverPosition(anchorRef, open, options = {}) {
  const { align = "start", gap = 4, viewportPadding = 8, preferredHeight = 280, matchWidth = false, minWidth } = options;
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

const BTN_SIZE = { sm: "h-8 px-2.5 text-sm gap-1.5", md: "h-9 px-3.5 text-sm gap-1.5" };
const BTN_PALETTE = {
  primary: { bg: T.accent, bgHover: T.accentHover, fg: "#fff", border: "transparent" },
  secondary: { bg: T.surface, bgHover: T.muted, fg: T.ink, border: T.hairline },
  ghost: { bg: "transparent", bgHover: T.muted, fg: T.ink2, border: "transparent" },
};
function Button({ variant = "primary", size = "md", icon: Icon, children, onClick, className }) {
  const [hover, setHover] = useState(false);
  const p = BTN_PALETTE[variant];
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={cx("inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", BTN_SIZE[size], className)}
      style={{ background: hover ? p.bgHover : p.bg, color: p.fg, border: `1px solid ${p.border}`, ...ring() }}>
      {Icon && <Icon size={15} strokeWidth={2.2} />}{children}
    </button>
  );
}

/* Badge --------------------------------------------------------------- */
const BADGE_TONE = {
  neutral: { bg: T.muted, fg: T.ink2 }, pine: { bg: T.accentSoft, fg: T.accent },
  amber: { bg: T.amberSoft, fg: T.amber }, rose: { bg: T.roseSoft, fg: T.rose },
};
function Badge({ tone = "neutral", dot, children, className }) {
  const c = BADGE_TONE[tone];
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium tabular-nums", className)}
      style={{ background: c.bg, color: c.fg }}>
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.fg }} />}
      {children}
    </span>
  );
}

/* Avatar ---------------------------------------------------------------- */
const AV_SIZE = { sm: 24, md: 32, lg: 40 };
const AV_FONT = { sm: 10, md: 12, lg: 14 };
const AV_PALETTE = [
  { bg: "#E6F0ED", fg: "#0B5D4E" }, { bg: "#FDF3E0", fg: "#8A5A00" }, { bg: "#FBEBEC", fg: "#8C2F39" },
  { bg: "#E8ECFB", fg: "#3B4FBF" }, { bg: "#F3E8FB", fg: "#7A3FBF" }, { bg: "#E8F7F3", fg: "#0F8F6B" },
];
function hashName(name) { let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0; return h % AV_PALETTE.length; }
function initialsOf(name) { const p = name.trim().split(/\s+/); return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase(); }
function Avatar({ name, size = "md", colourful }) {
  const tone = colourful ? AV_PALETTE[hashName(name)] : { bg: T.muted, fg: T.ink2 };
  const px = AV_SIZE[size];
  return (
    <span aria-label={name} className="flex shrink-0 items-center justify-center rounded-full font-medium"
      style={{ width: px, height: px, fontSize: AV_FONT[size], background: tone.bg, color: tone.fg }}>
      {initialsOf(name)}
    </span>
  );
}

/* Switch ------------------------------------------------------------- */
function Switch({ checked, onChange, size = "md" }) {
  const trackW = size === "sm" ? 28 : 36, thumbPx = size === "sm" ? 12 : 16, trackH = size === "sm" ? 16 : 20;
  const onX = trackW - thumbPx - 2;
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="relative inline-flex shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2"
      style={{ width: trackW, height: trackH, background: checked ? T.accent : T.hairline, ...ring() }}>
      <span className="inline-block rounded-full bg-white shadow transition-transform"
        style={{ width: thumbPx, height: thumbPx, transform: `translateX(${checked ? onX : 2}px)` }} />
    </button>
  );
}

/* Card ------------------------------------------------------------- */
function Card({ className, children }) {
  return <div className={cx("rounded-lg border", className)} style={{ borderColor: T.hairline, background: T.surface }}>{children}</div>;
}
function CardHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: T.hairline }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: T.ink2 }}>{title}</h3>
      {action}
    </div>
  );
}

/* Breadcrumb ------------------------------------------------------------ */
function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} style={{ color: T.ink3 }} />}
            {last ? (
              <span className="font-medium" style={{ color: T.ink }}>{item.label}</span>
            ) : (
              <a href={item.href} className="hover:underline" style={{ color: T.ink2 }}>{item.label}</a>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/* PageHeader ------------------------------------------------------------ */
function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: T.ink }}>{title}</h1>
        {description && <p className="mt-1 max-w-xl text-sm" style={{ color: T.ink2 }}>{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/* Pagination — accepts the same `meta` shape the table contract's
   PaginationMeta uses, so it's a direct drop-in for a useTableData
   response, not a generic widget that happens to also fit. */
function pageList(page, totalPages) {
  const out = [1];
  if (page > 4) out.push("…");
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) out.push(p);
  if (page < totalPages - 3) out.push("…");
  if (totalPages > 1) out.push(totalPages);
  return out;
}
function Pagination({ meta, onPageChange, onPerPageChange, perPageOptions = [10, 25, 50, 100] }) {
  const { page, perPage, totalItems, totalPages, from, to } = meta;
  const [jumpAt, setJumpAt] = useState(null);
  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 lg:flex-row lg:items-center lg:justify-between" style={{ borderColor: T.hairline }}>
      <div className="flex items-center gap-3 text-sm" style={{ color: T.ink2 }}>
        <span className="tabular-nums">
          <span style={{ color: T.ink, fontWeight: 500 }}>{from.toLocaleString()}–{to.toLocaleString()}</span> of{" "}
          <span style={{ color: T.ink, fontWeight: 500 }}>{totalItems.toLocaleString()}</span>
        </span>
        <span className="h-4 w-px" style={{ background: T.hairline }} />
        <label className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Rows</span>
          <select value={perPage} onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="h-8 rounded-md border px-2 text-sm tabular-nums" style={{ borderColor: T.hairline, color: T.ink, background: T.surface }}>
            {perPageOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>
      <nav className="flex items-center justify-between gap-1 lg:justify-end">
        <span className="flex items-center gap-1">
          <NavBtn icon={First} label="First" onClick={() => onPageChange(1)} disabled={page === 1} cls="hidden sm:flex" />
          <NavBtn icon={ChevronLeft} label="Prev" onClick={() => onPageChange(page - 1)} disabled={page === 1} />
        </span>
        <span className="hidden items-center gap-1 md:flex">
          {pageList(page, totalPages).map((p, i) => p === "…" ? (
            jumpAt === i ? (
              <input key={`j${i}`} autoFocus type="number" min={1} max={totalPages} defaultValue={page}
                onBlur={() => setJumpAt(null)}
                onKeyDown={(e) => { if (e.key === "Enter") { const v = Number(e.currentTarget.value); if (v >= 1 && v <= totalPages) onPageChange(v); setJumpAt(null); } if (e.key === "Escape") setJumpAt(null); }}
                className="h-8 w-14 rounded-md border px-1.5 text-center text-sm tabular-nums" style={{ borderColor: T.accent, color: T.ink }} />
            ) : (
              <button key={`e${i}`} onClick={() => setJumpAt(i)} className="h-8 w-8 rounded-md text-sm hover:bg-slate-100" style={{ color: T.ink3 }}>…</button>
            )
          ) : (
            <button key={p} onClick={() => onPageChange(p)}
              className="h-8 min-w-8 rounded-md border px-1.5 text-sm tabular-nums"
              style={p === page ? { background: T.accent, borderColor: T.accent, color: "#fff", fontWeight: 500 } : { borderColor: T.hairline, color: T.ink2 }}>
              {p}
            </button>
          ))}
        </span>
        <span className="text-sm tabular-nums md:hidden" style={{ color: T.ink2 }}>Page {page} of {totalPages}</span>
        <span className="flex items-center gap-1">
          <NavBtn icon={ChevronRight} label="Next" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} />
          <NavBtn icon={Last} label="Last" onClick={() => onPageChange(totalPages)} disabled={page === totalPages} cls="hidden sm:flex" />
        </span>
      </nav>
    </div>
  );
}
function NavBtn({ icon: Icon, label, onClick, disabled, cls }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label}
      className={cx("flex h-8 w-8 items-center justify-center rounded-md border disabled:cursor-not-allowed", cls)}
      style={{ borderColor: T.hairline, color: disabled ? T.ink3 : T.ink2, opacity: disabled ? 0.5 : 1 }}>
      <Icon size={15} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MENU — Menu / MenuTrigger / MenuContent / MenuItem /
   MenuCheckboxItem / MenuSeparator / MenuLabel

   Replaces two independent hand-rolled popovers (kebab actions,
   column-visibility) with one. No react-dom here, so the content
   renders fixed in-tree via usePopoverPosition rather than portalled
   — the real menu.tsx portals to document.body.
   ═══════════════════════════════════════════════════════════════ */

function useMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  return { open, setOpen, triggerRef };
}

function MenuTrigger({ menu, children }) {
  return (
    <span
      ref={menu.triggerRef}
      onClick={(e) => { children.props.onClick?.(e); menu.setOpen(!menu.open); }}
      className="inline-flex"
    >
      {children}
    </span>
  );
}

function MenuContent({ menu, align = "start", minWidth = 180, children }) {
  const contentRef = useRef(null);
  const position = usePopoverPosition(menu.triggerRef, menu.open, { align, minWidth, preferredHeight: 260, gap: 4 });

  useEffect(() => {
    if (!menu.open) return;
    const onDown = (e) => {
      const t = e.target;
      if (!menu.triggerRef.current?.contains(t) && !contentRef.current?.contains(t)) menu.setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menu.open]);

  useEffect(() => {
    if (!menu.open) return;
    const items = () => Array.from(contentRef.current?.querySelectorAll('[role^="menuitem"]:not([disabled])') || []);
    const t = setTimeout(() => items()[0]?.focus(), 0);
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); menu.setOpen(false); menu.triggerRef.current?.focus(); return; }
      if (e.key === "Tab") { menu.setOpen(false); return; }
      const list = items();
      if (!list.length) return;
      const i = list.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1 + list.length) % list.length]?.focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length]?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); };
  }, [menu.open]);

  if (!menu.open || !position) return null;
  return (
    <div ref={contentRef} role="menu" style={{ ...position.style, zIndex: 50, borderColor: T.hairline }}
      className="overflow-auto rounded-md border bg-white py-1 shadow-lg"
    >
      {children}
    </div>
  );
}

function MenuItem({ icon: Icon, destructive, disabled, onSelect, menu, children }) {
  return (
    <button type="button" role="menuitem" tabIndex={-1} disabled={disabled}
      onClick={() => { onSelect?.(); menu.setOpen(false); menu.triggerRef.current?.focus(); }}
      className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-45"
      style={{ color: destructive ? T.rose : T.ink }}
      onMouseEnter={(e) => (e.currentTarget.style.background = destructive ? T.roseSoft : T.muted)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {Icon && <Icon size={15} />}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}

function MenuCheckboxItem({ checked, onCheckedChange, locked, children }) {
  return (
    <button type="button" role="menuitemcheckbox" aria-checked={checked} tabIndex={-1} disabled={locked}
      onClick={() => onCheckedChange(!checked)}
      className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm outline-none disabled:cursor-not-allowed"
      style={{ color: T.ink }}
      onMouseEnter={(e) => !locked && (e.currentTarget.style.background = T.muted)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border"
        style={{ borderColor: checked ? T.accent : T.hairline, background: checked ? T.accent : "transparent" }}>
        {checked && <Check size={11} strokeWidth={3} color="#fff" />}
      </span>
      <span className="flex-1 truncate">{children}</span>
      {locked && <span className="text-xs" style={{ color: T.ink3 }}>always on</span>}
    </button>
  );
}

function MenuSeparator() { return <div className="my-1 h-px" style={{ background: T.hairline }} />; }
function MenuLabel({ children }) {
  return <p className="px-3 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wider" style={{ color: T.ink3 }}>{children}</p>;
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
   Collapse toggle now lives under the logo, not at the bottom — the
   bottom is where account info and Log out live now, and mixing a
   structural "how much room does nav take" control in with session
   controls conflates two different categories of action.

   `forceMobile` below is a DEMO-ONLY escape hatch: the real component
   uses viewport-based `md:` breakpoints, which respond to actual
   browser width, not a shrunk container — so a "preview mobile" toggle
   in an artifact can't trigger them by resizing a div. This directly
   forces the mobile-drawer visual instead, just for the preview frame
   further down. It isn't part of the real sidebar.tsx API.
   ═══════════════════════════════════════════════════════════════ */

const SidebarContext = { current: { collapsed: false, requestExpand: () => {} } };

function Sidebar({ logo, logoCollapsed, collapsed, onCollapsedChange, mobileOpen, onMobileOpenChange, forceMobile, children }) {
  SidebarContext.current = { collapsed, requestExpand: () => onCollapsedChange(false) };
  const isOverlay = forceMobile;
  const width = isOverlay ? 256 : (collapsed ? 64 : 256);
  return (
    <>
      {isOverlay && mobileOpen && (
        <div onClick={() => onMobileOpenChange(false)} className="absolute inset-0 z-40" style={{ background: "rgba(0,0,0,.4)" }} />
      )}
      <aside
        className="flex shrink-0 flex-col border-r transition-transform duration-200"
        style={{
          width, borderColor: T.hairline, background: T.surface,
          position: isOverlay ? "absolute" : "relative",
          insetBlock: isOverlay ? 0 : undefined, left: isOverlay ? 0 : undefined,
          zIndex: isOverlay ? 50 : undefined,
          transform: isOverlay ? (mobileOpen ? "translateX(0)" : "translateX(-100%)") : "none",
          height: isOverlay ? "100%" : "100%",
        }}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b px-4" style={{ borderColor: T.hairline }}>
          <span className="flex min-w-0 flex-1 items-center overflow-hidden">{collapsed && !isOverlay ? (logoCollapsed || logo) : logo}</span>
          {isOverlay && (
            <button onClick={() => onMobileOpenChange(false)} aria-label="Close menu" className="shrink-0 rounded p-1 hover:bg-slate-100" style={{ color: T.ink3 }}>
              <X size={18} />
            </button>
          )}
        </div>
        {!isOverlay && (
          <button onClick={() => onCollapsedChange(!collapsed)}
            className="flex h-9 shrink-0 items-center justify-center gap-1.5 border-b hover:bg-slate-50"
            style={{ borderColor: T.hairline, color: T.ink3 }}>
            {collapsed ? <ChevronsRight size={15} /> : <><ChevronsLeft size={15} /><span className="text-xs font-medium">Collapse</span></>}
          </button>
        )}
        {children}
      </aside>
    </>
  );
}
function SidebarNav({ children }) { return <nav className="flex-1 overflow-y-auto py-2">{children}</nav>; }
function SidebarSection({ label, children }) {
  const { collapsed } = SidebarContext.current;
  return (
    <div className="px-2 py-2">
      {label && !collapsed && <p className="px-2.5 pb-1.5 text-xs font-medium uppercase tracking-wider" style={{ color: T.ink3 }}>{label}</p>}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
/* Row padding is py-2.5, not py-2 — a deliberate step up from a
   maximally dense admin sidebar. This is scanned dozens of times a
   day; a little more breathing room per row meaningfully cuts
   misclicks over a full day, without going as loose as a spacious
   consumer-app sidebar (which would cost fitting a full nav without
   scrolling). */
function SidebarItem({ icon: Icon, active, count, locked, children }) {
  const { collapsed } = SidebarContext.current;
  if (locked) {
    return (
      <Tip label={locked}>
        <span className={cx("flex cursor-not-allowed items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm", collapsed && "justify-center")} style={{ color: T.ink3 }}>
          <Icon size={16} className="shrink-0" />
          {!collapsed && <><span className="flex-1 truncate">{children}</span><Lock size={13} className="shrink-0" /></>}
        </span>
      </Tip>
    );
  }
  const row = (
    <a href="#" className={cx("relative flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm outline-none transition-colors", collapsed && "justify-center")}
      style={{ background: active ? T.accentSoft : "transparent", color: active ? T.accent : T.ink2, fontWeight: active ? 500 : 400 }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = T.muted; e.currentTarget.style.color = T.ink; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.ink2; } }}
    >
      {active && !collapsed && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full" style={{ background: T.accent }} />}
      <Icon size={16} className="shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{children}</span>
          {count !== undefined && <Badge tone={active ? "pine" : "neutral"}>{count}</Badge>}
        </>
      )}
    </a>
  );
  return collapsed ? <Tip label={children}>{row}</Tip> : row;
}
/* Expandable nested items. Collapsed-rail behavior: clicking the
   group's icon expands the WHOLE sidebar rather than opening a flyout
   submenu — a flyout is more "native" but is real added complexity
   (another positioned popover) for a secondary path. */
function SidebarGroup({ icon: Icon, label, defaultOpen, children }) {
  const { collapsed, requestExpand } = SidebarContext.current;
  const [open, setOpen] = useState(Boolean(defaultOpen));
  if (collapsed) {
    return (
      <Tip label={label}>
        <button onClick={requestExpand} className="flex w-full items-center justify-center rounded-md px-2.5 py-2.5 hover:bg-slate-50" style={{ color: T.ink2 }}>
          <Icon size={16} />
        </button>
      </Tip>
    );
  }
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm hover:bg-slate-50" style={{ color: T.ink2 }}>
        <Icon size={16} className="shrink-0" />
        <span className="flex-1 truncate text-left">{label}</span>
        <ChevronDown size={14} className="shrink-0 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && <div className="ml-[13px] mt-0.5 flex flex-col gap-1 border-l py-0.5 pl-3" style={{ borderColor: T.hairline }}>{children}</div>}
    </div>
  );
}
function SidebarFooter({ children }) { return <div className="shrink-0 border-t p-2" style={{ borderColor: T.hairline }}>{children}</div>; }
function SidebarAccount({ name, email, colourful }) {
  const { collapsed } = SidebarContext.current;
  const row = (
    <div className={cx("flex items-center gap-2.5 rounded-md px-2 py-2", collapsed && "justify-center")}>
      <Avatar name={name} size="sm" colourful={colourful} />
      {!collapsed && <span className="min-w-0 flex-1"><p className="truncate text-sm font-medium" style={{ color: T.ink }}>{name}</p><p className="truncate text-xs" style={{ color: T.ink3 }}>{email}</p></span>}
    </div>
  );
  return collapsed ? <Tip label={`${name} · ${email}`}>{row}</Tip> : row;
}
/* Muted at rest, not danger-toned — signing out is routine and
   frequent, not a mistake to be warned away from the way suspending an
   account is. The rose hint only appears on hover, right when it's
   about to matter. */
function SidebarLogoutButton({ onClick }) {
  const { collapsed } = SidebarContext.current;
  const [hover, setHover] = useState(false);
  const btn = (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={cx("flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors", collapsed && "justify-center")}
      style={{ color: hover ? T.rose : T.ink2, background: hover ? T.roseSoft : "transparent" }}>
      <LogOut size={16} className="shrink-0" />
      {!collapsed && <span>Log out</span>}
    </button>
  );
  return collapsed ? <Tip label="Log out">{btn}</Tip> : btn;
}

/* Minimal tooltip for the sidebar's collapsed-rail labels — separate
   from the kit's full Tooltip (which portals) since nothing here needs
   viewport-flip; a fixed right-side placement is always correct for a
   left-docked rail. */
function Tip({ label, children }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs shadow-lg" style={{ background: T.ink, color: "#fff" }}>
          {label}
        </span>
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════════ */

function IconButton({ label, children, badge, onClick, className }) {
  return (
    <button onClick={onClick} aria-label={label} className={cx("relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-50", className)} style={{ color: T.ink2 }}>
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ background: T.rose }}>
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}
function Navbar({ left, onMenuClick, notificationCount, account }) {
  const accountMenu = useMenu();
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4" style={{ borderColor: T.hairline, background: T.surface }}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onMenuClick && <IconButton label="Open menu" onClick={onMenuClick}><MenuGlyph size={18} /></IconButton>}
        <div className="min-w-0">{left}</div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <IconButton label="Search"><Search size={17} /></IconButton>
        <IconButton label="Notifications" badge={notificationCount}><Bell size={17} /></IconButton>
        <MenuTrigger menu={accountMenu}>
          <button className="flex items-center gap-1.5 rounded-md py-1 pl-1 pr-2 hover:bg-slate-50">
            <Avatar name={account.name} size="sm" />
            <ChevronDown size={14} style={{ color: T.ink3, transform: accountMenu.open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
          </button>
        </MenuTrigger>
        <MenuContent menu={accountMenu} align="end" minWidth={200}>
          <MenuLabel>{account.email}</MenuLabel>
          <MenuItem icon={Settings} menu={accountMenu}>Account settings</MenuItem>
          <MenuSeparator />
          <MenuItem icon={LogOut} destructive menu={accountMenu}>Sign out</MenuItem>
        </MenuContent>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSED DEMO — an actual app shell, not isolated snippets.
   Sidebar/Navbar only mean something working together; showing them
   side by side as unconnected boxes would prove less than this does.
   ═══════════════════════════════════════════════════════════════ */

/* Nav config: `permission` is just data here — filtering happens in
   buildNav() below, in application code, NOT inside SidebarSection or
   SidebarItem. A generic UI component shouldn't encode one app's
   permission model; see the note in sidebar.tsx for why. Two patterns
   shown side by side since both are legitimate depending on context:
   HIDE "Loans" entirely for a role with no reason to know it exists;
   show "Branches" but LOCKED for a role that might reasonably want to
   know the feature is there. */
const ROLE_PERMISSIONS = {
  Owner: new Set(["loans:view", "org:manage"]),
  Preparer: new Set([]),
};

const NAV_CONFIG = [
  { section: "Overview", items: [
    { type: "item", icon: LayoutGrid, label: "Dashboard" },
    { type: "item", icon: Users, label: "Users", count: 12, active: true },
    { type: "item", icon: Wallet, label: "Loans", count: 3, permission: "loans:view", hideIfDenied: true },
  ]},
  { section: "Organisation", items: [
    { type: "item", icon: Building2, label: "Branches", permission: "org:manage", lockReason: "Requires Organisation Manager permission" },
    { type: "group", icon: Settings, label: "Settings", children: [
      { label: "General" }, { label: "Team" }, { label: "Billing" },
    ]},
  ]},
];

function buildNav(role) {
  const granted = ROLE_PERMISSIONS[role] || new Set();
  return NAV_CONFIG.map((sec) => ({
    ...sec,
    items: sec.items.filter((it) => {
      if (!it.permission) return true;
      if (granted.has(it.permission)) return true;
      return !it.hideIfDenied; // kept, but rendered locked, unless hideIfDenied
    }),
  }));
}

const SAMPLE_USERS = [
  { id: "u1", name: "Amina Wanjiru", email: "amina.w@steward.co.ke", role: "Controller" },
  { id: "u2", name: "Brian Otieno", email: "b.otieno@steward.co.ke", role: "Approver" },
  { id: "u3", name: "Dennis Ndung'u", email: "dennis@steward.co.ke", role: "Owner" },
  { id: "u4", name: "Faith Kamau", email: "faith.k@steward.co.ke", role: "Preparer" },
];

function UserRow({ user, colourful }) {
  const kebab = useMenu();
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar name={user.name} colourful={colourful} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" style={{ color: T.ink }}>{user.name}</p>
        <p className="truncate text-xs" style={{ color: T.ink2 }}>{user.email}</p>
      </div>
      <Badge tone={user.role === "Owner" ? "pine" : "neutral"}>{user.role}</Badge>
      <MenuTrigger menu={kebab}>
        <button aria-label={`Actions for ${user.name}`} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100" style={{ color: T.ink2 }}>
          <MoreHorizontal size={16} />
        </button>
      </MenuTrigger>
      <MenuContent menu={kebab} align="end">
        <MenuItem icon={Eye} menu={kebab}>View details</MenuItem>
        <MenuItem icon={Pencil} menu={kebab}>Edit profile</MenuItem>
        <MenuSeparator />
        <MenuItem icon={Trash2} destructive menu={kebab}>Suspend access</MenuItem>
      </MenuContent>
    </div>
  );
}

const FullLogo = (
  <span className="flex items-center gap-2">
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white" style={{ background: T.accent }}>S</span>
    <span className="truncate text-sm font-semibold" style={{ color: T.ink }}>Steward</span>
  </span>
);
const MarkLogo = (
  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white" style={{ background: T.accent }}>S</span>
);

function RenderNav({ sections }) {
  return sections.map((sec) => (
    <SidebarSection key={sec.section} label={sec.section}>
      {sec.items.map((it) => (
        it.type === "group" ? (
          <SidebarGroup key={it.label} icon={it.icon} label={it.label}>
            {it.children.map((c) => <SidebarItem key={c.label} icon={it.icon}>{c.label}</SidebarItem>)}
          </SidebarGroup>
        ) : (
          <SidebarItem key={it.label} icon={it.icon} active={it.active} count={it.count} locked={it.locked}>
            {it.label}
          </SidebarItem>
        )
      ))}
    </SidebarSection>
  ));
}

/* Mobile preview — a self-contained frame, not a claim that resizing
   THIS chat window will trigger real breakpoints. Tailwind's `md:`
   responds to actual browser viewport width, not a shrunk container,
   so an in-page "preview mobile" toggle can't fake that the way it
   can for something that's just a CSS class swap. This frame instead
   directly drives Sidebar's mobileOpen/forceMobile state to show the
   real interaction (backdrop, slide-in, close button) — the actual
   `md:` breakpoint behavior only shows itself in a real narrow browser. */
function MobilePreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative mx-auto h-96 w-72 overflow-hidden rounded-2xl border-4" style={{ borderColor: T.ink, background: T.bg }}>
      <div className="flex h-full flex-col">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3" style={{ borderColor: T.hairline, background: T.surface }}>
          <button onClick={() => setOpen(true)} className="rounded p-1 hover:bg-slate-100" style={{ color: T.ink2 }}>
            <MenuGlyph size={16} />
          </button>
          <span className="text-xs font-medium" style={{ color: T.ink }}>Users</span>
        </div>
        <div className="flex-1 p-3">
          <p className="text-xs" style={{ color: T.ink3 }}>Content area — tap the menu icon.</p>
        </div>
      </div>
      <Sidebar
        logo={FullLogo} logoCollapsed={MarkLogo} collapsed={false} onCollapsedChange={() => {}}
        mobileOpen={open} onMobileOpenChange={setOpen} forceMobile
      >
        <SidebarNav>
          <SidebarSection label="Overview">
            <SidebarItem icon={LayoutGrid}>Dashboard</SidebarItem>
            <SidebarItem icon={Users} active count={12}>Users</SidebarItem>
            <SidebarItem icon={Wallet} count={3}>Loans</SidebarItem>
          </SidebarSection>
        </SidebarNav>
        <SidebarFooter>
          <SidebarAccount name="Dennis Ndung'u" email="dennis@steward.co.ke" />
          <SidebarLogoutButton onClick={() => setOpen(false)} />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

export default function ShellComponentsDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [colourfulAvatars, setColourfulAvatars] = useState(false);
  const [role, setRole] = useState("Owner");
  const colsMenu = useMenu();
  const [showRole, setShowRole] = useState(true);
  const [showEmail, setShowEmail] = useState(true);

  const [meta, setMeta] = useState({ page: 3, perPage: 25, totalItems: 214, totalPages: 9, from: 51, to: 75 });
  const setPage = (page) => setMeta((m) => ({ ...m, page, from: (page - 1) * m.perPage + 1, to: Math.min(page * m.perPage, m.totalItems) }));
  const setPerPage = (perPage) => setMeta((m) => {
    const totalPages = Math.ceil(m.totalItems / perPage);
    return { ...m, perPage, page: 1, totalPages, from: 1, to: Math.min(perPage, m.totalItems) };
  });

  const granted = ROLE_PERMISSIONS[role];
  const navSections = NAV_CONFIG.map((sec) => ({
    ...sec,
    items: sec.items
      .filter((it) => !it.permission || granted.has(it.permission) || !it.hideIfDenied)
      .map((it) => ({ ...it, locked: it.permission && !granted.has(it.permission) ? it.lockReason : undefined })),
  }));

  return (
    <div style={{ background: T.bg, color: T.ink }}>
      {/* demo controls */}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-2 text-xs" style={{ background: T.ink, borderColor: T.ink, color: "#C9CDD8" }}>
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#8A90A0" }}>view as</span>
        {["Owner", "Preparer"].map((r) => (
          <button key={r} onClick={() => setRole(r)} className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium"
            style={{ background: role === r ? T.accent : "#2A2D36", color: "#fff" }}>
            {r === "Owner" && <ShieldCheck size={12} />} {r}
          </button>
        ))}
        <span className="ml-auto hidden sm:block" style={{ color: "#6E7482" }}>
          Preparer: Loans is hidden, Branches is visible-but-locked
        </span>
      </div>

      <div className="flex" style={{ height: "calc(100vh - 33px)" }}>
        <div className="relative flex" style={{ height: "100%" }}>
          <Sidebar
            logo={FullLogo} logoCollapsed={MarkLogo}
            collapsed={collapsed} onCollapsedChange={setCollapsed}
            mobileOpen={false} onMobileOpenChange={() => {}}
          >
            <SidebarNav>
              <RenderNav sections={navSections} />
            </SidebarNav>
            <SidebarFooter>
              <SidebarAccount name="Dennis Ndung'u" email="dennis@steward.co.ke" colourful={colourfulAvatars} />
              <SidebarLogoutButton onClick={() => {}} />
            </SidebarFooter>
          </Sidebar>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            left={<Breadcrumb items={[{ label: "Steward", href: "#" }, { label: "Users" }]} />}
            notificationCount={3}
            account={{ name: "Dennis Ndung'u", email: "dennis@steward.co.ke" }}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-6 py-8">
              <PageHeader
                title="Users"
                description="People with access to this organisation."
                actions={<Button icon={Plus}>Add user</Button>}
              />

              <Card>
                <CardHeader
                  title="Active users"
                  action={
                    <span className="relative">
                      <MenuTrigger menu={colsMenu}>
                        <button className="rounded-md border px-2.5 py-1 text-xs font-medium" style={{ borderColor: T.hairline, color: T.ink2 }}>Columns</button>
                      </MenuTrigger>
                      <MenuContent menu={colsMenu} align="end" minWidth={180}>
                        <MenuLabel>Show columns</MenuLabel>
                        <MenuCheckboxItem checked locked>Name</MenuCheckboxItem>
                        <MenuCheckboxItem checked={showEmail} onCheckedChange={setShowEmail}>Email</MenuCheckboxItem>
                        <MenuCheckboxItem checked={showRole} onCheckedChange={setShowRole}>Role</MenuCheckboxItem>
                      </MenuContent>
                    </span>
                  }
                />
                <div className="divide-y" style={{ borderColor: T.hairline }}>
                  {SAMPLE_USERS.map((u) => <UserRow key={u.id} user={u} colourful={colourfulAvatars} />)}
                </div>
                <Pagination meta={meta} onPageChange={setPage} onPerPageChange={setPerPage} />
              </Card>

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <Card>
                  <CardHeader title="Badge" />
                  <div className="flex flex-wrap gap-2 p-4">
                    <Badge tone="pine">Owner</Badge>
                    <Badge tone="neutral">Preparer</Badge>
                    <Badge tone="amber" dot>3 pending</Badge>
                    <Badge tone="rose" dot>Suspended</Badge>
                  </div>
                </Card>
                <Card>
                  <CardHeader title="Switch" />
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm" style={{ color: T.ink2 }}>Colourful avatars (try it on the sidebar footer + list above)</span>
                    <Switch checked={colourfulAvatars} onChange={setColourfulAvatars} />
                  </div>
                </Card>
              </div>

              <div className="mt-10">
                <Card>
                  <CardHeader title="Sidebar — mobile preview" />
                  <div className="p-6">
                    <MobilePreview />
                    <p className="mx-auto mt-4 max-w-xs text-center text-xs leading-relaxed" style={{ color: T.ink3 }}>
                      Tap the menu icon. The real component drives this from actual viewport width via
                      Tailwind's <code>md:</code> classes — this frame drives the same props directly so it's
                      demonstrable without needing a genuinely narrow browser window.
                    </p>
                  </div>
                </Card>
              </div>

              <p className="mt-8 border-t pb-4 pt-6 text-xs" style={{ borderColor: T.hairline, color: T.ink3 }}>
                Real source: Badge · Avatar · Switch/SwitchRow · Card(+Header/Body/Footer) · Breadcrumb · PageHeader ·
                Pagination · Menu(+Trigger/Content/Item/CheckboxItem/Separator/Label) ·
                Sidebar(+Nav/Section/Item/Group/Footer/Account/LogoutButton) · Navbar — in src/components/ui/,
                exported from index.ts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
