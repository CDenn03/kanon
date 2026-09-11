"use client";

import { type ReactNode } from "react";
import { Eye, Download, MoreHorizontal, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize, fileKind, fileIcon } from "@/lib/upload";
import { DataTable, type DataTableColumn } from "./data-table";
import type { PaginationProps } from "./pagination";

/** Status of a stored document. Rendered with an icon + label (never color alone). */
export type DocumentStatus = "ready" | "processing" | "uploading" | "failed";

export interface DocumentRow {
  id: string;
  /** File name including extension (drives the type icon). */
  name: string;
  /** Optional explicit MIME type (otherwise inferred from the name). */
  mimeType?: string;
  /** Size in bytes. */
  size: number;
  /** Who uploaded it. */
  uploadedBy?: string;
  /** Upload date (Date or preformatted string). */
  uploadedAt?: Date | string;
  status?: DocumentStatus;
}

interface DocumentsTableProps {
  documents: DocumentRow[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  /** Row click (e.g. open/preview). */
  onOpen?: (doc: DocumentRow) => void;
  /** View action button per row. Omit to hide the view button. */
  onView?: (doc: DocumentRow) => void;
  /** Download action per row. Omit to hide the download button. */
  onDownload?: (doc: DocumentRow) => void;
  /** Row actions menu trigger. Omit to hide the actions button. */
  onActions?: (doc: DocumentRow) => void;
  pagination?: PaginationProps;
  empty?: { title: string; body: string };
  /** Hide the status column when documents have no lifecycle. */
  showStatus?: boolean;
}

const STATUS: Record<DocumentStatus, { label: string; icon: typeof CheckCircle2; className: string; spin?: boolean }> = {
  ready: { label: "Ready", icon: CheckCircle2, className: "text-accent" },
  processing: { label: "Processing", icon: Clock, className: "text-warning" },
  uploading: { label: "Uploading", icon: Loader2, className: "text-text-secondary", spin: true },
  failed: { label: "Failed", icon: AlertCircle, className: "text-error" },
};

function formatDate(value: Date | string | undefined): string {
  if (!value) return "—";
  if (typeof value === "string") return value;
  return value.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/**
 * DocumentsTable — a DataTable preset for lists of stored files. Renders a
 * type icon + name, file type, size, uploader/date, an accessible status badge
 * (icon + label), and optional download / actions controls. Presentational:
 * pass `documents` and wire the row callbacks.
 */
export function DocumentsTable({
  documents,
  loading,
  title,
  subtitle,
  onOpen,
  onView,
  onDownload,
  onActions,
  pagination,
  empty,
  showStatus = true,
}: DocumentsTableProps) {
  const columns: DataTableColumn<DocumentRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (d) => {
        const Icon = fileIcon(fileKind(d.name, d.mimeType));
        return (
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-bg-secondary text-text-secondary">
              <Icon size={16} aria-hidden />
            </span>
            <span className="truncate font-medium text-text">{d.name}</span>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      cell: (d) => <span className="uppercase text-text-secondary">{extension(d.name)}</span>,
      width: "90px",
    },
    {
      key: "size",
      header: "Size",
      numeric: true,
      cell: (d) => formatFileSize(d.size),
      width: "100px",
    },
    {
      key: "uploaded",
      header: "Uploaded",
      cell: (d) => (
        <div className="leading-tight">
          <span className="block text-text">{formatDate(d.uploadedAt)}</span>
          {d.uploadedBy && <span className="block text-xs text-text-tertiary">{d.uploadedBy}</span>}
        </div>
      ),
      width: "160px",
    },
    ...(showStatus
      ? [
          {
            key: "status",
            header: "Status",
            width: "130px",
            cell: (d: DocumentRow) => <StatusBadge status={d.status ?? "ready"} />,
          } satisfies DataTableColumn<DocumentRow>,
        ]
      : []),
    ...(onView || onDownload || onActions
      ? [
          {
            key: "actions",
            header: "",
            align: "right" as const,
            width: "120px",
            cell: (d: DocumentRow): ReactNode => (
              <div className="flex items-center justify-end gap-1">
                {onView && (
                  <IconButton label={`View ${d.name}`} onClick={() => onView(d)}>
                    <Eye size={15} aria-hidden />
                  </IconButton>
                )}
                {onDownload && (
                  <IconButton label={`Download ${d.name}`} onClick={() => onDownload(d)}>
                    <Download size={15} aria-hidden />
                  </IconButton>
                )}
                {onActions && (
                  <IconButton label={`More actions for ${d.name}`} onClick={() => onActions(d)}>
                    <MoreHorizontal size={15} aria-hidden />
                  </IconButton>
                )}
              </div>
            ),
          } satisfies DataTableColumn<DocumentRow>,
        ]
      : []),
  ];

  return (
    <DataTable
      title={title}
      subtitle={subtitle}
      columns={columns}
      rows={documents}
      rowKey={(d) => d.id}
      loading={loading}
      onRowClick={onOpen}
      pagination={pagination}
      empty={empty ?? { title: "No documents", body: "Uploaded files will appear here." }}
      caption="Documents"
    />
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  const cfg = STATUS[status];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", cfg.className)}>
      <Icon size={13} className={cn(cfg.spin && "animate-spin")} aria-hidden />
      {cfg.label}
    </span>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-bg-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
    </button>
  );
}

function extension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1) : "file";
}
