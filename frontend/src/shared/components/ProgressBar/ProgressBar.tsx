import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'xs' | 'sm' | 'md';
  color?: 'primary' | 'success' | 'warning' | 'purple';
  className?: string;
  animate?: boolean;
}

const sizeMap = { xs: 'h-1', sm: 'h-1.5', md: 'h-2.5' };
const colorMap = {
  primary: 'from-primary-500 to-primary-400',
  success: 'from-green-500 to-emerald-400',
  warning: 'from-yellow-500 to-amber-400',
  purple: 'from-purple-600 to-primary-500',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  size = 'sm',
  color = 'purple',
  className,
  animate = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>}
          {showPercent && (
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden',
          sizeMap[size]
        )}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={clsx('h-full rounded-full bg-gradient-to-r', colorMap[color])}
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
