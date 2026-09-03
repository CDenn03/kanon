"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;

  showValue?: boolean;

  format?: (value: number) => string;
  className?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  showValue,
  format = (v) => String(v),
  className,
}: SliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-[13px]">
          {label && <label htmlFor={id} className="font-medium text-text">{label}</label>}
          {showValue && <span className="tabular-nums text-text-secondary">{format(value)}</span>}
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("ui-slider w-full", disabled && "cursor-not-allowed opacity-50")}
        style={{
          background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-bg-active) ${pct}%)`,
        }}
      />
    </div>
  );
}
