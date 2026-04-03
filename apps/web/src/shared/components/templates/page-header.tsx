import { cn } from '@shared/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  backHref,
  onBack,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div>
        {backHref ? (
          <a href={backHref} className="mb-2 block text-sm text-muted-foreground hover:underline">
            ← Back
          </a>
        ) : onBack ? (
          <button
            onClick={onBack}
            className="mb-2 text-sm text-muted-foreground hover:underline"
          >
            ← Back
          </button>
        ) : null}
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0 sm:self-start">{actions}</div>}
    </div>
  );
}
