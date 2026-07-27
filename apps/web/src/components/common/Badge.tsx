import React from 'react';
import './Badge.css';

export interface BadgeProps {
  badgeType: 'achievement' | 'skill' | 'milestone' | 'streak' | 'challenge' | 'expert';
  name: string;
  description?: string;
  unlockedAt?: Date;
  level?: number;
  showLogo?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  badgeType,
  name,
  description,
  unlockedAt,
  level = 1,
  showLogo = true,
}) => {
  const getBadgeColor = (type: string): string => {
    switch (type) {
      case 'achievement':
        return 'badge-achievement';
      case 'skill':
        return 'badge-skill';
      case 'milestone':
        return 'badge-milestone';
      case 'streak':
        return 'badge-streak';
      case 'challenge':
        return 'badge-challenge';
      case 'expert':
        return 'badge-expert';
      default:
        return 'badge-achievement';
    }
  };

  const getBadgeIcon = (type: string): string => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'skill':
        return '⭐';
      case 'milestone':
        return '🎯';
      case 'streak':
        return '🔥';
      case 'challenge':
        return '💪';
      case 'expert':
        return '👑';
      default:
        return '🎖️';
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Adyapan Logo SVG
  const AdyapanLogoSVG = () => (
    <svg 
      className="adyapan-logo-svg" 
      viewBox="0 0 100 100" 
      width="45" 
      height="45"
    >
      {/* Outer circle background */}
      <circle cx="50" cy="50" r="48" fill="white" opacity="0.95" />
      
      {/* Ribbon/Badge icon */}
      <g transform="translate(50, 50)">
        {/* Ribbon top loop */}
        <circle cx="0" cy="-12" r="8" fill="none" stroke="white" strokeWidth="2.5" />
        
        {/* Ribbon left tail */}
        <path d="M -6,-4 Q -10,-2 -10,4 L -4,4" fill="white" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Ribbon right tail */}
        <path d="M 6,-4 Q 10,-2 10,4 L 4,4" fill="white" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Center knot */}
        <circle cx="0" cy="0" r="2" fill="white" />
      </g>
      
      {/* Adyapan text */}
      <text 
        x="50" 
        y="70" 
        textAnchor="middle" 
        fontSize="10" 
        fontWeight="bold" 
        fill="white" 
        fontFamily="Arial, sans-serif"
      >
        ADYAPAN
      </text>
    </svg>
  );

  return (
    <div className={`badge-container ${getBadgeColor(badgeType)}`}>
      <div className="badge-circle">
        <div className="badge-logo-container">
          {showLogo && <AdyapanLogoSVG />}
          <div className="badge-icon-overlay">{getBadgeIcon(badgeType)}</div>
        </div>
        {level > 1 && <div className="badge-level">{level}</div>}
      </div>

      <div className="badge-content">
        <h3 className="badge-name">{name}</h3>
        {description && <p className="badge-description">{description}</p>}
        {unlockedAt && (
          <p className="badge-date">Unlocked: {formatDate(unlockedAt)}</p>
        )}
      </div>
    </div>
  );
};

export default Badge;
