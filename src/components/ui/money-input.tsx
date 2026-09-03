"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Field, controlBase, controlClasses } from "./field";

function sanitizeMoney(raw: string, allowNegative: boolean, decimals: number): string {
  let s = raw.replace(allowNegative ? /[^0-9.-]/g : /[^0-9.]/g, "");
  if (allowNegative) {
    const negative = s.startsWith("-");
    s = s.replace(/-/g, "");
    if (negative) s = "-" + s;
  }
  const dot = s.indexOf(".");
  if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "");
  if (decimals === 0) s = s.split(".")[0];
  else if (dot !== -1) {
    const [i, f = ""] = s.split(".");
    s = i + "." + f.slice(0, decimals);
  }
  return s;
}

function moneyToNumber(s: string): number | null {
  if (s === "" || s === "-" || s === ".") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Group the integer part of a sanitized numeric string with locale
 * thousand separators, preserving a trailing "." and any typed fraction
 * digits (including trailing zeros) exactly as entered.
 *
 * Examples (en-KE / en-US grouping):
 *   "1234"     -> "1,234"
 *   "1234."    -> "1,234."
 *   "1234.5"   -> "1,234.5"
 *   "-1234.50" -> "-1,234.50"
 */
function groupMoney(s: string, locale: string): string {
  if (s === "" || s === "-") return s;

  const negative = s.startsWith("-");
  const unsigned = negative ? s.slice(1) : s;

  const dot = unsigned.indexOf(".");
  const intPart = dot === -1 ? unsigned : unsigned.slice(0, dot);
  const hasDot = dot !== -1;
  const fracPart = hasDot ? unsigned.slice(dot + 1) : "";

  const groupedInt =
    intPart === ""
      ? ""
      : Number(intPart).toLocaleString(locale, { useGrouping: true, maximumFractionDigits: 0 });

  let out = groupedInt;
  if (hasDot) out += "." + fracPart;
  if (negative) out = "-" + out;
  return out;
}

/** Count digits in a string up to (not including) index `pos`. */
function digitsBefore(s: string, pos: number): number {
  let n = 0;
  for (let i = 0; i < pos && i < s.length; i++) {
    if (s[i] >= "0" && s[i] <= "9") n++;
  }
  return n;
}

/** Find the string index just after the `count`-th digit. */
function indexAfterDigits(s: string, count: number): number {
  if (count <= 0) {
    // Place caret before the first digit (after an optional leading "-").
    return s.startsWith("-") ? 1 : 0;
  }
  let seen = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] >= "0" && s[i] <= "9") {
      seen++;
      if (seen === count) return i + 1;
    }
  }
  return s.length;
}

interface MoneyInputProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  currency?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  decimals?: number;
  allowNegative?: boolean;
  max?: number;
  min?: number;
  locale?: string;
}

export function MoneyInput({
  id,
  label,
  hint,
  error,
  disabled,
  readOnly,
  placeholder = "0.00",
  currency,
  value,
  onChange,
  decimals = 2,
  allowNegative = false,
  max,
  min,
  locale = "en-KE",
}: MoneyInputProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const format = (n: number | null) =>
    n === null || Number.isNaN(n)
      ? ""
      : n.toLocaleString(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });

  // While editing, show the grouped draft (thousand separators applied
  // live); otherwise show the fully formatted value.
  const display = editing ? groupMoney(draft, locale) : format(value);

  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <div className="relative flex items-center">
        {currency && (
          <span className="pointer-events-none absolute left-3 text-sm text-text-tertiary">
            {currency}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          inputMode="decimal"
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={display}
          aria-invalid={Boolean(error) || undefined}
          onFocus={() => {
            setEditing(true);
            setDraft(value === null ? "" : String(value));
          }}
          onChange={(e) => {
            const el = e.target;
            const prevGrouped = el.value;
            const caret = el.selectionStart ?? prevGrouped.length;
            // Digits before the caret drive where the caret should land
            // after re-grouping (separators are ignored in the count).
            const digitsLeft = digitsBefore(prevGrouped, caret);

            const cleaned = sanitizeMoney(prevGrouped, allowNegative, decimals);
            setDraft(cleaned);
            onChange(moneyToNumber(cleaned));

            const grouped = groupMoney(cleaned, locale);
            const nextCaret = indexAfterDigits(grouped, digitsLeft);
            // Restore caret after React writes the grouped value.
            requestAnimationFrame(() => {
              const node = inputRef.current;
              if (node) node.setSelectionRange(nextCaret, nextCaret);
            });
          }}
          onBlur={() => {
            setEditing(false);
            let n = moneyToNumber(draft);
            if (n !== null) {
              if (typeof max === "number") n = Math.min(n, max);
              if (typeof min === "number") n = Math.max(n, min);
            }
            onChange(n);
          }}
          className={cn(
            controlBase,
            controlClasses(error, disabled, readOnly),
            "h-10 tabular-nums text-right pr-3",
            currency ? "pl-12" : "pl-3"
          )}
        />
      </div>
    </Field>
  );
}
