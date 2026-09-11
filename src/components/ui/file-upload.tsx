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
import { Field } from "./field";
import { Progress } from "./progress";

/** Upload lifecycle for the selected file, controlled by the parent. */
export type UploadStatus = "idle" | "uploading" | "complete" | "error";

interface FileUploadProps {
  id?: string;
  label?: string;
  hint?: string;
  /** External error (e.g. server rejection). Overrides internal validation error. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** `accept` list — extensions, MIME types, or wildcards (e.g. `.pdf,image/*`). */
  accept?: string;
  /** Max size per file, in bytes. Shown as a constraint and enforced on select. */
  maxSize?: number;
  /** The currently selected file (controlled). Pass `null` for empty. */
  value?: File | null;
  /** Called with a valid file, or `null` when removed. */
  onSelect?: (file: File | null) => void;
  /** Called when a file fails validation, with the reason. */
  onError?: (message: string) => void;
  /** Upload lifecycle state, driven by the parent's upload logic. */
  status?: UploadStatus;
  /** Upload progress 0–100 (only meaningful while `status === "uploading"`). */
  progress?: number;
}

/**
 * FileUpload — single-file drag-and-drop + click picker with a type-aware
 * preview (image thumbnail or file icon + name/size), validation, progress and
 * error states. Presentational: wire the actual upload via `onSelect` and drive
 * `status`/`progress` from the parent.
 */
export function FileUpload({
  id,
  label,
  hint,
  error,
  required,
  disabled,
  accept,
  maxSize,
  value,
  onSelect,
  onError,
  status = "idle",
  progress = 0,
}: FileUploadProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const messageId = `${inputId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);

  const shownError = error ?? internalError ?? undefined;
  const constraints: FileConstraints = { accept, maxSize };

  // Build (and revoke) an object URL for image previews.
  useEffect(() => {
    if (value && fileKind(value.name, value.type) === "image") {
      const url = URL.createObjectURL(value);
      setThumb(url);
      return () => URL.revokeObjectURL(url);
    }
    setThumb(null);
  }, [value]);

  const accept_file = (file: File) => {
    const message = validateFile(file, constraints);
    if (message) {
      setInternalError(message);
      onError?.(message);
      return;
    }
    setInternalError(null);
    onSelect?.(file);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) accept_file(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) accept_file(file);
  };

  const remove = () => {
    setInternalError(null);
    onSelect?.(null);
  };

  const openPicker = () => !disabled && inputRef.current?.click();

  return (
    <Field label={label} hint={hint} error={shownError} required={required} htmlFor={inputId} messageId={messageId}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={onInputChange}
        className="sr-only"
        aria-describedby={messageId}
      />

      {!value ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={label ? `Upload ${label}` : "Upload file"}
          aria-disabled={disabled || undefined}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            disabled
              ? "cursor-not-allowed border-border bg-bg-secondary opacity-60"
              : "cursor-pointer border-border hover:border-border-hover hover:bg-bg-hover",
            dragOver && !disabled && "border-accent bg-accent-light",
            shownError && "border-error"
          )}
        >
          <UploadCloud
            size={24}
            className={cn("transition-colors", dragOver ? "text-accent" : "text-text-tertiary")}
            aria-hidden
          />
          <div className="text-sm text-text">
            <span className="font-medium text-accent">Click to browse</span>{" "}
            <span className="text-text-secondary">or drag and drop</span>
          </div>
          {(accept || maxSize) && (
            <p className="text-xs text-text-tertiary">
              {accept ? accept : "Any file"}
              {maxSize ? ` · up to ${formatFileSize(maxSize)}` : ""}
            </p>
          )}
        </div>
      ) : (
        <FilePreview
          file={value}
          thumb={thumb}
          status={status}
          progress={progress}
          error={Boolean(shownError)}
          disabled={disabled}
          onRemove={remove}
        />
      )}
    </Field>
  );
}

/** Preview row: image thumbnail or type icon + name/size, with progress/state. */
function FilePreview({
  file,
  thumb,
  status,
  progress,
  error,
  disabled,
  onRemove,
}: {
  file: File;
  thumb: string | null;
  status: UploadStatus;
  progress: number;
  error: boolean;
  disabled?: boolean;
  onRemove: () => void;
}) {
  const kind = fileKind(file.name, file.type);
  const Icon = fileIcon(kind);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3",
        error ? "border-error bg-error-light" : "border-border bg-surface"
      )}
    >
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg-secondary">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="size-full object-cover" />
        ) : (
          <Icon size={20} className="text-text-secondary" aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-text">{file.name}</p>
          {(status === "complete" || status === "idle") && !error && (
            <CheckCircle2 size={15} className="shrink-0 text-accent" aria-hidden />
          )}
          {(status === "error" || error) && (
            <AlertCircle size={15} className="shrink-0 text-error" aria-hidden />
          )}
        </div>
        <p className="text-xs tabular-nums text-text-tertiary">
          {formatFileSize(file.size)}
          {status === "uploading"
            ? ` · ${Math.round(progress)}%`
            : status === "complete"
              ? " · Uploaded"
              : !error
                ? " · Ready to upload"
                : ""}
        </p>
        {status === "uploading" && (
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
          <X size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
