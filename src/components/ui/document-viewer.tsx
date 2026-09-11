"use client";

import { useState, useEffect } from "react";
import { Download, FileQuestion, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize, fileKind, fileIcon, fileExtension } from "@/lib/upload";

interface DocumentViewerProps {
  /** A File to preview (client-side). Takes precedence over `src`. */
  file?: File | null;
  /** A URL to preview (e.g. a stored document). */
  src?: string;
  /** File name (drives the type when previewing by `src`). */
  name?: string;
  /** MIME type hint (optional; inferred from name/File otherwise). */
  type?: string;
  /** Download URL/name for the fallback + toolbar. Defaults to `src`/file name. */
  downloadUrl?: string;
  /** Max preview height (mobile-responsive). Defaults to a sensible viewport-relative cap. */
  maxHeight?: number | string;
  className?: string;
}

/**
 * DocumentViewer — a responsive, type-aware preview for a document. Renders
 * images inline, PDFs in an embedded frame, CSV/Excel (.xlsx/.xls) spreadsheets
 * as a bordered table, Markdown and Word (.docx) as formatted prose, JSON
 * pretty-printed, plain text as a code block, and video/audio with native
 * controls; anything else shows a file card with a download action. Works with
 * a `File` (client) or a `src` URL.
 *
 * Heavy parsers are lazy-loaded via dynamic import only when their type is
 * actually previewed, so they never enter the bundle otherwise: `xlsx` (Excel),
 * `mammoth` (Word → HTML), `marked` (Markdown → HTML). Markdown/Word HTML is
 * sanitized with `dompurify` before rendering. Large files (>8MB) skip inline
 * parsing and offer a download; tables are capped at 500 rows. If an optional
 * parser package isn't installed, that type falls back to the download card.
 */
