"use client";

import { useRef, useEffect, useId, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { Field, controlBase, controlClasses } from "./field";

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
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const reactId = useId();
  const areaId = id ?? reactId;
  const messageId = `${areaId}-message`;
  const describedBy = error || hint ? messageId : undefined;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value]);

  const len = (value || "").length;
  const counter = maxLength
    ? { text: `${len}/${maxLength}`, warn: len > maxLength * 0.9 }
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
        onChange={onChange}
        maxLength={maxLength}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={cn(controlBase, controlClasses(error), "resize-y px-3 py-2 leading-relaxed")}
      />
    </Field>
  );
}
