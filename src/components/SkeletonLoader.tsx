import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', lines = 1, height = 'h-4' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${height} bg-gray-200 rounded animate-pulse`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="border border-gray-200 rounded-lg p-6 space-y-4">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
      <div className="flex-1">
        <Skeleton height="h-4" className="w-24" />
        <Skeleton height="h-3" className="w-16 mt-1" />
      </div>
    </div>
    <Skeleton lines={2} />
    <Skeleton height="h-3" className="w-32" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton height="h-4" />
          <Skeleton height="h-4" />
          <Skeleton height="h-4" />
          <Skeleton height="h-4" className="w-20" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
