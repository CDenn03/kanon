export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-side slot — typically one or two <Button>s. */
  actions?: React.ReactNode;
}

/**
 * PageHeader — the H1 + description + CTA row that sits above the
 * main content of a page. Keeps the spacing and sizing consistent
 * everywhere without duplicating flex layout per page.
 *
 * Usage:
 *   <PageHeader
 *     title="Users"
 *     description="People with access to this organisation."
 *     actions={<Button icon={Plus}>Add user</Button>}
 *   />
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
        {description && (
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
