import { clsx } from 'clsx';
import { getInitials } from '@adyapan/shared';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  className?: string;
  ring?: boolean;
}

const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

export default function Avatar({
  src,
  firstName = 'U',
  lastName,
  size = 'md',
  className,
  ring = false,
}: AvatarProps) {
  const initials = getInitials(firstName, lastName);

  return (
    <div
      className={clsx(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0',
        sizeMap[size],
        ring && 'ring-2 ring-primary-500 ring-offset-2',
        className
      )}
      aria-label={`${firstName} ${lastName ?? ''}`.trim()}
    >
      {src ? (
        <img
          src={src}
          alt={`${firstName} ${lastName ?? ''}`.trim()}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-semibold">
          {initials}
        </div>
      )}
    </div>
  );
}
