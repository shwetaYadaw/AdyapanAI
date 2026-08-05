import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, ChevronDown, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../../core/services/api';
import Button from '../../../../shared/components/Button/Button';
import AptitudeChaptersList from './AptitudeChaptersList';
import AddChapterModal from './AddChapterModal';

interface Topic {
  id: string;
  name: string;
  description?: string;
}

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

interface AptitudeTopicDetailProps {
  topicId: string;
  onBack: () => void;
}

export default function AptitudeTopicDetail({ topicId, onBack }: AptitudeTopicDetailProps) {
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const { data: topic } = useQuery<Topic>({
    queryKey: ['aptitude-topic', topicId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/aptitude/topics/${topicId}`);
      return data.data;
    },
  });

  const { data: chapters = [], refetch: refetchChapters } = useQuery<Chapter[]>({
    queryKey: ['aptitude-chapters', topicId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/aptitude/topics/${topicId}/chapters?limit=100`);
      return data.data ?? [];
    },
  });

  const handleAddChapter = async (data: Partial<Chapter>) => {
    try {
      await api.post(`/admin/aptitude/topics/${topicId}/chapters`, data);
      toast.success('Chapter created successfully');
      setShowAddChapter(false);
      refetchChapters();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create chapter');
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure? All questions in this chapter will be deleted.')) return;

    try {
      await api.delete(`/admin/aptitude/topics/${topicId}/chapters/${chapterId}`);
      toast.success('Chapter deleted');
      refetchChapters();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete chapter');
    }
  };

  return (
    <div className="space-y-6">
      {/* Topic Info */}
      {topic && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">{topic.name}</h2>
          {topic.description && (
            <p className="text-white/90">{topic.description}</p>
          )}
          <div className="mt-4 text-sm text-white/75">
            {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
          </div>
        </div>
      )}

      {/* Add Chapter Button */}
      <Button
        onClick={() => setShowAddChapter(true)}
        rightIcon={<Plus size={18} />}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
      >
        Add Chapter
      </Button>

      {/* Chapters List */}
      {chapters.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No chapters yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <AptitudeChaptersList
              key={chapter.id}
              chapter={chapter}
              topicId={topicId}
              isExpanded={expandedChapter === chapter.id}
              onToggle={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
              onDelete={handleDeleteChapter}
              onRefresh={refetchChapters}
            />
          ))}
        </div>
      )}

      {/* Add Chapter Modal */}
      {showAddChapter && (
        <AddChapterModal
          topicId={topicId}
          onSave={handleAddChapter}
          onClose={() => setShowAddChapter(false)}
        />
      )}
    </div>
  );
}
