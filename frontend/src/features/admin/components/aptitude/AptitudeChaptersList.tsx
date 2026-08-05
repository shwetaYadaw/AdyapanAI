import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../../core/services/api';
import Card from '../../../../shared/components/Card/Card';
import Button from '../../../../shared/components/Button/Button';
import AptitudeQuestionsList from './AptitudeQuestionsList';

interface Chapter {
  id: string;
  name: string;
  description?: string;
  topicId: string;
  order: number;
  isActive: boolean;
  _count?: {
    questions: number;
  };
}

interface AptitudeChaptersListProps {
  chapter: Chapter;
  topicId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (chapterId: string) => void;
  onRefresh: () => void;
}

export default function AptitudeChaptersList({
  chapter,
  topicId,
  isExpanded,
  onToggle,
  onDelete,
  onRefresh,
}: AptitudeChaptersListProps) {
  const { data: questions = [] } = useQuery({
    queryKey: ['aptitude-questions', chapter.id, isExpanded],
    queryFn: async () => {
      if (!isExpanded) return [];
      const { data } = await api.get(
        `/admin/aptitude/topics/${topicId}/chapters/${chapter.id}/questions?limit=100`
      );
      return data.data ?? [];
    },
    enabled: isExpanded,
  });

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Chapter Header */}
      <div
        onClick={onToggle}
        className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 cursor-pointer hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-colors flex items-center justify-between group"
      >
        <div className="flex-1 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
            {chapter.order + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {chapter.name}
            </h3>
            {chapter.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {chapter.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            {chapter._count?.questions ?? 0} Questions
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <AptitudeQuestionsList
            topicId={topicId}
            chapterId={chapter.id}
            questions={questions}
            onRefresh={() => {
              onRefresh();
            }}
          />
        </div>
      )}
    </Card>
  );
}
