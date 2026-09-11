import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  FileVideo,
  FileAudio,
  FileCode,
  File as FileIcon,
  type LucideIcon,
} from "lucide-react";

/**
 * Shared, framework-agnostic helpers for the upload components
 * (FileUpload, FileUploadMultiple, PhotoUpload) and DocumentsTable.
 * Pure functions — safe to call during render.
 */

/** Broad file kind used for preview + icon selection. */
export type FileKind = "image" | "document" | "spreadsheet" | "archive" | "video" | "audio" | "code" | "other";

/** Format a byte count as a human-readable size, e.g. `2.4 MB`. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  // No decimals for bytes; one decimal otherwise.
  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`;
}

/** Lowercased extension without the dot (e.g. `pdf`), or `""` when none. */
export function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

const EXT_KIND: Record<string, FileKind> = {
  // documents
  pdf: "document", doc: "document", docx: "document", txt: "document", rtf: "document", md: "document",
  // spreadsheets
  xls: "spreadsheet", xlsx: "spreadsheet", csv: "spreadsheet",
  // images
  png: "image", jpg: "image", jpeg: "image", gif: "image", webp: "image", svg: "image", avif: "image", heic: "image",
  // archives
  zip: "archive", rar: "archive", "7z": "archive", tar: "archive", gz: "archive",
  // media
  mp4: "video", mov: "video", webm: "video", avi: "video", mkv: "video",
  mp3: "audio", wav: "audio", ogg: "audio", m4a: "audio",
  // code
  js: "code", ts: "code", tsx: "code", jsx: "code", json: "code", html: "code", css: "code",
};

/** Classify a file by MIME type first, falling back to its extension. */
export function fileKind(nameOrType: string, mime?: string): FileKind {
  if (mime) {
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    if (mime === "application/pdf") return "document";
    if (mime.includes("spreadsheet") || mime.includes("excel") || mime === "text/csv") return "spreadsheet";
    if (mime.includes("zip") || mime.includes("compressed") || mime.includes("tar")) return "archive";
  }
  return EXT_KIND[fileExtension(nameOrType)] ?? "other";
}

const KIND_ICON: Record<FileKind, LucideIcon> = {
  image: FileImage,
  document: FileText,
  spreadsheet: FileSpreadsheet,
  archive: FileArchive,
  video: FileVideo,
  audio: FileAudio,
  code: FileCode,
  other: FileIcon,
};

/** The lucide icon that represents a file kind. */
export function fileIcon(kind: FileKind): LucideIcon {
  return KIND_ICON[kind];
}

export interface FileConstraints {
  /** Max size per file, in bytes. */
  maxSize?: number;
  /**
   * Accepted types, in the same syntax as the input `accept` attribute:
   * extensions (".pdf"), MIME types ("image/png"), or wildcards ("image/*").
   */
  accept?: string;
}

/**
 * Validate a file against constraints. Returns a human-readable error string
 * ("what + why"), or `null` when the file is acceptable.
 */
export function validateFile(file: File, constraints: FileConstraints = {}): string | null {
  const { maxSize, accept } = constraints;
  if (typeof maxSize === "number" && file.size > maxSize) {
    return `File is too large — max ${formatFileSize(maxSize)}.`;
  }
  if (accept && !matchesAccept(file, accept)) {
    return `File type not allowed — accepted: ${accept}.`;
  }
  return null;
}

/** Whether a file satisfies an `accept` list (extensions, MIME, wildcards). */
export function matchesAccept(file: File, accept: string): boolean {
  const patterns = accept.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean);
  if (patterns.length === 0) return true;
  const type = file.type.toLowerCase();
  const ext = `.${fileExtension(file.name)}`;
  return patterns.some((p) => {
    if (p.startsWith(".")) return ext === p;
    if (p.endsWith("/*")) return type.startsWith(p.slice(0, -1)); // e.g. "image/"
    return type === p;
  });
}
