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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    statement: '',
    difficulty: 'medium',
    explanation: '',
    options: [
      { optionKey: 'A', text: '', isCorrect: false },
      { optionKey: 'B', text: '', isCorrect: false },
      { optionKey: 'C', text: '', isCorrect: false },
      { optionKey: 'D', text: '', isCorrect: false },
    ],
  });

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

  const handleAddQuestion = async () => {
    if (!newQuestion.statement.trim()) {
      toast.error('Question statement is required');
      return;
    }
    if (!newQuestion.options.every(o => o.text.trim())) {
      toast.error('All options must have text');
      return;
    }
    if (!newQuestion.options.some(o => o.isCorrect)) {
      toast.error('Mark one option as correct');
      return;
    }
    try {
      setSaving(true);
      await aptitudeAdminService.createQuestion(topicId!, selectedChapter, {
        statement: newQuestion.statement,
        difficulty: newQuestion.difficulty,
        explanation: newQuestion.explanation || undefined,
        options: newQuestion.options,
      } as any);
      toast.success('Question added!');
      setShowAddForm(false);
      setNewQuestion({
        statement: '',
        difficulty: 'medium',
        explanation: '',
        options: [
          { optionKey: 'A', text: '', isCorrect: false },
          { optionKey: 'B', text: '', isCorrect: false },
          { optionKey: 'C', text: '', isCorrect: false },
          { optionKey: 'D', text: '', isCorrect: false },
        ],
      });
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add question');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (q: AptitudeQuestion) => {
    setEditingId(q.id!);
    setNewQuestion({
      statement: q.statement || '',
      difficulty: q.difficulty || 'medium',
      explanation: q.explanation || '',
      options: q.options?.map(o => ({
        optionKey: o.optionKey,
        text: o.text,
        isCorrect: o.optionKey === q.correctOption,
      })) || [
        { optionKey: 'A', text: '', isCorrect: false },
        { optionKey: 'B', text: '', isCorrect: false },
        { optionKey: 'C', text: '', isCorrect: false },
        { optionKey: 'D', text: '', isCorrect: false },
      ],
    });
    setShowAddForm(true);
  };

  const handleSaveQuestion = async () => {
    if (!newQuestion.statement.trim()) {
      toast.error('Question statement is required');
      return;
    }
    if (!newQuestion.options.every(o => o.text.trim())) {
      toast.error('All options must have text');
      return;
    }
    if (!newQuestion.options.some(o => o.isCorrect)) {
      toast.error('Mark one option as correct');
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        // Update existing
        await aptitudeAdminService.updateQuestion(topicId!, selectedChapter, editingId, {
          statement: newQuestion.statement,
          difficulty: newQuestion.difficulty,
          explanation: newQuestion.explanation || undefined,
          options: newQuestion.options,
        } as any);
        toast.success('Question updated!');
      } else {
        // Create new
        await aptitudeAdminService.createQuestion(topicId!, selectedChapter, {
          statement: newQuestion.statement,
          difficulty: newQuestion.difficulty,
          explanation: newQuestion.explanation || undefined,
          options: newQuestion.options,
        } as any);
        toast.success('Question added!');
      }
      setShowAddForm(false);
      setEditingId(null);
      setNewQuestion({
        statement: '',
        difficulty: 'medium',
        explanation: '',
        options: [
          { optionKey: 'A', text: '', isCorrect: false },
          { optionKey: 'B', text: '', isCorrect: false },
          { optionKey: 'C', text: '', isCorrect: false },
          { optionKey: 'D', text: '', isCorrect: false },
        ],
      });
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save question');
    } finally {
      setSaving(false);
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
            <button
              onClick={() => { setEditingId(null); setNewQuestion({ statement: '', difficulty: 'medium', explanation: '', options: [{ optionKey: 'A', text: '', isCorrect: false }, { optionKey: 'B', text: '', isCorrect: false }, { optionKey: 'C', text: '', isCorrect: false }, { optionKey: 'D', text: '', isCorrect: false }] }); setShowAddForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
            >
              <Plus size={16} />
              Add Question
            </button>
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(q)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(q)}
                      className="p-2 text-gray-400 hover:text-red-500 transition"
                      title="Delete"
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

      {/* Add Question Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Question' : 'Add Question'}</h2>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              {/* Statement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Statement *</label>
                <textarea
                  value={newQuestion.statement}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, statement: e.target.value }))}
                  rows={3}
                  placeholder="Enter the question..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options * (click radio to mark correct)</label>
                <div className="space-y-2">
                  {newQuestion.options.map((opt, idx) => (
                    <div key={opt.optionKey} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={opt.isCorrect}
                        onChange={() => {
                          setNewQuestion(prev => ({
                            ...prev,
                            options: prev.options.map((o, i) => ({ ...o, isCorrect: i === idx })),
                          }));
                        }}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        {opt.optionKey}
                      </span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          setNewQuestion(prev => ({
                            ...prev,
                            options: prev.options.map((o, i) => i === idx ? { ...o, text: e.target.value } : o),
                          }));
                        }}
                        placeholder={`Option ${opt.optionKey}`}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explanation (optional)</label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                  rows={2}
                  placeholder="Explain the correct answer..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => { setShowAddForm(false); setEditingId(null); }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuestion}
                  disabled={saving}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium text-sm"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
