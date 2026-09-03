"use client";

import { useState, useId, type ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, controlBase, controlClasses } from "./field";

interface InputProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: string;
  suffix?: string;
  type?: string;
  numeric?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;

  autoComplete?: string;
}

export function Input({
  id,
  label,
  hint,
  error,
  required,
  disabled,
  readOnly,
  prefix,
  suffix,
  type = "text",
  numeric,
  placeholder,
  value,
  onChange,
  autoComplete,
}: InputProps) {
  const [reveal, setReveal] = useState(false);
  const isPw = type === "password";
  const reactId = useId();
  const inputId = id ?? reactId;
  const messageId = `${inputId}-message`;
  const describedBy = error || hint ? messageId : undefined;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={inputId}
      messageId={messageId}
    >
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-2.5 text-sm text-text-tertiary">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type={isPw && reveal ? "text" : type}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            controlBase,
            controlClasses(error, disabled, readOnly),
            "h-10",
            prefix ? "pl-7" : "pl-3",
            suffix || isPw ? "pr-9" : "pr-3",
            numeric && "text-right tabular-nums"
          )}
        />
        {isPw ? (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="absolute right-2 rounded p-1 text-text-tertiary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {reveal ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
          </button>
        ) : suffix ? (
          <span className="pointer-events-none absolute right-3 text-sm text-text-tertiary">
            {suffix}
          </span>
        ) : null}
      </div>
    </Field>
  );
}
