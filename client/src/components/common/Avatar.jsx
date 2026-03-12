import clsx from 'clsx';

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const bgColors = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-teal-500',
];

function getColorFromName(name) {
  if (!name) return bgColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className,
}) {
  const initials = getInitials(name || alt);
  const bgColor = getColorFromName(name || alt);

  return (
    <div
      className={clsx(
        'relative inline-flex flex-shrink-0 items-center justify-center rounded-full',
        'ring-2 ring-white dark:ring-gray-800',
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div
          className={clsx(
            'flex h-full w-full items-center justify-center rounded-full font-semibold text-white',
            bgColor
          )}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
