"use client";

import { useState, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Loader2, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePopoverPosition, useMounted } from "@/hooks";

const button = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-150 select-none",
    "active:scale-[0.97]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent",
    "disabled:pointer-events-none disabled:opacity-60",
    "aria-disabled:pointer-events-none aria-disabled:opacity-60",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-active border border-transparent shadow-accent hover:shadow-accent active:shadow-sm",
        secondary:
          "bg-surface text-text border border-border hover:bg-bg-hover hover:border-border-hover active:bg-bg-active shadow-sm hover:shadow-md active:shadow-sm",
        ghost:
          "bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text active:bg-bg-active border border-transparent",
        destructive:
          "bg-error text-on-error hover:bg-error-hover active:bg-error-hover border border-transparent focus-visible:ring-error shadow-sm hover:shadow-md active:shadow-sm",
        link: "bg-transparent text-accent underline-offset-2 hover:underline p-0 h-auto active:scale-100",
      },
      size: {

        sm: "h-8 min-h-8 px-2.5 text-sm",
        md: "h-10 min-h-10 px-4 text-sm",
        lg: "h-11 min-h-11 px-5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonVariant = NonNullable<VariantProps<typeof button>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof button>["size"]>;

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  children?: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  type?: "button" | "submit" | "reset";
  className?: string;

  ariaLabel?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  disabledReason,
  icon: Icon,
  iconRight: IconR,
  children,
  onClick,
  title,
  type = "button",
  className,
  ariaLabel,
}: ButtonProps) {
  const [showTip, setShowTip] = useState(false);
  const isDisabled = Boolean(disabled) && !loading;
  const explainable = isDisabled && Boolean(disabledReason);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const mounted = useMounted();
  const tipPosition = usePopoverPosition(wrapRef, showTip, {
    align: "center",
    gap: 8,
    minWidth: 140,
    preferredHeight: 60,
  });

  const iconSize = size === "lg" ? 18 : size === "sm" ? 15 : 16;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (explainable) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={() => explainable && setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <button
        type={type}
        disabled={(isDisabled && !explainable) || loading}
        aria-disabled={explainable || undefined}
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        onFocus={() => explainable && setShowTip(true)}
        onBlur={() => setShowTip(false)}
        onClick={handleClick}
        title={!explainable ? title : undefined}
        className={cn(button({ variant, size }), className)}
      >
        {loading && <Loader2 size={14} className="absolute animate-spin" aria-hidden />}
        <span
          className="inline-flex items-center gap-2"
          style={{ opacity: loading ? 0 : 1 }}
        >
          {Icon && <Icon size={iconSize} strokeWidth={2.2} aria-hidden />}
          {children}
          {IconR && <IconR size={iconSize} strokeWidth={2.2} aria-hidden />}
        </span>
      </button>
      {explainable && showTip && tipPosition && mounted &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none z-50 w-max max-w-56 rounded-md bg-surface-dark px-2.5 py-1.5 text-xs leading-snug text-on-dark shadow-lg"
            style={tipPosition.style}
          >
            {disabledReason}
            <span
              className="absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-surface-dark"
              style={tipPosition.placement === "top" ? { bottom: -4 } : { top: -4 }}
            />
          </span>,
          document.body
        )}
    </span>
  );
}
