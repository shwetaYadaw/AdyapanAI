import React, { useState } from 'react';
import Badge from './Badge';
import './BadgeDisplay.css';

export interface BadgeData {
  id: string;
  badgeType: 'achievement' | 'skill' | 'milestone' | 'streak' | 'challenge' | 'expert';
  name: string;
  description?: string;
  unlockedAt?: Date;
  level?: number;
}

export interface BadgeDisplayProps {
  badges: BadgeData[];
  title?: string;
  showStats?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  title = 'Your Badges',
  showStats = true,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredBadges =
    filter === 'all'
      ? badges
      : badges.filter((badge) => badge.badgeType === filter);

  const badgeTypes = [
    { type: 'all', label: 'All', count: badges.length },
    {
      type: 'achievement',
      label: 'Achievements',
      count: badges.filter((b) => b.badgeType === 'achievement').length,
    },
    {
      type: 'skill',
      label: 'Skills',
      count: badges.filter((b) => b.badgeType === 'skill').length,
    },
    {
      type: 'milestone',
      label: 'Milestones',
      count: badges.filter((b) => b.badgeType === 'milestone').length,
    },
    {
      type: 'streak',
      label: 'Streaks',
      count: badges.filter((b) => b.badgeType === 'streak').length,
    },
    {
      type: 'challenge',
      label: 'Challenges',
      count: badges.filter((b) => b.badgeType === 'challenge').length,
    },
    {
      type: 'expert',
      label: 'Expert',
      count: badges.filter((b) => b.badgeType === 'expert').length,
    },
  ];

  const getAverageLevel =
    badges.length > 0
      ? (
          badges.reduce((sum, b) => sum + (b.level || 1), 0) /
          badges.length
        ).toFixed(1)
      : 0;

  return (
    <div className="badge-display-container">
      <div className="badge-display-header">
        <h1 className="badge-display-title">{title}</h1>
        {showStats && (
          <div className="badge-stats">
            <div className="stat">
              <span className="stat-label">Total Badges</span>
              <span className="stat-value">{badges.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Avg Level</span>
              <span className="stat-value">{getAverageLevel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="badge-filter-tabs">
        {badgeTypes.map((badgeType) => (
          <button
            key={badgeType.type}
            className={`filter-tab ${filter === badgeType.type ? 'active' : ''}`}
            onClick={() => setFilter(badgeType.type)}
          >
            <span className="tab-label">{badgeType.label}</span>
            <span className="tab-count">{badgeType.count}</span>
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      {filteredBadges.length > 0 ? (
        <div className="badges-grid">
          {filteredBadges.map((badge) => (
            <Badge
              key={badge.id}
              badgeType={badge.badgeType}
              name={badge.name}
              description={badge.description}
              unlockedAt={badge.unlockedAt}
              level={badge.level}
              showLogo={true}
            />
          ))}
        </div>
      ) : (
        <div className="no-badges">
          <p>No badges found in this category</p>
          <p className="no-badges-hint">Keep solving problems to earn badges!</p>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
