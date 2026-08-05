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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Aptitude Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Add Topics → Chapters → Questions</p>
          </div>
          {selectedTopic && (
            <button
              onClick={() => {
                setSelectedTopic(null);
                setSelectedChapter(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <ArrowLeft size={18} />
              Back to Topics
            </button>
          )}
        </div>

        {!selectedTopic ? (
          // Topics View
          <div className="space-y-4">
            <button
              onClick={() => setShowTopicModal(true)}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Topic
            </button>

            {loadingTopics ? (
              <div>Loading...</div>
            ) : topics.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500">No topics yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map(topic => (
                  <div key={topic.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedTopic(topic.id)}
                      className="flex-1 text-left hover:text-blue-600"
                    >
                      <h3 className="font-bold text-gray-900 dark:text-white">{topic.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{topic.chapters?.length || 0} chapters</p>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this topic and all its data?')) {
                          deleteTopicMutation.mutate(topic.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Topic Detail View
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{currentTopic?.name}</h2>

            <button
              onClick={() => setShowChapterModal(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Chapter
            </button>

            {/* Chapters */}
            <div className="space-y-3">
              {currentTopic?.chapters?.map(chapter => (
                <div key={chapter.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  {/* Chapter Header */}
                  <button
                    onClick={() => {
                      toggleChapter(chapter.id);
                      setSelectedChapter(expandedChapters.has(chapter.id) ? null : chapter.id);
                    }}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white">{chapter.name}</h3>
                    <span className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {chapter.questions?.length || 0} questions
                      </span>
                      {expandedChapters.has(chapter.id) ? <ChevronDown /> : <ChevronRight />}
                    </span>
                  </button>

                  {/* Questions */}
                  {expandedChapters.has(chapter.id) && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                      <button
                        onClick={() => {
                          setSelectedChapter(chapter.id);
                          setEditingQuestion(null);
                          setShowQuestionModal(true);
                        }}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Add Question
                      </button>

                      {chapter.questions?.map(question => (
                        <div key={question.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white font-medium">{question.statement}</p>
                              <div className="mt-2 flex gap-2 flex-wrap">
                                {question.options?.map(opt => (
                                  <span
                                    key={opt.optionKey}
                                    className={`text-xs px-2 py-1 rounded ${
                                      question.correctOption === opt.optionKey
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-bold'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                  >
                                    {opt.optionKey}: {opt.text}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedChapter(chapter.id);
                                  setEditingQuestion(question);
                                  setShowQuestionModal(true);
                                }}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Delete this question?')) {
                                    setSelectedChapter(chapter.id);
                                    deleteQuestionMutation.mutate(question.id);
                                  }
                                }}
                                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
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
