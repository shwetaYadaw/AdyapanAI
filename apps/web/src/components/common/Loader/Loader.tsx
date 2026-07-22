import { clsx } from 'clsx';

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const sizeMap = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
const colorMap = {
  primary: 'border-primary-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-400 border-t-transparent',
};

export default function Loader({ size = 'md', color = 'primary', className }: LoaderProps) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full border-2 animate-spin',
        sizeMap[size],
        colorMap[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
