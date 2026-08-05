import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, ChevronRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { aptitudeAdminService, AptitudeTopic } from '../services/aptitudeAdminService';
import AptitudeTopicModal from '../components/aptitude/AptitudeTopicModal';
import AptitudeChapterDetail from './AptitudeChapterDetail';
import CacheManager from '../../../utils/cacheManager';

interface AptitudeDashboardProps {
  onBack: () => void;
}

export default function AptitudeDashboard({ onBack }: AptitudeDashboardProps) {
  const [topics, setTopics] = useState<AptitudeTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<AptitudeTopic | null>(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<AptitudeTopic | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const result = await aptitudeAdminService.getTopics();
      setTopics(result.topics);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (data: any) => {
    try {
      await aptitudeAdminService.createTopic(data);
      toast.success('Topic created successfully!');
      setShowTopicModal(false);
      // Clear cache after creation
      CacheManager.clearQuestionCache();
      fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create topic');
    }
  };

  const handleUpdateTopic = async (data: any) => {
    try {
      if (!editingTopic?.id) return;
      await aptitudeAdminService.updateTopic(editingTopic.id, data);
      toast.success('Topic updated successfully!');
      setShowTopicModal(false);
      setEditingTopic(null);
      // Clear cache after update
      CacheManager.clearQuestionCache();
      fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update topic');
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic? This will also delete all chapters and questions.')) return;
    try {
      await aptitudeAdminService.deleteTopic(topicId);
      toast.success('Topic deleted successfully!');
      // Clear cache for this topic
      CacheManager.clearQuestionCache(topicId);
      fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete topic');
    }
  };

  if (selectedTopic) {
    return (
      <AptitudeChapterDetail
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
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
            Back to Dashboard
          </button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Aptitude Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage topics, chapters, and questions - Total: {topics.length}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTopic(null);
                setShowTopicModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={20} />
              Add Topic
            </button>
          </div>
        </div>

        {/* Topics Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No topics created yet</p>
            <button
              onClick={() => {
                setEditingTopic(null);
                setShowTopicModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus size={20} />
              Create First Topic
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6"
              >
                {/* Topic Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{topic.icon || '📚'}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{topic.name}</h3>
                      <p className="text-sm text-gray-500">{topic.chapters?.length || 0} chapters</p>
                    </div>
                  </div>
                </div>

                {/* Topic Description */}
                {topic.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {topic.description}
                  </p>
                )}

                {/* Chapters Preview */}
                {topic.chapters && topic.chapters.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {topic.chapters.slice(0, 3).map((chapter) => (
                      <div key={chapter.id} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <ChevronRight size={14} />
                        {chapter.name}
                      </div>
                    ))}
                    {topic.chapters.length > 3 && (
                      <div className="text-sm text-gray-500 italic">+{topic.chapters.length - 3} more</div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSelectedTopic(topic)}
                    className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Manage
                  </button>
                  <button
                    onClick={() => {
                      setEditingTopic(topic);
                      setShowTopicModal(true);
                    }}
                    className="px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition text-sm font-medium"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => topic.id && handleDeleteTopic(topic.id)}
                    className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition text-sm font-medium"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Topic Modal */}
      {showTopicModal && (
        <AptitudeTopicModal
          topic={editingTopic}
          onSave={editingTopic ? handleUpdateTopic : handleCreateTopic}
          onClose={() => {
            setShowTopicModal(false);
            setEditingTopic(null);
          }}
        />
      )}
    </div>
  );
}
