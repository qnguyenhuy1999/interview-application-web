interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

export function PageContainer({
  children,
  className,
  maxWidth = '2xl',
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 md:px-8">
      <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${className || ''}`}>
        {children}
      </div>
    </div>
  );
}
