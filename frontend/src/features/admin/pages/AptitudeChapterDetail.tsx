import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { aptitudeAdminService, AptitudeTopic, AptitudeChapter } from '../services/aptitudeAdminService';
import AptitudeChapterModal from '../components/aptitude/AptitudeChapterModal';
import AptitudeQuestionDetail from './AptitudeQuestionDetail';
import CacheManager from '../../../utils/cacheManager';

interface AptitudeChapterDetailProps {
  topic: AptitudeTopic;
  onBack: () => void;
}

export default function AptitudeChapterDetail({ topic, onBack }: AptitudeChapterDetailProps) {
  const [chapters, setChapters] = useState<AptitudeChapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<AptitudeChapter | null>(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<AptitudeChapter | null>(null);

  useEffect(() => {
    fetchChapters();
  }, [topic.id]);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      if (!topic.id) return;
      const result = await aptitudeAdminService.getChapters(topic.id);
      setChapters(result.chapters);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = async (data: any) => {
    try {
      if (!topic.id) return;
      await aptitudeAdminService.createChapter(topic.id, data);
      toast.success('Chapter created successfully!');
      setShowChapterModal(false);
      // Clear cache after creation
      CacheManager.clearQuestionCache();
      fetchChapters();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create chapter');
    }
  };

  const handleUpdateChapter = async (data: any) => {
    try {
      if (!editingChapter?.id || !topic.id) return;
      await aptitudeAdminService.updateChapter(topic.id, editingChapter.id, data);
      toast.success('Chapter updated successfully!');
      setShowChapterModal(false);
      setEditingChapter(null);
      // Clear cache after update
      CacheManager.clearQuestionCache(editingChapter.id);
      fetchChapters();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update chapter');
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter? This will also delete all questions in it.')) return;
    try {
      if (!topic.id) return;
      await aptitudeAdminService.deleteChapter(topic.id, chapterId);
      toast.success('Chapter deleted successfully!');
      // Clear cache for this chapter
      CacheManager.clearQuestionCache(chapterId);
      fetchChapters();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete chapter');
    }
  };

  if (selectedChapter) {
    return (
      <AptitudeQuestionDetail
        topic={topic}
        chapter={selectedChapter}
        onBack={() => setSelectedChapter(null)}
      />
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button & Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Topics
          </button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-4xl">{topic.icon || '📚'}</div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{topic.name}</h1>
              </div>
              {topic.description && (
                <p className="text-gray-600 dark:text-gray-400">{topic.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Total Chapters: {chapters.length}</p>
            </div>
            <button
              onClick={() => {
                setEditingChapter(null);
                setShowChapterModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={20} />
              Add Chapter
            </button>
          </div>
        </div>

        {/* Chapters List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : chapters.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No chapters created yet</p>
            <button
              onClick={() => {
                setEditingChapter(null);
                setShowChapterModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus size={20} />
              Create First Chapter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{chapter.name}</h3>
                    {chapter.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{chapter.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Questions: {chapter.questions?.length || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedChapter(chapter)}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition text-sm font-medium"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => {
                        setEditingChapter(chapter);
                        setShowChapterModal(true);
                      }}
                      className="px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => chapter.id && handleDeleteChapter(chapter.id)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chapter Modal */}
      {showChapterModal && (
        <AptitudeChapterModal
          chapter={editingChapter}
          onSave={editingChapter ? handleUpdateChapter : handleCreateChapter}
          onClose={() => {
            setShowChapterModal(false);
            setEditingChapter(null);
          }}
        />
      )}
    </div>
  );
}
