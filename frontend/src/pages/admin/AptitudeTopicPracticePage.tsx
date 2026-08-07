import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { aptitudeAdminService } from '../../features/admin/services/aptitudeAdminService';

export default function AptitudeTopicPracticePage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicId) fetchTopic();
  }, [topicId]);

  const fetchTopic = async () => {
    try {
      setLoading(true);
      const data = await aptitudeAdminService.getTopic(topicId!);
      setTopic(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const chapters = topic?.chapters || [];
  const topicName = topic?.name || '';
  const sectionName = topic?.section || '';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/aptitude')}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{sectionName}</p>
                <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
                  {topicName}
                </h1>
              </div>
            </div>
            <button
              onClick={() => navigate(`/admin/aptitude/topics/${topicId}/questions`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
            >
              <Plus size={16} />
              Add Question
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-400 text-sm mt-3">Loading chapters...</p>
          </div>
        ) : chapters.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-base mb-4">
              No chapters available in this topic yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Stats */}
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-xl px-5 py-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen size={16} className="text-green-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">{chapters.length}</span> Chapters
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {chapters.reduce((sum: number, ch: any) => sum + (ch.questions?.length || 0), 0)}
                  </span> Questions
                </div>
              </div>
            </div>

            {/* Chapters List */}
            {chapters.map((chapter: any, index: number) => {
              const qCount = Array.isArray(chapter.questions) ? chapter.questions.length : 0;
              return (
                <button
                  key={chapter.id}
                  onClick={() => navigate(`/admin/aptitude/topics/${topicId}/questions?chapter=${chapter.id}`)}
                  className="w-full flex items-center gap-4 px-5 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-green-300 dark:hover:border-green-700 hover:shadow-sm transition group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-green-600 dark:group-hover:text-green-400 transition truncate">
                      {chapter.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {qCount} question{qCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-green-500 transition flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