export function DocumentViewer({
  file,
  src,
  name,
  type,
  downloadUrl,
  maxHeight = "min(70vh, 640px)",
  className,
}: DocumentViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [rows, setRows] = useState<string[][] | null>(null);
  const [loading, setLoading] = useState(false);
  const [tooLarge, setTooLarge] = useState(false);

  const resolvedName = file?.name ?? name ?? "document";
  const resolvedType = file?.type ?? type ?? "";
  const kind = fileKind(resolvedName, resolvedType);
  const ext = fileExtension(resolvedName);
  const isCsv = ext === "csv" || resolvedType === "text/csv";
  const isExcel = ext === "xlsx" || ext === "xls" || resolvedType.includes("spreadsheet") || resolvedType.includes("excel");
  const isMarkdown = ext === "md" || ext === "markdown" || resolvedType === "text/markdown";
  const isDocx = ext === "docx" || resolvedType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isJson = ext === "json" || resolvedType === "application/json";
  const isPlainText = !isMarkdown && !isJson && (kind === "code" || ext === "txt" || resolvedType.startsWith("text/"));
  const isMedia = kind === "video" || kind === "audio";
  const url = objectUrl ?? src ?? undefined;
  const download = downloadUrl ?? url;

  // Guard: skip heavy inline parsing for very large files.
  const parseByteLimit = 8 * 1024 * 1024;

  // Build an object URL for a File.
  useEffect(() => {
    if (file) {
      const u = URL.createObjectURL(file);
      setObjectUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setObjectUrl(null);
  }, [file]);

  // Load + parse content for the inline renderers. Heavy parsers (SheetJS,
  // mammoth, marked) are lazy-loaded only when their type is actually
  // previewed, so they never enter the bundle otherwise.
  useEffect(() => {
    let cancelled = false;
    setText(null);
    setHtml(null);
    setRows(null);
    setTooLarge(false);

    const needsParse = isCsv || isExcel || isMarkdown || isDocx || isJson || isPlainText;
    if (!needsParse || (!file && !src)) return;

    if (file && file.size > parseByteLimit) {
      setTooLarge(true);
      return;
    }

    setLoading(true);
    const run = async () => {
      try {
        if (isExcel) {
          const XLSX = await import("xlsx");
          const buf = file ? await file.arrayBuffer() : await fetch(src!).then((r) => r.arrayBuffer());
          const wb = XLSX.read(buf, { type: "array" });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const aoa = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, blankrows: false, defval: "" });
          if (!cancelled) setRows(aoa.map((r) => r.map((c) => String(c ?? ""))).slice(0, 500));
        } else if (isDocx) {
          // Word → HTML via mammoth, then sanitize before rendering.
          const [mammoth, DOMPurify] = await Promise.all([
            import("mammoth"),
            import("dompurify"),
          ]);
          const buf = file ? await file.arrayBuffer() : await fetch(src!).then((r) => r.arrayBuffer());
          const { value } = await mammoth.convertToHtml({ arrayBuffer: buf });
          if (!cancelled) setHtml(DOMPurify.default.sanitize(value));
        } else if (isMarkdown) {
          const [{ marked }, DOMPurify] = await Promise.all([import("marked"), import("dompurify")]);
          const content = file ? await file.text() : await fetch(src!).then((r) => r.text());
          if (cancelled) return;
          const parsed = await marked.parse(content, { async: true });
          setHtml(DOMPurify.default.sanitize(parsed));
        } else {
          const content = file ? await file.text() : await fetch(src!).then((r) => r.text());
          if (cancelled) return;
          if (isCsv) setRows(parseCsv(content).slice(0, 500));
          else if (isJson) setText(prettyJson(content));
          else setText(content);
        }
      } catch {
        if (!cancelled) {
          setText(null);
          setHtml(null);
          setRows(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [file, src, isCsv, isExcel, isMarkdown, isDocx, isJson, isPlainText]);

  const frameStyle = { maxHeight, height: kind === "image" ? undefined : maxHeight };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-surface", className)}>
      <Toolbar name={resolvedName} sizeLabel={file ? formatFileSize(file.size) : undefined} download={download} kind={kind} />

      <div className="bg-bg-secondary" style={{ maxHeight }}>
        {loading ? (
          <Centered style={frameStyle}>
            <Loader2 size={20} className="animate-spin text-text-tertiary" aria-hidden />
            <span className="sr-only">Loading preview</span>
          </Centered>
        ) : tooLarge ? (
          <Unsupported
            name={resolvedName}
            type={resolvedType}
            download={download}
            style={frameStyle}
            message="File is too large to preview here."
          />
        ) : !url && !text && !rows && !html ? (
          <Centered style={frameStyle}>
            <FileQuestion size={22} className="text-text-tertiary" aria-hidden />
            <p className="text-sm text-text-secondary">Nothing to preview.</p>
          </Centered>
        ) : kind === "image" ? (
          <div className="flex items-center justify-center overflow-auto p-4" style={{ maxHeight }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={resolvedName} className="max-h-full max-w-full rounded-md object-contain" style={{ maxHeight }} />
          </div>
        ) : kind === "document" && ext === "pdf" ? (
          <iframe title={resolvedName} src={url} className="w-full" style={{ height: maxHeight }} />
        ) : kind === "video" ? (
          <div className="flex items-center justify-center bg-black" style={{ maxHeight }}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={url} controls className="max-h-full max-w-full" style={{ maxHeight }} />
          </div>
        ) : kind === "audio" ? (
          <div className="flex items-center justify-center p-6">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio src={url} controls className="w-full max-w-md" />
          </div>
        ) : (isCsv || isExcel) && rows != null ? (
          <SheetTable rows={rows} maxHeight={maxHeight} />
        ) : (isMarkdown || isDocx) && html != null ? (
          <div className="overflow-auto bg-surface" style={{ maxHeight }}>
            <div
              className="doc-prose mx-auto max-w-2xl p-5 text-sm text-text"
              // Sanitized with DOMPurify before being set (see parse effect).
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ) : text != null ? (
          <pre className="overflow-auto p-4 font-mono text-xs leading-relaxed text-text" style={{ maxHeight }}>
            {text}
          </pre>
        ) : (
          <Unsupported name={resolvedName} type={resolvedType} download={download} style={frameStyle} />
        )}
      </div>
    </div>
  );
}

function Toolbar({ name, sizeLabel, download, kind }: { name: string; sizeLabel?: string; download?: string; kind: ReturnType<typeof fileKind> }) {
  const Icon = fileIcon(kind);
  return (
    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
      <Icon size={16} className="shrink-0 text-text-secondary" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text">{name}</span>
      {sizeLabel && <span className="hidden shrink-0 text-xs tabular-nums text-text-tertiary sm:inline">{sizeLabel}</span>}
      {download && (
        <a
          href={download}
          download={name}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Download size={13} aria-hidden />
          <span className="hidden sm:inline">Download</span>
        </a>
      )}
    </div>
  );
}

/** Minimal, dependency-free CSV parser (handles quotes and escaped quotes). */
/** Pretty-print a JSON string; returns the original text if it isn't valid JSON. */
function prettyJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else inQuotes = false;
      } else cell += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function SheetTable({ rows, maxHeight }: { rows: string[][]; maxHeight: number | string }) {
  if (rows.length === 0) {
    return (
      <Centered style={{ height: maxHeight }}>
        <p className="text-sm text-text-secondary">Empty spreadsheet.</p>
      </Centered>
    );
  }
  const [header, ...body] = rows;
  const colCount = rows.reduce((max, r) => Math.max(max, r.length), 0);
  const cols = Array.from({ length: colCount });
  return (
    <div className="overflow-auto" style={{ maxHeight }}>
      <table className="border-collapse text-left text-xs tabular-nums">
        <thead className="sticky top-0 z-10">
          <tr>
            {/* Corner cell of the header / row-number gutter (X × Y axis origin). */}
            <th
              className="sticky left-0 z-10 border border-border bg-bg-active px-2 py-2 text-center font-semibold text-text-tertiary"
              aria-hidden
            />
            {cols.map((_, i) => (
              <th
                key={i}
                className="whitespace-nowrap border border-border bg-bg-secondary px-3 py-2 font-semibold uppercase tracking-wide text-text-secondary"
              >
                {header[i] || `Col ${i + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>
              {/* Row-number gutter — the Y axis, subtly tinted like the header. */}
              <th
                scope="row"
                className="sticky left-0 border border-border bg-bg-secondary px-2 py-1.5 text-center font-medium text-text-tertiary"
              >
                {ri + 1}
              </th>
              {cols.map((_, ci) => (
                <td key={ci} className="whitespace-nowrap border border-border px-3 py-1.5 text-text">
                  {r[ci] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Unsupported({ name, type, download, style, message }: { name: string; type: string; download?: string; style: React.CSSProperties; message?: string }) {
  const Icon = fileIcon(fileKind(name, type));
  return (
    <Centered style={style}>
      <span className="flex size-14 items-center justify-center rounded-xl bg-surface text-text-secondary">
        <Icon size={26} aria-hidden />
      </span>
      <div className="text-center">
        <p className="text-sm font-medium text-text">{name}</p>
        <p className="text-xs text-text-secondary">{message ?? "Preview isn’t available for this file type."}</p>
      </div>
      {download && (
        <a
          href={download}
          download={name}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text transition-colors hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Download size={15} aria-hidden />
          Download
        </a>
      )}
    </Centered>
  );
}

function Centered({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8" style={style}>
      {children}
    </div>
  );
}
