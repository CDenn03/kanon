"use client";

import { useState, useRef, useEffect, useId, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatFileSize,
  fileKind,
  fileIcon,
  validateFile,
  type FileConstraints,
} from "@/lib/upload";
import type { UploadStatus } from "./file-upload";
import { Field } from "./field";
import { Progress } from "./progress";

/**
 * One tracked upload. The parent owns the list and updates `status`/`progress`/
 * `error` per item as its upload logic runs.
 */
export interface UploadItem {
  /** Stable id (e.g. crypto.randomUUID()). */
  id: string;
  file: File;
  status?: UploadStatus;
  progress?: number;
  error?: string;
}

interface FileUploadMultipleProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  /** Max size per file, in bytes. */
  maxSize?: number;
  /** Max number of files. Extra dropped files are rejected via `onReject`. */
  maxFiles?: number;
  /** Current items (controlled). */
  items: UploadItem[];
  /** Called with the newly accepted files to append. */
  onAdd?: (files: File[]) => void;
  /** Called to remove an item by id. */
  onRemove?: (id: string) => void;
  /** Called when files are rejected, with per-file reasons. */
  onReject?: (rejections: { file: File; reason: string }[]) => void;
}

/**
 * FileUploadMultiple — drag-and-drop + click picker for many files. Each file
 * gets its own row with a type-aware preview, per-file progress, and per-file
 * error. The drop zone stays visible so users can keep adding files.
 * Presentational: the parent owns `items` and drives status/progress.
 */
export function FileUploadMultiple({
  id,
  label,
  hint,
  error,
  required,
  disabled,
  accept,
  maxSize,
  maxFiles,
  items,
  onAdd,
  onRemove,
  onReject,
}: FileUploadMultipleProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const messageId = `${inputId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const constraints: FileConstraints = { accept, maxSize };
  const atLimit = typeof maxFiles === "number" && items.length >= maxFiles;

  const intake = (files: File[]) => {
    const accepted: File[] = [];
    const rejected: { file: File; reason: string }[] = [];
    let remaining = typeof maxFiles === "number" ? maxFiles - items.length : Infinity;

    for (const file of files) {
      if (remaining <= 0) {
        rejected.push({ file, reason: `Too many files — max ${maxFiles}.` });
        continue;
      }
      const message = validateFile(file, constraints);
      if (message) {
        rejected.push({ file, reason: message });
      } else {
        accepted.push(file);
        remaining -= 1;
      }
    }
    if (accepted.length) onAdd?.(accepted);
    if (rejected.length) onReject?.(rejected);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) intake(Array.from(e.target.files));
    e.target.value = "";
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || atLimit) return;
    if (e.dataTransfer.files) intake(Array.from(e.dataTransfer.files));
  };

  const openPicker = () => !disabled && !atLimit && inputRef.current?.click();

  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId} messageId={messageId}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple
        accept={accept}
        disabled={disabled}
        onChange={onInputChange}
        className="sr-only"
        aria-describedby={messageId}
      />

      <div className="space-y-3">
        <div
          role="button"
          tabIndex={disabled || atLimit ? -1 : 0}
          aria-label={label ? `Upload ${label}` : "Upload files"}
          aria-disabled={disabled || atLimit || undefined}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !atLimit) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            disabled || atLimit
              ? "cursor-not-allowed border-border bg-bg-secondary opacity-60"
              : "cursor-pointer border-border hover:border-border-hover hover:bg-bg-hover",
            dragOver && !disabled && !atLimit && "border-accent bg-accent-light",
            error && "border-error"
          )}
        >
          <UploadCloud size={24} className={cn("transition-colors", dragOver ? "text-accent" : "text-text-tertiary")} aria-hidden />
          <div className="text-sm text-text">
            <span className="font-medium text-accent">Click to browse</span>{" "}
            <span className="text-text-secondary">or drag and drop</span>
          </div>
          <p className="text-xs text-text-tertiary">
            {accept ? accept : "Any file"}
            {maxSize ? ` · up to ${formatFileSize(maxSize)}` : ""}
            {maxFiles ? ` · ${items.length}/${maxFiles} files` : ""}
          </p>
        </div>

        {items.length > 0 && (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <UploadRow item={item} disabled={disabled} onRemove={() => onRemove?.(item.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Field>
  );
}

function UploadRow({ item, disabled, onRemove }: { item: UploadItem; disabled?: boolean; onRemove: () => void }) {
  const { file, status = "idle", progress = 0, error } = item;
  const kind = fileKind(file.name, file.type);
  const Icon = fileIcon(kind);
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    if (kind === "image") {
      const url = URL.createObjectURL(file);
      setThumb(url);
      return () => URL.revokeObjectURL(url);
    }
    setThumb(null);
  }, [file, kind]);

  const failed = Boolean(error) || status === "error";

  return (
    <div className={cn("flex items-center gap-3 rounded-lg border p-2.5", failed ? "border-error bg-error-light" : "border-border bg-surface")}>
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-bg-secondary">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="size-full object-cover" />
        ) : (
          <Icon size={18} className="text-text-secondary" aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-text">{file.name}</p>
          {(status === "complete" || status === "idle") && !failed && (
            <CheckCircle2 size={14} className="shrink-0 text-accent" aria-hidden />
          )}
          {failed && <AlertCircle size={14} className="shrink-0 text-error" aria-hidden />}
        </div>
        {failed ? (
          <p className="text-xs text-error" aria-live="polite">{error ?? "Upload failed."}</p>
        ) : (
          <p className="text-xs tabular-nums text-text-tertiary">
            {formatFileSize(file.size)}
            {status === "uploading"
              ? ` · ${Math.round(progress)}%`
              : status === "complete"
                ? " · Uploaded"
                : " · Ready to upload"}
          </p>
        )}
        {status === "uploading" && !failed && (
          <div className="mt-1.5" aria-live="polite">
            <Progress value={progress} />
          </div>
        )}
      </div>

      {!disabled && status !== "uploading" && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${file.name}`}
          className="shrink-0 rounded-md p-1 text-text-tertiary transition-colors hover:bg-bg-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X size={15} aria-hidden />
        </button>
      )}
    </div>
  );
}
