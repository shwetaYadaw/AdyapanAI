import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, TrendingUp } from 'lucide-react';

interface PuzzleCardProps {
  id: string;
  title: string;
  description?: string;
  puzzleType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime?: number;
  rating: number;
  ratingCount: number;
  completionRate: number;
}

export const PuzzleCard: React.FC<PuzzleCardProps> = ({
  id,
  title,
  description,
  puzzleType,
  difficulty,
  estimatedTime,
  rating,
  ratingCount,
  completionRate,
}) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const typeColors: Record<string, string> = {
    pattern: 'bg-blue-50 text-blue-700',
    sequence: 'bg-purple-50 text-purple-700',
    logic: 'bg-indigo-50 text-indigo-700',
    shape: 'bg-cyan-50 text-cyan-700',
    'odd-one-out': 'bg-pink-50 text-pink-700',
  };

  return (
    <Link to={`/puzzles/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{title}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${difficultyColors[difficulty]}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>

        {/* Description */}
        {description && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>}

        {/* Type badge */}
        <div className="mb-3">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${typeColors[puzzleType]}`}>
            {puzzleType}
          </span>
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({ratingCount})</span>
          </div>

          {estimatedTime && (
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{estimatedTime}s</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">{(completionRate * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
