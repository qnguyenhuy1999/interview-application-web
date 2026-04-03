import { cn } from '@shared/utils';
import type { InputProps } from '../atoms/input';
import { Input } from '../atoms/input';

interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  id: string;
}

export function FormField({ label, error, id, className, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        className={cn(error && 'border-destructive', className)}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
