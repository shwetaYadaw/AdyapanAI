import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { aptitudeAdminService, AptitudeQuestion } from '../../features/admin/services/aptitudeAdminService';

export default function AptitudeQuestionsPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [searchParams] = useSearchParams();
  const chapterIdFromUrl = searchParams.get('chapter');
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>(chapterIdFromUrl || '');
  const [loading, setLoading] = useState(true);
  const [topicName, setTopicName] = useState('');

  useEffect(() => {
    if (topicId) {
      fetchTopic();
      fetchChapters();
    }
  }, [topicId]);

  useEffect(() => {
    if (topicId && selectedChapter) {
      fetchQuestions();
    }
  }, [topicId, selectedChapter]);

  const fetchTopic = async () => {
    try {
      const topic = await aptitudeAdminService.getTopic(topicId!);
      setTopicName(topic.name);
    } catch {}
  };

  const fetchChapters = async () => {
    try {
      const result = await aptitudeAdminService.getChapters(topicId!);
      setChapters(result.chapters);
      if (!selectedChapter && result.chapters.length > 0) {
        setSelectedChapter(chapterIdFromUrl || result.chapters[0].id!);
      }
    } catch (err: any) {
      toast.error('Failed to load chapters');
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const result = await aptitudeAdminService.getQuestions(topicId!, selectedChapter, { limit: 100 });
      setQuestions(result.questions);
    } catch (err: any) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (q: AptitudeQuestion) => {
    if (!confirm('Delete this question?')) return;
    try {
      await aptitudeAdminService.deleteQuestion(topicId!, q.chapterId || selectedChapter, q.id!);
      toast.success('Question deleted');
      fetchQuestions();
    } catch {
      toast.error('Failed to delete question');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/admin/aptitude/topics/${topicId}/practice`)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{topicName}</p>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Questions</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Chapter Tabs */}
        {chapters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chapters.map((ch: any) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChapter(ch.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedChapter === ch.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {ch.name}
              </button>
            ))}
          </div>
        )}

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-400 text-sm mt-3">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No questions in this chapter yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{questions.length} question(s)</p>
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <span className="text-gray-500 mr-2">{index + 1}.</span>
                      {q.statement}
                    </p>
                    {/* Options */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt) => (
                        <div
                          key={opt.optionKey}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
                            opt.optionKey === q.correctOption
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 font-semibold'
                              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            opt.optionKey === q.correctOption
                              ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                          }`}>
                            {opt.optionKey}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>
                    {/* Meta */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        q.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(q)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
