"use client";

import { useRef, type ChangeEvent } from "react";
import { UploadCloud, CheckCircle2, Clock, AlertCircle, X, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize, fileKind, fileIcon, validateFile, type FileConstraints } from "@/lib/upload";
import type { UploadStatus } from "./file-upload";

/** State of one requested document. */
export type RequestState = "missing" | "uploading" | "uploaded" | "rejected";

/** A predefined document the user is required (or asked) to provide. */
export interface DocumentRequest {
  id: string;
  /** What to upload, e.g. "National ID (front)". */
  name: string;
  /** Optional guidance shown under the name. */
  description?: string;
  required?: boolean;
  /** Accepted types for this row (extensions/MIME/wildcards). */
  accept?: string;
  /** Max size in bytes for this row. */
  maxSize?: number;
  /** Current state (controlled by the parent). */
  state?: RequestState;
  /** The uploaded file, when state is "uploading"/"uploaded". */
  file?: File | null;
  /** Upload progress 0–100 while uploading. */
  progress?: number;
  /** Error/rejection reason when state is "rejected". */
  error?: string;
}

interface DocumentRequestListProps {
  title?: string;
  requests: DocumentRequest[];
  /** Called with a valid file for a given request row. */
  onUpload?: (requestId: string, file: File) => void;
  /** Called to clear an uploaded file for a row. */
  onRemove?: (requestId: string) => void;
  /** Called to preview/view an uploaded file. Omit to hide the view button. */
  onView?: (request: DocumentRequest) => void;
  /** Called when a file fails validation for a row. */
  onError?: (requestId: string, message: string) => void;
  disabled?: boolean;
}

const STATE_META: Record<RequestState, { label: string; icon: typeof CheckCircle2; className: string; spin?: boolean }> = {
  missing: { label: "Not uploaded", icon: Clock, className: "text-text-tertiary" },
  uploading: { label: "Uploading", icon: Loader2, className: "text-text-secondary", spin: true },
  uploaded: { label: "Uploaded", icon: CheckCircle2, className: "text-accent" },
  rejected: { label: "Needs attention", icon: AlertCircle, className: "text-error" },
};

/**
 * DocumentRequestList — a predefined checklist of documents to provide, each
 * row with its own upload control, status, and preview. Use it for onboarding /
 * KYC / application flows where the set of required files is known upfront.
 * Rows stack responsively on small screens. Presentational: the parent owns the
 * requests and drives per-row state/progress via callbacks.
 */
export function DocumentRequestList({
  title,
  requests,
  onUpload,
  onRemove,
  onView,
  onError,
  disabled,
}: DocumentRequestListProps) {
  const uploaded = requests.filter((r) => r.state === "uploaded").length;
  const requiredCount = requests.filter((r) => r.required).length;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {(title || requiredCount > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          {title && <h3 className="text-sm font-semibold text-text">{title}</h3>}
          <span className="text-xs tabular-nums text-text-secondary">
            {uploaded}/{requests.length} uploaded
          </span>
        </div>
      )}

      <ul className="divide-y divide-border">
        {requests.map((req) => (
          <li key={req.id}>
            <RequestRow
              request={req}
              disabled={disabled}
              onUpload={onUpload}
              onRemove={onRemove}
              onView={onView}
              onError={onError}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RequestRow({
  request,
  disabled,
  onUpload,
  onRemove,
  onView,
  onError,
}: {
  request: DocumentRequest;
  disabled?: boolean;
  onUpload?: (id: string, file: File) => void;
  onRemove?: (id: string) => void;
  onView?: (r: DocumentRequest) => void;
  onError?: (id: string, message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const state: RequestState = request.state ?? (request.file ? "uploaded" : "missing");
  const meta = STATE_META[state];
  const StatusIcon = meta.icon;

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const constraints: FileConstraints = { accept: request.accept, maxSize: request.maxSize };
    const message = validateFile(file, constraints);
    if (message) {
      onError?.(request.id, message);
      return;
    }
    onUpload?.(request.id, file);
  };

  const open = () => !disabled && inputRef.current?.click();

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 sm:flex-row sm:items-center",
        state === "rejected" && "bg-error-light"
      )}
    >
      {/* Requirement label */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-text">{request.name}</p>
          {request.required && (
            <span className="shrink-0 rounded bg-bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              Required
            </span>
          )}
        </div>
        {request.description && <p className="mt-0.5 text-xs text-text-secondary">{request.description}</p>}

        {/* Uploaded file line */}
        {request.file && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-text-tertiary">
            <FileGlyph name={request.file.name} type={request.file.type} />
            <span className="truncate">{request.file.name}</span>
            <span className="tabular-nums">· {formatFileSize(request.file.size)}</span>
          </div>
        )}
        {state === "rejected" && request.error && (
          <p className="mt-1 text-xs text-error" aria-live="polite">{request.error}</p>
        )}
        {state === "uploading" && (
          <p className="mt-1 text-xs tabular-nums text-text-secondary" aria-live="polite">
            Uploading… {Math.round(request.progress ?? 0)}%
          </p>
        )}
      </div>

      {/* Status */}
      <span className={cn("flex shrink-0 items-center gap-1.5 text-xs font-medium sm:w-36", meta.className)}>
        <StatusIcon size={14} className={cn(meta.spin && "animate-spin")} aria-hidden />
        {meta.label}
      </span>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={request.accept}
          disabled={disabled || state === "uploading"}
          onChange={onPick}
          className="sr-only"
          aria-label={`Upload ${request.name}`}
        />
        {state === "uploaded" || state === "rejected" ? (
          <>
            {onView && request.file && state === "uploaded" && (
              <button
                type="button"
                onClick={() => onView(request)}
                aria-label={`View ${request.name}`}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text transition-colors hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Eye size={14} aria-hidden />
                View
              </button>
            )}
            <button
              type="button"
              onClick={open}
              disabled={disabled}
              className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text transition-colors hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(request.id)}
                disabled={disabled}
                aria-label={`Remove ${request.name}`}
                className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-bg-hover hover:text-error disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X size={15} aria-hidden />
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={open}
            disabled={disabled || state === "uploading"}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-colors hover:border-border-hover hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {state === "uploading" ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <UploadCloud size={14} aria-hidden />
            )}
            Upload
          </button>
        )}
      </div>
    </div>
  );
}

function FileGlyph({ name, type }: { name: string; type?: string }) {
  const Icon = fileIcon(fileKind(name, type));
  return <Icon size={13} className="shrink-0" aria-hidden />;
}
