import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Plus, Trash2, ChevronDown, ChevronRight, BookOpen, Brain,
  Edit2, X, BarChart3, Hash, Layers, AlertCircle, Search, Filter
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../core/services/api';
import toast from 'react-hot-toast';

interface AptitudeManagementPageProps { onBack?: () => void; }

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/40' },
  medium: { label: 'Medium', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  hard: { label: 'Hard', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/40' },
};

export default function AptitudeManagementPage({ onBack }: AptitudeManagementPageProps) {
  const queryClient = useQueryClient();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicForm, setTopicForm] = useState({ name: '', description: '' });
  const [chapterForm, setChapterForm] = useState({ name: '', description: '' });
  const [questionForm, setQuestionForm] = useState({
    statement: '',
    difficulty: 'medium' as Difficulty,
    options: [
      { optionKey: 'A', text: '' },
      { optionKey: 'B', text: '' },
      { optionKey: 'C', text: '' },
      { optionKey: 'D', text: '' },
    ],
    correctOption: 'A',
    explanation: '',
    xpReward: 10,
  });

  // ─── Data Fetching ───────────────────────────────────────────────
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['admin-aptitude-topics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/aptitude/topics?limit=100');
      return data.data || [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-aptitude-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/aptitude/stats');
      return data.data;
    },
  });

  // ─── Computed values ─────────────────────────────────────────────
  const totalQuestions = useMemo(() =>
    topics.reduce((sum: number, t: any) =>
      sum + (t.chapters?.reduce((cs: number, c: any) => cs + (c.questions?.length || 0), 0) || 0), 0
    ), [topics]);

  const totalChapters = useMemo(() =>
    topics.reduce((sum: number, t: any) => sum + (t.chapters?.length || 0), 0), [topics]);

  const filteredTopics = useMemo(() =>
    topics.filter((t: any) => t.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [topics, searchQuery]);

  const currentTopic = topics.find((t: any) => t.id === selectedTopic);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-aptitude-topics'] });
    queryClient.invalidateQueries({ queryKey: ['admin-aptitude-stats'] });
  };

  // ─── Mutations ───────────────────────────────────────────────────
  const createTopicMut = useMutation({
    mutationFn: async () => { await api.post('/admin/aptitude/topics', topicForm); },
    onSuccess: () => {
      toast.success('Topic created successfully');
      setTopicForm({ name: '', description: '' });
      setShowTopicModal(false);
      invalidateAll();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create topic'),
  });

  const createChapterMut = useMutation({
    mutationFn: async () => {
      await api.post(`/admin/aptitude/topics/${selectedTopic}/chapters`, chapterForm);
    },
    onSuccess: () => {
      toast.success('Chapter created successfully');
      setChapterForm({ name: '', description: '' });
      setShowChapterModal(false);
      invalidateAll();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create chapter'),
  });

  const saveQuestionMut = useMutation({
    mutationFn: async () => {
      const payload = {
        statement: questionForm.statement,
        difficulty: questionForm.difficulty,
        explanation: questionForm.explanation,
        xpReward: questionForm.xpReward,
        options: questionForm.options.map(o => ({
          optionKey: o.optionKey,
          text: o.text,
          isCorrect: o.optionKey === questionForm.correctOption,
        })),
      };
      if (editingQuestion) {
        await api.put(`/admin/aptitude/topics/${selectedTopic}/chapters/${selectedChapter}/questions/${editingQuestion.id}`, payload);
      } else {
        await api.post(`/admin/aptitude/topics/${selectedTopic}/chapters/${selectedChapter}/questions`, payload);
      }
    },
    onSuccess: () => {
      toast.success(editingQuestion ? 'Question updated' : 'Question created');
      resetQuestionForm();
      setShowQuestionModal(false);
      invalidateAll();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to save question'),
  });

  const deleteTopicMut = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/admin/aptitude/topics/${id}`); },
    onSuccess: () => { toast.success('Topic deleted'); invalidateAll(); },
    onError: () => toast.error('Failed to delete topic'),
  });

  const deleteChapterMut = useMutation({
    mutationFn: async ({ topicId, chapterId }: { topicId: string; chapterId: string }) => {
      await api.delete(`/admin/aptitude/topics/${topicId}/chapters/${chapterId}`);
    },
    onSuccess: () => { toast.success('Chapter deleted'); invalidateAll(); },
    onError: () => toast.error('Failed to delete chapter'),
  });

  const deleteQuestionMut = useMutation({
    mutationFn: async (qId: string) => {
      await api.delete(`/admin/aptitude/topics/${selectedTopic}/chapters/${selectedChapter}/questions/${qId}`);
    },
    onSuccess: () => { toast.success('Question deleted'); invalidateAll(); },
    onError: () => toast.error('Failed to delete question'),
  });

  // ─── Helpers ─────────────────────────────────────────────────────
  const resetQuestionForm = () => {
    setQuestionForm({
      statement: '', difficulty: 'medium',
      options: [{ optionKey: 'A', text: '' }, { optionKey: 'B', text: '' }, { optionKey: 'C', text: '' }, { optionKey: 'D', text: '' }],
      correctOption: 'A', explanation: '', xpReward: 10,
    });
    setEditingQuestion(null);
  };

  const toggleChapter = (id: string) => {
    const s = new Set(expandedChapters);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedChapters(s);
  };

  const openEditQuestion = (q: any, chapterId: string) => {
    setSelectedChapter(chapterId);
    setEditingQuestion(q);
    setQuestionForm({
      statement: q.statement,
      difficulty: q.difficulty || 'medium',
      options: q.options?.map((o: any) => ({ optionKey: o.optionKey, text: o.text })) || [
        { optionKey: 'A', text: '' }, { optionKey: 'B', text: '' },
        { optionKey: 'C', text: '' }, { optionKey: 'D', text: '' },
      ],
      correctOption: q.correctOption || 'A',
      explanation: q.explanation || '',
      xpReward: q.xpReward || 10,
    });
    setShowQuestionModal(true);
  };

  // ═══════════════════════════════════════════════════════════════════
  // TOPIC DETAIL VIEW
  // ═══════════════════════════════════════════════════════════════════
  if (selectedTopic && currentTopic) {
    const topicQuestionCount = currentTopic.chapters?.reduce(
      (sum: number, c: any) => sum + (c.questions?.length || 0), 0) || 0;

    return (
      <div className="min-h-screen bg-brand-cream dark:bg-gray-950 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => { setSelectedTopic(null); setSelectedChapter(null); setExpandedChapters(new Set()); }}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium transition"
          >
            <ArrowLeft size={16} /> Back to All Topics
          </button>

          {/* Topic Header Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-brand-amber px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentTopic.name}</h2>
                  {currentTopic.description && (
                    <p className="text-white/70 text-sm mt-1">{currentTopic.description}</p>
                  )}
                </div>
              <button onClick={() => setShowChapterModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-medium backdrop-blur-sm transition"
                >
                  <Plus size={14} /> Add Chapter
                </button>
              </div>
            </div>
            {/* Topic Stats Bar */}
            <div className="px-6 py-3 flex items-center gap-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Layers size={14} className="text-primary-500" />
                <span className="font-semibold text-gray-900 dark:text-white">{currentTopic.chapters?.length || 0}</span> Chapters
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Hash size={14} className="text-primary-500" />
                <span className="font-semibold text-gray-900 dark:text-white">{topicQuestionCount}</span> Questions
              </div>
            </div>
          </div>

          {/* Chapters List */}
          {currentTopic.chapters?.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <BookOpen size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No chapters yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Add your first chapter to start adding questions</p>
              <button onClick={() => setShowChapterModal(true)} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition">
                <Plus size={14} className="inline mr-1" /> Add Chapter
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentTopic.chapters.map((chapter: any, idx: number) => {
                const isExpanded = expandedChapters.has(chapter.id);
                const qCount = chapter.questions?.length || 0;
                return (
                  <motion.div key={chapter.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                    className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg"
                  >
                    {/* Chapter Header */}
                    <div className="flex items-center">
                      <button
                        onClick={() => { toggleChapter(chapter.id); setSelectedChapter(isExpanded ? null : chapter.id); }}
                        className="flex-1 px-5 py-4 flex items-center gap-4 hover:bg-gray-800/50 transition text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm truncate">{chapter.name}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{qCount} question{qCount !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${qCount > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                            {qCount > 0 ? `${qCount} Q` : 'Empty'}
                          </span>
                          {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                        </div>
                      </button>
                      <button
                        onClick={() => { if (confirm('Delete this chapter and all its questions?')) deleteChapterMut.mutate({ topicId: selectedTopic!, chapterId: chapter.id }); }}
                        className="px-3 py-4 text-gray-300 hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Expanded Questions */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-gray-800"
                        >
                          <div className="bg-gray-950 px-5 py-4 space-y-3">
                            {/* Add Question Button */}
                            <button
                              onClick={() => { setSelectedChapter(chapter.id); setEditingQuestion(null); resetQuestionForm(); setShowQuestionModal(true); }}
                              className="w-full py-2.5 border-2 border-dashed border-primary-600/40 hover:border-primary-500 hover:bg-primary-600/10 text-primary-400 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                            >
                              <Plus size={14} /> Add Question
                            </button>

                            {/* Question Cards */}
                            {chapter.questions?.length === 0 && (
                              <p className="text-center text-xs text-gray-400 py-4">No questions in this chapter yet</p>
                            )}
                            {chapter.questions?.map((q: any, qIdx: number) => (
                              <div key={q.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition">
                                <div className="flex items-start gap-3">
                                  <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[11px] font-bold text-gray-500 flex-shrink-0 mt-0.5">
                                    {qIdx + 1}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-200 font-medium leading-relaxed">{q.statement}</p>
                                    {/* Options Grid */}
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {q.options?.map((opt: any) => (
                                        <div key={opt.optionKey}
                                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border ${
                                            opt.optionKey === q.correctOption
                                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300'
                                              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                          }`}
                                        >
                                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                            opt.optionKey === q.correctOption
                                              ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                          }`}>{opt.optionKey}</span>
                                          <span className="truncate">{opt.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Meta Row */}
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_CONFIG[q.difficulty as Difficulty]?.bg || ''} ${DIFFICULTY_CONFIG[q.difficulty as Difficulty]?.color || ''}`}>
                                        {DIFFICULTY_CONFIG[q.difficulty as Difficulty]?.label || q.difficulty}
                                      </span>
                                      {q.explanation && <span className="text-[10px] text-blue-500 font-medium">Has explanation</span>}
                                    </div>
                                  </div>
                                  {/* Action buttons */}
                                  <div className="flex flex-col gap-1 flex-shrink-0">
                                    <button onClick={() => openEditQuestion(q, chapter.id)}
                                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                                      <Edit2 size={13} />
                                    </button>
                                    <button onClick={() => { if (confirm('Delete this question?')) { setSelectedChapter(chapter.id); deleteQuestionMut.mutate(q.id); } }}
                                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
        {renderModals()}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // MAIN TOPICS VIEW
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-brand-cream dark:bg-gray-950">
      {/* Header */}
      <div className="mx-4 sm:mx-6 mt-4 bg-gradient-to-r from-primary-600 via-primary-500 to-brand-amber rounded-2xl p-6 shadow-brand">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-2 transition">
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Brain size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Aptitude Management</h1>
                <p className="text-white/70 text-sm mt-0.5">Manage topics, chapters, and MCQ questions</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowTopicModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} /> New Topic
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Topics', value: topics.length, icon: BookOpen, color: 'from-primary-500 to-primary-600' },
            { label: 'Chapters', value: totalChapters, icon: Layers, color: 'from-primary-400 to-primary-500' },
            { label: 'Questions', value: totalQuestions, icon: Hash, color: 'from-primary-500 to-brand-amber' },
            { label: 'Avg/Topic', value: topics.length > 0 ? Math.round(totalQuestions / topics.length) : 0, icon: BarChart3, color: 'from-brand-amber to-primary-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition shadow-md"
          />
        </div>

        {/* Topics Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-5 animate-pulse border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1"><div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" /><div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            {searchQuery ? (
              <>
                <Search size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 font-medium">No topics matching "{searchQuery}"</p>
              </>
            ) : (
              <>
                <Brain size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 font-medium">No topics yet</p>
                <p className="text-gray-400 text-sm mt-1">Create your first topic to start building the aptitude question bank</p>
                <button onClick={() => setShowTopicModal(true)} className="mt-4 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition">
                  <Plus size={14} className="inline mr-1" /> Create First Topic
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic: any, idx: number) => {
              const topicQCount = topic.chapters?.reduce((s: number, c: any) => s + (c.questions?.length || 0), 0) || 0;
              const firstChapter = topic.chapters?.[0];
              return (
                <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-5 group shadow-lg hover:shadow-xl hover:border-primary-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:shadow-brand transition-shadow cursor-pointer"
                      onClick={() => setSelectedTopic(topic.id)}>
                      <BookOpen size={18} className="text-white" />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete this topic and all its data?')) deleteTopicMut.mutate(topic.id); }}
                      className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h3 onClick={() => setSelectedTopic(topic.id)}
                    className="font-semibold text-white text-sm group-hover:text-primary-400 transition-colors line-clamp-2 mb-1 cursor-pointer">
                    {topic.name}
                  </h3>
                  {topic.description && (
                    <p className="text-xs text-gray-400 line-clamp-1 mb-3">{topic.description}</p>
                  )}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-700/50">
                    <span className="text-[11px] text-gray-400 font-medium">
                      <span className="text-white font-semibold">{topic.chapters?.length || 0}</span> chapters
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      <span className="text-white font-semibold">{topicQCount}</span> questions
                    </span>
                  </div>
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!firstChapter) {
                          toast.error('Pehle ek chapter add karo is topic mein');
                          setSelectedTopic(topic.id);
                          setShowChapterModal(true);
                          return;
                        }
                        setSelectedTopic(topic.id);
                        setSelectedChapter(firstChapter.id);
                        resetQuestionForm();
                        setShowQuestionModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600/20 text-primary-400 rounded-lg text-xs font-semibold hover:bg-primary-600/30 transition"
                    >
                      <Plus size={12} /> Add Question
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedTopic(topic.id); }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-700 transition"
                    >
                      Manage <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      {renderModals()}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════════════════════════════
  function renderModals() {
    return (
      <>
        {/* ─── Topic Modal ──────────────────────────────────────────── */}
        <AnimatePresence>
          {showTopicModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowTopicModal(false)}
            >
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">Create Topic</h2>
                  <button onClick={() => setShowTopicModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Topic Name *</label>
                    <input
                      placeholder="e.g., Quantitative Aptitude"
                      value={topicForm.name}
                      onChange={e => setTopicForm({ ...topicForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                    <textarea
                      placeholder="Brief description of this topic..."
                      value={topicForm.description}
                      onChange={e => setTopicForm({ ...topicForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                  <button onClick={() => setShowTopicModal(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition font-medium">Cancel</button>
                  <button onClick={() => createTopicMut.mutate()} disabled={!topicForm.name.trim() || createTopicMut.isPending}
                    className="px-5 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition">
                    {createTopicMut.isPending ? 'Creating...' : 'Create Topic'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Chapter Modal ────────────────────────────────────────── */}
        <AnimatePresence>
          {showChapterModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowChapterModal(false)}
            >
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">Add Chapter</h2>
                  <button onClick={() => setShowChapterModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Chapter Name *</label>
                    <input
                      placeholder="e.g., Percentages"
                      value={chapterForm.name}
                      onChange={e => setChapterForm({ ...chapterForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                    <textarea
                      placeholder="What this chapter covers..."
                      value={chapterForm.description}
                      onChange={e => setChapterForm({ ...chapterForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                  <button onClick={() => setShowChapterModal(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition font-medium">Cancel</button>
                  <button onClick={() => createChapterMut.mutate()} disabled={!chapterForm.name.trim() || createChapterMut.isPending}
                    className="px-5 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition">
                    {createChapterMut.isPending ? 'Creating...' : 'Create Chapter'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Question Modal ──────────────────────────────────────── */}
        <AnimatePresence>
          {showQuestionModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => { setShowQuestionModal(false); resetQuestionForm(); }}
            >
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-800 my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                  </h2>
                  <button onClick={() => { setShowQuestionModal(false); resetQuestionForm(); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                  {/* Chapter Selector */}
                  {currentTopic && currentTopic.chapters?.length > 1 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Add to Chapter *</label>
                      <select
                        value={selectedChapter || ''}
                        onChange={e => setSelectedChapter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                      >
                        {currentTopic.chapters.map((ch: any) => (
                          <option key={ch.id} value={ch.id}>{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Question Statement */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Question Statement *</label>
                    <textarea
                      value={questionForm.statement}
                      onChange={e => setQuestionForm({ ...questionForm, statement: e.target.value })}
                      rows={3}
                      placeholder="Type the question here..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition resize-none"
                      autoFocus
                    />
                  </div>

                  {/* Difficulty & XP */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Difficulty</label>
                      <select
                        value={questionForm.difficulty}
                        onChange={e => setQuestionForm({ ...questionForm, difficulty: e.target.value as Difficulty })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">XP Reward</label>
                      <input
                        type="number"
                        min={1}
                        value={questionForm.xpReward}
                        onChange={e => setQuestionForm({ ...questionForm, xpReward: parseInt(e.target.value) || 10 })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Options * <span className="normal-case font-normal">(select the correct answer)</span>
                    </label>
                    <div className="space-y-2.5">
                      {questionForm.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setQuestionForm({ ...questionForm, correctOption: opt.optionKey })}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition flex-shrink-0 ${
                              questionForm.correctOption === opt.optionKey
                                ? 'bg-green-500 border-green-500 text-white shadow-md'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 hover:border-green-400'
                            }`}
                          >
                            {opt.optionKey}
                          </button>
                          <input
                            value={opt.text}
                            onChange={e => {
                              const opts = [...questionForm.options];
                              opts[i] = { ...opts[i], text: e.target.value };
                              setQuestionForm({ ...questionForm, options: opts });
                            }}
                            placeholder={`Option ${opt.optionKey}`}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                      <AlertCircle size={10} /> Click the letter circle to mark the correct answer
                    </p>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Explanation (optional)</label>
                    <textarea
                      value={questionForm.explanation}
                      onChange={e => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                      rows={2}
                      placeholder="Explain the answer (shown to students who answer incorrectly)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                  <button onClick={() => { setShowQuestionModal(false); resetQuestionForm(); }}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition font-medium">Cancel</button>
                  <button
                    onClick={() => saveQuestionMut.mutate()}
                    disabled={!questionForm.statement.trim() || questionForm.options.some(o => !o.text.trim()) || saveQuestionMut.isPending}
                    className="px-5 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
                  >
                    {saveQuestionMut.isPending ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
}
