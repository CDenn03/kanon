"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface Step {
  /** Stable id. */
  id: string;
  /** Short step title shown in the indicator. */
  title: string;
  /** Optional one-line description under the title (current step only). */
  description?: string;
  /** The step's content (form fields, etc.). */
  content: ReactNode;
  /**
   * Gate for advancing past this step. Return false to disable Next/Finish
   * (e.g. when the step's fields are invalid). Defaults to allowed.
   */
  canProceed?: boolean;
  /**
   * Whether this step is complete/valid. Drives the green check in the
   * indicator so it reflects actual completion rather than mere position —
   * important when returning to the wizard on a later step, where earlier
   * steps should show green only if their data is still valid. When omitted,
   * falls back to `canProceed`, then to positional completion (before current).
   */
  completed?: boolean;
  /**
   * Reason why canProceed is false. Shown as a tooltip when hovering/focusing
   * the disabled Next/Finish button. Supports multi-line via "\n".
   * Leave undefined when the step is valid.
   */
  disabledReason?: string;
}

interface MultiStepFormProps {
  steps: Step[];
  /** Controlled active step index. Omit to let the component manage it. */
  current?: number;
  /** Notified when the active step changes (both controlled + uncontrolled). */
  onStepChange?: (index: number) => void;
  /** Called when the last step's Finish is pressed. */
  onComplete?: () => void;
  /** Allow clicking a completed step in the indicator to jump back. Default true. */
  allowStepClick?: boolean;
  /** Labels for the navigation buttons. */
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  /** Extra content rendered in the footer, left of the nav buttons. */
  footerStart?: ReactNode;
  className?: string;
}

/**
 * MultiStepForm — an accessible wizard that breaks a long form into ordered
 * steps with a progress indicator and Back/Next/Finish navigation. Advancing
 * can be gated per step via `canProceed`. Can be controlled (`current` +
 * `onStepChange`) or self-managed. Mobile-responsive: the step indicator
 * collapses to a compact "Step x of n" + progress bar on small screens.
 *
 * Grounded in the Mathesis UX books: chunking a long task into steps respects
 * working-memory limits (Miller's Law) and reduces per-screen choices
 * (Hick's Law); a visible progress indicator sets expectations (Doherty).
 */
export function MultiStepForm({
  steps,
  current,
  onStepChange,
  onComplete,
  allowStepClick = true,
  backLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
  footerStart,
  className,
}: MultiStepFormProps) {
  const [internal, setInternal] = useState(0);
  // Track the furthest step the user has reached (for allowing forward navigation)
  const [furthest, setFurthest] = useState(0);
  const active = current ?? internal;
  const clamped = Math.max(0, Math.min(active, steps.length - 1));
  const step = steps[clamped];
  const isFirst = clamped === 0;
  const isLast = clamped === steps.length - 1;
  const canProceed = step?.canProceed ?? true;
  const disabledReason = !canProceed ? step?.disabledReason : undefined;

  // Track the furthest reached step in an effect (never during render).
  useEffect(() => {
    setFurthest((f) => (clamped > f ? clamped : f));
  }, [clamped]);

  /**
   * Check if we can navigate to a given step.
   * - Can always go back to any visited step
   * - Can go forward only if all steps before target are valid
   */
  const canNavigateTo = (targetIndex: number): boolean => {
    if (!allowStepClick) return false;
    if (targetIndex === clamped) return false; // Already here
    
    // Going backward: always allowed to visited steps
    if (targetIndex < clamped) return true;
    
    // Going forward: only if we've been there before AND all intermediate steps are valid
    if (targetIndex > furthest) return false;
    
    // Check all steps from current to target-1 are valid
    for (let i = clamped; i < targetIndex; i++) {
      if (!(steps[i]?.canProceed ?? true)) return false;
    }
    return true;
  };

  const go = (index: number) => {
    const next = Math.max(0, Math.min(index, steps.length - 1));
    if (current === undefined) setInternal(next);
    onStepChange?.(next);
  };

  const onNext = () => {
    if (!canProceed) return;
    if (isLast) onComplete?.();
    else go(clamped + 1);
  };

  if (!step) return null;

  return (
    <div className={cn("w-full", className)}>
      {/* Step indicator — full on ≥sm, compact on mobile. */}
      <ol className="mb-6 hidden items-center sm:flex" aria-label="Progress">
        {steps.map((s, i) => {
          // Green/check reflects completion validity, not mere position: prefer
          // an explicit `completed`, then `canProceed`, then positional (passed).
          const done = s.completed ?? s.canProceed ?? i < clamped;
          const visited = i <= furthest;
          const isCurrent = i === clamped;
          const clickable = canNavigateTo(i);
          return (
            <li key={s.id} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
              <button
                type="button"
                disabled={!clickable}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => clickable && go(i)}
                className={cn(
                  "flex items-center gap-2 rounded-md p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  clickable ? "cursor-pointer hover:bg-bg-hover" : "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    done && !isCurrent && "border-accent bg-accent text-on-accent",
                    isCurrent && "border-accent text-accent",
                    !done && !isCurrent && visited && "border-accent-muted text-accent",
                    !done && !isCurrent && !visited && "border-border text-text-tertiary"
                  )}
                >
                  {done && !isCurrent ? <Check size={14} aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-text" : done ? "text-text-secondary" : visited ? "text-text-secondary" : "text-text-tertiary"
                  )}
                >
                  {s.title}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span className={cn("mx-2 h-px flex-1 transition-colors", done ? "bg-accent" : "bg-border")} aria-hidden />
              )}
            </li>
          );
        })}
      </ol>

      {/* Compact mobile indicator */}
      <div className="mb-5 sm:hidden">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-text">
            Step {clamped + 1} of {steps.length}
          </span>
          <span className="text-text-secondary">{step.title}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-active">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${((clamped + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current step */}
      <div>
        <h3 className="text-base font-semibold text-text">{step.title}</h3>
        {step.description && <p className="mt-0.5 text-sm text-text-secondary">{step.description}</p>}
        <div className="mt-4">{step.content}</div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
        {footerStart}
        <div className="ml-auto flex items-center gap-2">
          {!isFirst && (
            <Button variant="secondary" icon={ChevronLeft} onClick={() => go(clamped - 1)}>
              {backLabel}
            </Button>
          )}
          <Button
            iconRight={isLast ? undefined : ChevronRight}
            icon={isLast ? Check : undefined}
            disabled={!canProceed}
            disabledReason={disabledReason}
            onClick={onNext}
          >
            {isLast ? finishLabel : nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
