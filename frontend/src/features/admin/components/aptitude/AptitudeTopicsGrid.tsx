import React from 'react';
import { Plus, Edit2, Trash2, BookOpen, Zap, MoreVertical } from 'lucide-react';
import { AptitudeTopic } from '../../services/aptitudeAdminService';

interface AptitudeTopicsGridProps {
  topics: AptitudeTopic[];
  isLoading: boolean;
  onSelectTopic: (topicId: string) => void;
  onEditTopic: (topic: AptitudeTopic) => void;
  onDeleteTopic: (topicId: string) => void;
  onAddTopic: () => void;
}

export default function AptitudeTopicsGrid({
  topics,
  isLoading,
  onSelectTopic,
  onEditTopic,
  onDeleteTopic,
  onAddTopic,
}: AptitudeTopicsGridProps) {
  const getTotalQuestions = (topic: AptitudeTopic) => {
    return topic.chapters?.reduce((sum, ch) => sum + (ch.questions?.length || 0), 0) || 0;
  };

  const getLastUpdated = (topic: AptitudeTopic) => {
    const date = new Date(topic.updatedAt || topic.createdAt);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Topic Button */}
      <div className="flex justify-end">
        <button
          onClick={onAddTopic}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus size={20} />
          Add Topic
        </button>
      </div>

      {/* Topics Grid */}
      {topics.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Topics Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first aptitude topic to get started</p>
          <button
            onClick={onAddTopic}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
          >
            <Plus size={18} />
            Create First Topic
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
            >
              {/* Header with Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{topic.icon || '📚'}</div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditTopic(topic)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                    title="Edit topic"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {topic.name}
              </h3>

              {/* Description */}
              {topic.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {topic.description}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {getTotalQuestions(topic)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {topic.chapters?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Chapters</div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                Updated: {getLastUpdated(topic)}
              </div>

              {/* Status Badge */}
              <div className="mb-4 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    topic.isActive
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                  }`}
                >
                  {topic.isActive ? '✓ Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectTopic(topic.id!)}
                  className="flex-1 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800/50 transition font-medium text-sm"
                >
                  <Zap size={14} className="inline mr-2" />
                  Open Questions
                </button>
                <button
                  onClick={() => topic.id && onDeleteTopic(topic.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                  title="Delete topic"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
