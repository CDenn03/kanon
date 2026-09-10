"use client";

import { useRef, useEffect, useId, useCallback, type ChangeEvent, type FocusEvent } from "react";
import { cn } from "@/lib/utils";
import { Field, controlBase, controlClasses } from "./field";
import { enforceInputRule, formatOnBlur, type InputRule } from "@/lib/validation";

interface TextareaProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * Keystroke/blur validation rule (same model as `Input`). Strips disallowed
   * characters and caps length on change; pretty-prints via `rule.format` on
   * blur. See `@/lib/validation`.
   */
  rule?: InputRule;
}

export function Textarea({
  id,
  label,
  hint,
  error,
  required,
  placeholder,
  maxLength,
  rows = 3,
  value,
  onChange,
  onBlur,
  rule,
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const reactId = useId();
  const areaId = id ?? reactId;
  const messageId = `${areaId}-message`;
  const describedBy = error || hint ? messageId : undefined;
  const effectiveMaxLength = maxLength ?? rule?.maxLength;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (rule) {
        const enforced = enforceInputRule(event.target.value, rule);
        if (enforced !== event.target.value) event.target.value = enforced;
      }
      onChange?.(event);
    },
    [rule, onChange]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      if (rule?.format) {
        const formatted = formatOnBlur(rule.format, event.target.value);
        if (formatted !== event.target.value) {
          event.target.value = formatted;
          onChange?.(event as unknown as ChangeEvent<HTMLTextAreaElement>);
        }
      }
      onBlur?.(event);
    },
    [rule, onChange, onBlur]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value]);

  const len = (value || "").length;
  const counter = effectiveMaxLength
    ? { text: `${len}/${effectiveMaxLength}`, warn: len > effectiveMaxLength * 0.9 }
    : undefined;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={areaId}
      counter={counter}
      messageId={messageId}
    >
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={effectiveMaxLength}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={cn(controlBase, controlClasses(error), "resize-y px-3 py-2 leading-relaxed")}
      />
    </Field>
  );
}
