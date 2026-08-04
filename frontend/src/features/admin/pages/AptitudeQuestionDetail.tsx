import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { aptitudeAdminService, AptitudeTopic, AptitudeChapter, AptitudeQuestion } from '../services/aptitudeAdminService';
import AptitudeQuestionForm from '../components/aptitude/AptitudeQuestionForm';
import CacheManager from '../../../utils/cacheManager';

interface AptitudeQuestionDetailProps {
  topic: AptitudeTopic;
  chapter: AptitudeChapter;
  onBack: () => void;
}

export default function AptitudeQuestionDetail({
  topic,
  chapter,
  onBack,
}: AptitudeQuestionDetailProps) {
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AptitudeQuestion | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [chapter.id]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      if (!topic.id || !chapter.id) return;
      const result = await aptitudeAdminService.getQuestions(topic.id, chapter.id);
      setQuestions(result.questions);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (data: any) => {
    try {
      if (!topic.id || !chapter.id) return;
      await aptitudeAdminService.createQuestion(topic.id, chapter.id, data);
      toast.success('Question created successfully!');
      setShowQuestionForm(false);
      // Clear cache after creation
      CacheManager.clearQuestionCache();
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create question');
    }
  };

  const handleUpdateQuestion = async (data: any) => {
    try {
      if (!editingQuestion?.id || !topic.id || !chapter.id) return;
      await aptitudeAdminService.updateQuestion(topic.id, chapter.id, editingQuestion.id, data);
      toast.success('Question updated successfully!');
      setShowQuestionForm(false);
      setEditingQuestion(null);
      // Clear cache after update
      CacheManager.clearQuestionCache(editingQuestion.id);
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      if (!topic.id || !chapter.id) return;
      await aptitudeAdminService.deleteQuestion(topic.id, chapter.id, questionId);
      toast.success('Question deleted successfully!');
      // Clear cache for this question
      CacheManager.clearQuestionCache(questionId);
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete question');
    }
  };

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
            Back to Chapters
          </button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {topic.name} &gt; {chapter.name}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Questions</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Total Questions: {questions.length}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setShowQuestionForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={20} />
              Add Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No questions created yet</p>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setShowQuestionForm(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus size={20} />
              Create First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6"
              >
                {/* Question Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded text-xs font-semibold">
                        Q{index + 1}
                      </span>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          question.difficulty === 'easy'
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                        }`}
                      >
                        {question.difficulty?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium mb-2 line-clamp-2">
                      {question.statement}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>🔷 {question.options?.length || 0} options</span>
                      <span>⭐ {question.xpReward || 0} XP</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingQuestion(question);
                        setShowQuestionForm(true);
                      }}
                      className="px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => question.id && handleDeleteQuestion(question.id)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Options Preview */}
                {question.options && question.options.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                    {question.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`text-sm ${
                          opt.isCorrect
                            ? 'text-green-600 dark:text-green-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <span className="font-bold">{opt.optionKey}.</span> {opt.text}
                        {opt.isCorrect && <span className="ml-2">✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <AptitudeQuestionForm
          question={editingQuestion}
          onSave={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
          onClose={() => {
            setShowQuestionForm(false);
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
}
