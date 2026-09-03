"use client";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  /** Full name — used to derive initials and pick a colour palette slot. */
  name: string;
  /** Optional image URL. Falls back to initials when omitted or on error. */
  src?: string;
  size?: AvatarSize;
  /**
   * When true, picks a stable hue from a set of coloured palettes based on
   * the name hash. When false (default), renders a neutral grey that works
   * anywhere without visual noise.
   */
  colourful?: boolean;
}

const SIZE_PX: Record<AvatarSize, number> = { sm: 24, md: 32, lg: 40 };
const FONT_PX: Record<AvatarSize, number> = { sm: 10, md: 12, lg: 14 };

/** Six distinct, on-brand hues that are accessible at small sizes. */
const PALETTES: Array<{ bg: string; fg: string }> = [
  { bg: "var(--color-accent-light)", fg: "var(--color-accent)" },
  { bg: "var(--color-warning-light)", fg: "var(--color-warning)" },
  { bg: "var(--color-error-light)", fg: "var(--color-error)" },
  { bg: "var(--avatar-1-bg)", fg: "var(--avatar-1-fg)" },
  { bg: "var(--avatar-2-bg)", fg: "var(--avatar-2-fg)" },
  { bg: "var(--avatar-3-bg)", fg: "var(--avatar-3-fg)" },
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h * 31) + name.charCodeAt(i)) >>> 0;
  return h % PALETTES.length;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Avatar({ name, src, size = "md", colourful }: AvatarProps) {
  const px = SIZE_PX[size];
  const fs = FONT_PX[size];
  const palette = colourful ? PALETTES[hashName(name)] : { bg: "var(--color-bg-secondary)", fg: "var(--color-text-secondary)" };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={px}
        height={px}
        className="shrink-0 rounded-full object-cover"
        style={{ width: px, height: px }}
        onError={(e) => {
          // On load error fall back to the initials span — swap the element.
          const img = e.currentTarget;
          const span = document.createElement("span");
          span.setAttribute("aria-label", name);
          span.style.cssText = `display:inline-flex;align-items:center;justify-content:center;border-radius:9999px;font-weight:500;width:${px}px;height:${px}px;font-size:${fs}px;background:${palette.bg};color:${palette.fg};flex-shrink:0`;
          span.textContent = initialsOf(name);
          img.replaceWith(span);
        }}
      />
    );
  }

  return (
    <span
      aria-label={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium"
      style={{ width: px, height: px, fontSize: fs, background: palette.bg, color: palette.fg }}
    >
      {initialsOf(name)}
    </span>
  );
}
