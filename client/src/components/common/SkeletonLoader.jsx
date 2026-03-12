import clsx from 'clsx';

const baseClass = 'animate-pulse rounded bg-gray-200 dark:bg-gray-700';

function Line({ width = '100%', height = '1rem', className }) {
  return (
    <div
      className={clsx(baseClass, className)}
      style={{ width, height }}
    />
  );
}

function Circle({ size = 40, className }) {
  return (
    <div
      className={clsx(baseClass, 'rounded-full', className)}
      style={{ width: size, height: size }}
    />
  );
}

function CardSkeleton({ className }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Circle size={40} />
        <div className="flex-1 space-y-2">
          <Line width="60%" height="0.875rem" />
          <Line width="40%" height="0.75rem" />
        </div>
      </div>
      <Line height="0.75rem" />
      <Line width="80%" height="0.75rem" />
      <Line width="50%" height="0.75rem" />
    </div>
  );
}

function TableSkeleton({ rows = 5, cols = 4, className }) {
  return (
    <div className={clsx('space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        {Array.from({ length: cols }).map((_, i) => (
          <Line key={`th-${i}`} width={`${100 / cols}%`} height="0.75rem" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Line
              key={`cell-${rowIdx}-${colIdx}`}
              width={`${100 / cols}%`}
              height="0.75rem"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function SkeletonLoader({
  variant = 'line',
  count = 1,
  className,
  ...props
}) {
  const items = Array.from({ length: count });

  switch (variant) {
    case 'circle':
      return (
        <div className={clsx('flex gap-3', className)}>
          {items.map((_, i) => (
            <Circle key={i} {...props} />
          ))}
        </div>
      );

    case 'card':
      return (
        <div className={clsx('grid gap-4', className)}>
          {items.map((_, i) => (
            <CardSkeleton key={i} {...props} />
          ))}
        </div>
      );

    case 'table':
      return <TableSkeleton className={className} {...props} />;

    case 'line':
    default:
      return (
        <div className={clsx('space-y-3', className)}>
          {items.map((_, i) => (
            <Line key={i} {...props} />
          ))}
        </div>
      );
  }
}

SkeletonLoader.Line = Line;
SkeletonLoader.Circle = Circle;
SkeletonLoader.Card = CardSkeleton;
SkeletonLoader.Table = TableSkeleton;
