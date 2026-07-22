import { HTMLAttributes, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  animate?: boolean;
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-5 md:p-6', lg: 'p-6 md:p-8' };

export default function Card({
  hover = false,
  glass = false,
  padding = 'md',
  animate = false,
  children,
  className,
  ...props
}: CardProps) {
  const classes = clsx(
    glass
      ? 'glass-card'
      : 'bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800',
    hover && 'shadow-card hover:shadow-card-hover transition-shadow duration-300 cursor-pointer',
    !hover && 'shadow-card',
    paddingMap[padding],
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={classes}
        {...(props as MotionProps)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
