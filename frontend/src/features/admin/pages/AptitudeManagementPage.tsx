import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../core/services/api';
import toast from 'react-hot-toast';

interface Topic {
  id: string;
  name: string;
  description?: string;
  chapters?: Chapter[];
}

interface Chapter {
  id: string;
  name: string;
  topicId: string;
  questions?: Question[];
}

interface Question {
  id: string;
  statement: string;
  difficulty: string;
  correctOption: string;
  options: Array<{ optionKey: string; text: string }>;
  explanation?: string;
  xpReward?: number;
}

interface AptitudeManagementPageProps {
  onBack?: () => void;
}

export default function AptitudeManagementPage({ onBack }: AptitudeManagementPageProps) {
  const queryClient = useQueryClient();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // Modal states
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form states
  const [topicForm, setTopicForm] = useState({ name: '', description: '' });
  const [chapterForm, setChapterForm] = useState({ name: '', description: '' });
  const [questionForm, setQuestionForm] = useState({
    statement: '',
    difficulty: 'medium',
    options: [
      { optionKey: 'A', text: '' },
      { optionKey: 'B', text: '' },
      { optionKey: 'C', text: '' },
      { optionKey: 'D', text: '' },
    ],
    correctOption: 'A',
    explanation: '',
    xpReward: 1,
  });

  // Fetch topics
  const { data: topics = [], isLoading: loadingTopics, refetch: refetchTopics } = useQuery({
    queryKey: ['aptitude-topics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/aptitude/topics?limit=100');
      return data.data || [];
    },
  });

  // Create topic
  const createTopicMutation = useMutation({
    mutationFn: async () => {
      await api.post('/admin/aptitude/topics', topicForm);
    },
    onSuccess: () => {
      toast.success('Topic created!');
      setTopicForm({ name: '', description: '' });
      setShowTopicModal(false);
      refetchTopics();
    },
    onError: () => toast.error('Failed to create topic'),
  });

  // Create chapter
  const createChapterMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/admin/aptitude/topics/${selectedTopic}/chapters`, chapterForm);
    },
    onSuccess: () => {
      toast.success('Chapter created!');
      setChapterForm({ name: '', description: '' });
      setShowChapterModal(false);
      refetchTopics();
    },
    onError: () => toast.error('Failed to create chapter'),
  });

  // Create/Update question
  const saveQuestionMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...questionForm,
        options: questionForm.options.map(opt => ({
          optionKey: opt.optionKey,
          text: opt.text,
        })),
      };

      if (editingQuestion) {
        await api.put(
          `/admin/aptitude/topics/${selectedTopic}/chapters/${selectedChapter}/questions/${editingQuestion.id}`,
          payload
        );
      } else {
        await api.post(
          `/admin/aptitude/topics/${selectedTopic}/chapters/${selectedChapter}/questions`,
          payload
        );
      }
    },
    onSuccess: () => {
      toast.success(editingQuestion ? 'Question updated!' : 'Question created!');
      setQuestionForm({
        statement: '',
        difficulty: 'medium',
        options: [
          { optionKey: 'A', text: '' },
          { optionKey: 'B', text: '' },
          { optionKey: 'C', text: '' },
          { optionKey: 'D', text: '' },
        ],
        correctOption: 'A',
        explanation: '',
        xpReward: 1,
      });
      setEditingQuestion(null);
      setShowQuestionModal(false);
      refetchTopics();
    },
    onError: () => toast.error('Failed to save question'),
  });

  // Delete topic
  const deleteTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      await api.delete(`/admin/aptitude/topics/${topicId}`);
    },
    onSuccess: () => {
      toast.success('Topic deleted!');
      refetchTopics();
    },
    onError: () => toast.error('Failed to delete topic'),
  });

  // Delete question
  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      await api.delete(
        `/admin/aptitude/topics/${selectedTopic}/chapters/${selectedChapter}/questions/${questionId}`
      );
    },
    onSuccess: () => {
      toast.success('Question deleted!');
      refetchTopics();
    },
    onError: () => toast.error('Failed to delete question'),
  });

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const currentTopic = topics.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Aptitude Management</h1>
            <p className="text-emerald-100 text-sm mt-1">Topics → Chapters → MCQ Questions</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedTopic && (
              <button
                onClick={() => { setSelectedTopic(null); setSelectedChapter(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition text-sm font-medium"
              >
                <ArrowLeft size={16} /> All Topics
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              {topics.length} Topics
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {!selectedTopic ? (
          // Topics View
          <div className="space-y-5">
            <button
              onClick={() => setShowTopicModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold text-sm shadow-lg"
            >
              <Plus size={18} />
              Add Topic
            </button>

            {loadingTopics ? (
              <div className="text-center py-12 text-gray-400">Loading topics...</div>
            ) : topics.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <p className="text-gray-400 text-sm">No topics yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic: any) => (
                  <div key={topic.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group cursor-pointer" onClick={() => setSelectedTopic(topic.id)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition">{topic.name}</h3>
                        {topic.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{topic.description}</p>}
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold">{topic.chapters?.length || 0} chapters</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm('Delete this topic and all its data?')) deleteTopicMutation.mutate(topic.id); }}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Topic Detail View
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentTopic?.name}</h2>
              <button
                onClick={() => setShowChapterModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm shadow-lg"
              >
                <Plus size={18} />
                Add Chapter
              </button>
            </div>

            {/* Chapters */}
            <div className="space-y-3">
              {currentTopic?.chapters?.map((chapter: any) => (
                <div key={chapter.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  {/* Chapter Header */}
                  <button
                    onClick={() => { toggleChapter(chapter.id); setSelectedChapter(expandedChapters.has(chapter.id) ? null : chapter.id); }}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{chapter.name}</h3>
                    <span className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium">
                        {chapter.questions?.length || 0} Q
                      </span>
                      {expandedChapters.has(chapter.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  </button>

                  {/* Questions */}
                  {expandedChapters.has(chapter.id) && (
                    <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
                      <button
                        onClick={() => { setSelectedChapter(chapter.id); setEditingQuestion(null); setShowQuestionModal(true); }}
                        className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2 font-medium text-sm transition"
                      >
                        <Plus size={16} /> Add Question
                      </button>

                      {chapter.questions?.map((question: any) => (
                        <div key={question.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white font-medium leading-relaxed">{question.statement}</p>
                              <div className="mt-2 flex gap-2 flex-wrap">
                                {question.options?.map((opt: any) => (
                                  <span key={opt.optionKey} className={`text-[11px] px-2.5 py-1 rounded-lg font-medium ${question.correctOption === opt.optionKey ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 ring-1 ring-green-300 dark:ring-green-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                    {opt.optionKey}. {opt.text}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button onClick={() => { setSelectedChapter(chapter.id); setEditingQuestion(question); setShowQuestionModal(true); }} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 text-xs rounded-lg hover:bg-blue-100 font-medium transition">Edit</button>
                              <button onClick={() => { if (confirm('Delete?')) { setSelectedChapter(chapter.id); deleteQuestionMutation.mutate(question.id); } }} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"><Trash2 size={13} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic Modal */}
        {showTopicModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Topic</h2>
              <input
                type="text"
                placeholder="Topic name"
                value={topicForm.name}
                onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded mb-3 dark:bg-gray-700 dark:text-white"
              />
              <textarea
                placeholder="Description"
                value={topicForm.description}
                onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded mb-4 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTopicModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createTopicMutation.mutate()}
                  disabled={!topicForm.name || createTopicMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Modal */}
        {showChapterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Chapter</h2>
              <input
                type="text"
                placeholder="Chapter name"
                value={chapterForm.name}
                onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded mb-3 dark:bg-gray-700 dark:text-white"
              />
              <textarea
                placeholder="Description"
                value={chapterForm.description}
                onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded mb-4 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowChapterModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createChapterMutation.mutate()}
                  disabled={!chapterForm.name || createChapterMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full my-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingQuestion ? 'Edit Question' : 'Add Question'}
              </h2>

              {/* Question */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Question</label>
                <textarea
                  value={questionForm.statement}
                  onChange={(e) => setQuestionForm({ ...questionForm, statement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Options</label>
                <div className="space-y-2">
                  {questionForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={questionForm.correctOption === opt.optionKey}
                        onChange={() => setQuestionForm({ ...questionForm, correctOption: opt.optionKey })}
                        className="w-4 h-4"
                      />
                      <span className="font-bold w-8">{opt.optionKey}:</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...questionForm.options];
                          newOpts[idx].text = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOpts });
                        }}
                        placeholder="Option text"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Explanation</label>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowQuestionModal(false);
                    setEditingQuestion(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveQuestionMutation.mutate()}
                  disabled={!questionForm.statement || questionForm.options.some(o => !o.text) || saveQuestionMutation.isPending}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {editingQuestion ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
