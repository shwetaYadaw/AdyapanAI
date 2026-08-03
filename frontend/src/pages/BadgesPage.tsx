import React, { useState, useEffect } from 'react';
import BadgeDisplay from '../components/common/BadgeDisplay';

interface BadgeData {
  id: string;
  badgeType: 'achievement' | 'skill' | 'milestone' | 'streak' | 'challenge' | 'expert';
  name: string;
  description?: string;
  unlockedAt?: Date;
  level?: number;
}

const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockBadges: BadgeData[] = [
      {
        id: '1',
        badgeType: 'achievement',
        name: 'First Submission',
        description: 'Successfully submitted your first solution',
        unlockedAt: new Date('2024-01-15'),
        level: 1,
      },
      {
        id: '2',
        badgeType: 'achievement',
        name: 'Accepted Solutions',
        description: 'Got 5 solutions accepted',
        unlockedAt: new Date('2024-01-20'),
        level: 2,
      },
      {
        id: '3',
        badgeType: 'skill',
        name: 'JavaScript Master',
        description: 'Solved 10 JavaScript problems',
        unlockedAt: new Date('2024-01-18'),
        level: 1,
      },
      {
        id: '4',
        badgeType: 'skill',
        name: 'Python Expert',
        description: 'Solved 15 Python problems',
        unlockedAt: new Date('2024-01-22'),
        level: 2,
      },
      {
        id: '5',
        badgeType: 'milestone',
        name: '100 Problems Solved',
        description: 'Congratulations on solving 100 problems!',
        unlockedAt: new Date('2024-01-25'),
        level: 1,
      },
      {
        id: '6',
        badgeType: 'milestone',
        name: 'Speed Runner',
        description: 'Solved 5 problems in under 5 minutes each',
        unlockedAt: new Date('2024-01-23'),
        level: 2,
      },
      {
        id: '7',
        badgeType: 'streak',
        name: '7-Day Streak',
        description: 'Solved problems for 7 consecutive days',
        unlockedAt: new Date('2024-01-21'),
        level: 1,
      },
      {
        id: '8',
        badgeType: 'streak',
        name: '30-Day Streak',
        description: 'Solved problems for 30 consecutive days',
        unlockedAt: new Date('2024-02-10'),
        level: 3,
      },
      {
        id: '9',
        badgeType: 'challenge',
        name: 'Hard Mode',
        description: 'Solved 5 hard difficulty problems',
        unlockedAt: new Date('2024-01-28'),
        level: 1,
      },
      {
        id: '10',
        badgeType: 'challenge',
        name: 'Algorithm Master',
        description: 'Solved all algorithm challenges',
        unlockedAt: new Date('2024-02-05'),
        level: 2,
      },
      {
        id: '11',
        badgeType: 'expert',
        name: 'Data Structures Expert',
        description: 'Mastered all data structure problems',
        unlockedAt: new Date('2024-02-08'),
        level: 1,
      },
      {
        id: '12',
        badgeType: 'expert',
        name: 'Adyapan Champion',
        description: 'You are among the top 1% users on Adyapan!',
        unlockedAt: new Date('2024-02-12'),
        level: 5,
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setBadges(mockBadges);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your badges...</p>
      </div>
    );
  }

  return (
    <div className="badges-page">
      <BadgeDisplay badges={badges} title="🏆 Your Badges" showStats={true} />
    </div>
  );
};

export default BadgesPage;
