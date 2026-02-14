interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  color?: string;
}

export default function LoadingSpinner({ size = 'md', text, color = 'border-blue-600' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  };

  const spinnerClass = sizeClasses[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${spinnerClass} ${color} border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}
