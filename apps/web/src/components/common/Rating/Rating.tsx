import { clsx } from 'clsx';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeMap = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };

export default function Rating({
  value,
  max = 5,
  size = 'sm',
  showValue = false,
  count,
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }, (_, i) => {
          const filled = i < Math.floor(value);
          const half = !filled && i < value;

          return (
            <button
              key={i}
              type={interactive ? 'button' : undefined}
              onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
              className={clsx(
                sizeMap[size],
                interactive && 'cursor-pointer hover:scale-110 transition-transform',
                !interactive && 'cursor-default',
                'leading-none'
              )}
              aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
              tabIndex={interactive ? 0 : -1}
            >
              {filled ? (
                <span className="text-amber-400">★</span>
              ) : half ? (
                <span className="text-amber-400">½</span>
              ) : (
                <span className="text-gray-300 dark:text-gray-600">★</span>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
