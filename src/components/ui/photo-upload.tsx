"use client";

import { useState, useRef, useEffect, useId, type DragEvent, type ChangeEvent } from "react";
import { ImagePlus, Camera, X, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize, validateFile, matchesAccept, type FileConstraints } from "@/lib/upload";
import type { UploadStatus } from "./file-upload";
import { Field } from "./field";
import { ImageCropModal } from "./image-crop-modal";

/** Preview frame shape. */
export type PhotoVariant = "square" | "avatar" | "cover";

interface PhotoUploadProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** Frame shape: square thumbnail, circular avatar, or wide cover banner. */
  variant?: PhotoVariant;
  /** Accepted image types. Defaults to `image/*`. */
  accept?: string;
  /** Max size in bytes. */
  maxSize?: number;
  /** Selected image file (controlled), or `null`. */
  value?: File | null;
  /** Existing image URL to show when there is no freshly-selected file (e.g. a saved avatar). */
  previewUrl?: string;
  /** Called with a valid image, or `null` when removed. */
  onSelect?: (file: File | null) => void;
  /** Called when a file fails validation. */
  onError?: (message: string) => void;
  status?: UploadStatus;
  progress?: number;
  /**
   * Enable an optional crop step: after selecting a valid image, a cropper
   * opens and `onSelect` receives the cropped image. The crop is locked to the
   * variant's aspect by default (avatar/square = 1:1, cover = 3:1).
   */
  crop?: boolean;
  /** Override the crop aspect ratio (width / height). Defaults from `variant`. */
  cropAspect?: number;
  /** Minimum cropped width in source pixels (blocks tiny crops). */
  cropMinWidth?: number;
}

const FRAME: Record<PhotoVariant, string> = {
  square: "size-32 rounded-xl",
  avatar: "size-28 rounded-full",
  cover: "h-40 w-full rounded-xl",
};

const VARIANT_ASPECT: Record<PhotoVariant, number> = {
  square: 1,
  avatar: 1,
  cover: 3,
};

/**
 * PhotoUpload — image-only picker with a live thumbnail preview. Supports a
 * square, circular avatar, or wide cover frame; drag-and-drop and click; an
 * optional crop step; and an uploading overlay. Presentational: wire uploads
 * via `onSelect` + `status`.
 */
export function PhotoUpload({
  id,
  label,
  hint,
  error,
  required,
  disabled,
  variant = "square",
  accept = "image/*",
  maxSize,
  value,
  previewUrl,
  onSelect,
  onError,
  status = "idle",
  progress = 0,
  crop = false,
  cropAspect,
  cropMinWidth,
}: PhotoUploadProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const messageId = `${inputId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const shownError = error ?? internalError ?? undefined;
  const constraints: FileConstraints = { accept, maxSize };
  const preview = objectUrl ?? (value ? null : previewUrl ?? null);
  const effectiveAspect = cropAspect ?? VARIANT_ASPECT[variant];

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
  }, [value]);

  const accept_file = (file: File) => {
    // Guard against non-images even if the OS dialog allowed them.
    if (!matchesAccept(file, accept)) {
      const msg = "That file isn’t an image — choose a PNG, JPG, or WEBP.";
      setInternalError(msg);
      onError?.(msg);
      return;
    }
    const message = validateFile(file, constraints);
    if (message) {
      setInternalError(message);
      onError?.(message);
      return;
    }
    setInternalError(null);
    if (crop) {
      // Open the cropper; the cropped file is committed on confirm.
      setCropSrc(URL.createObjectURL(file));
    } else {
      onSelect?.(file);
    }
  };

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const onCropConfirm = (file: File) => {
    onSelect?.(file);
    closeCrop();
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) accept_file(file);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) accept_file(file);
  };

  const openPicker = () => !disabled && status !== "uploading" && inputRef.current?.click();
  const uploading = status === "uploading";

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

      <div className={cn("flex items-start gap-4", variant === "cover" && "flex-col")}>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={label ? `Upload ${label}` : "Upload photo"}
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
            if (!disabled && !uploading) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "group relative flex shrink-0 items-center justify-center overflow-hidden border border-dashed bg-bg-secondary transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            FRAME[variant],
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-border-hover",
            dragOver && !disabled && "border-accent bg-accent-light",
            shownError && "border-error",
            preview && "border-solid"
          )}
        >
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="size-full object-cover" />
              {!disabled && !uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-overlay opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={20} className="text-on-dark" aria-hidden />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 px-2 text-center">
              <ImagePlus size={22} className={cn(dragOver ? "text-accent" : "text-text-tertiary")} aria-hidden />
              {variant === "cover" && <span className="text-xs text-text-secondary">Click or drag an image</span>}
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-overlay" aria-live="polite">
              <Loader2 size={20} className="animate-spin text-on-dark" aria-hidden />
              <span className="sr-only">Uploading {Math.round(progress)}%</span>
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1.5 pt-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openPicker}
              disabled={disabled || uploading}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text transition-colors hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {preview ? "Replace" : "Upload"}
            </button>
            {preview && !disabled && !uploading && (
              <button
                type="button"
                onClick={() => {
                  setInternalError(null);
                  onSelect?.(null);
                }}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-text-secondary transition-colors hover:bg-bg-hover hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X size={14} aria-hidden />
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-text-tertiary">
            {accept === "image/*" ? "PNG, JPG, GIF, WEBP" : accept}
            {maxSize ? ` · up to ${formatFileSize(maxSize)}` : ""}
          </p>
          {value && <p className="truncate text-xs text-text-secondary">{value.name}</p>}
          {preview && !uploading && !shownError && (
            <p className="flex items-center gap-1 text-xs font-medium text-accent">
              <CheckCircle2 size={13} aria-hidden />
              {status === "complete" ? "Uploaded" : value ? "Added" : "Current photo"}
            </p>
          )}
        </div>
      </div>

      {crop && cropSrc && (
        <ImageCropModal
          open
          imageSrc={cropSrc}
          aspect={effectiveAspect}
          circular={variant === "avatar"}
          minWidth={cropMinWidth}
          outputName={value?.name ?? "cropped.png"}
          onConfirm={onCropConfirm}
          onCancel={closeCrop}
        />
      )}
    </Field>
  );
}
