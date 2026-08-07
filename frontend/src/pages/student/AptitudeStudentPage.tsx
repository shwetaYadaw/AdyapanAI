import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, BookOpen, Search, ChevronRight, Zap, Target, ArrowLeft,
  CheckCircle2, XCircle, Trophy, BarChart3, Lightbulb, RotateCcw
} from 'lucide-react';
import { api } from '../../core/services/api';
import toast from 'react-hot-toast';

interface Topic {
  id: string;
  name: string;
  description?: string;
  order: number;
  chapters: { id: string; name: string; order: number }[];
}

interface QuestionOption {
  id: string;
  optionKey: string;
  text: string;
  order: number;
}

interface Question {
  id: string;
  statement: string;
  difficulty: string;
  options: QuestionOption[];
  explanation?: string;
  xpReward: number;
}

interface SubmissionResult {
  isCorrect: boolean;
  xpGained: number;
  correctOption: string;
  explanation: string | null;
}

type AnswerState = Record<string, {
  selectedOption: string;
  result: SubmissionResult | null;
  loading: boolean;
}>;

export default function AptitudeStudentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('Verbal Ability');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerState>({});

  // ─── Data Fetching ───────────────────────────────────────────────
  const { data: topics = [], isLoading: topicsLoading } = useQuery<Topic[]>({
    queryKey: ['aptitude-student-topics'],
    queryFn: async () => {
      const { data } = await api.get('/aptitude/topics');
      return data.data ?? [];
    },
  });

  const { data: chapterData, isLoading: chapterLoading } = useQuery<any>({
    queryKey: ['aptitude-chapter-detail', selectedTopic, selectedChapter],
    queryFn: async () => {
      if (!selectedTopic || !selectedChapter) return null;
      const { data } = await api.get(`/aptitude/topics/${selectedTopic}/chapters/${selectedChapter}`);
      return data.data;
    },
    enabled: !!selectedTopic && !!selectedChapter,
  });

  const { data: progress } = useQuery({
    queryKey: ['aptitude-student-progress'],
    queryFn: async () => {
      const { data } = await api.get('/aptitude/progress');
      return data.data;
    },
  });

  // ─── Computed ────────────────────────────────────────────────────
  const filteredTopics = useMemo(
    () => topics
      .filter((t: any) => t.section === activeSection)
      .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [topics, searchQuery, activeSection]
  );
  const currentTopic = topics.find(t => t.id === selectedTopic);
  const chapterQuestions: Question[] = chapterData?.questions ?? [];
  const totalChapters = topics.reduce((s, t) => s + (t.chapters?.length ?? 0), 0);

  const quizStats = useMemo(() => {
    const answered = Object.values(answers).filter(a => a.result);
    const correct = answered.filter(a => a.result?.isCorrect);
    return { answered: answered.length, correct: correct.length, total: chapterQuestions.length };
  }, [answers, chapterQuestions.length]);

  // ─── Select Option Handler (INSTANT - optimistic, no loading) ─────
  const handleOptionClick = (questionId: string, optionKey: string) => {
    // Already answered this question
    if (answers[questionId]?.result) return;

    // Find the question to check answer locally
    const question = chapterQuestions.find(q => q.id === questionId);
    if (!question) return;

    // We don't know correctOption from frontend data (API doesn't send it before submit)
    // So we show loading briefly but make it near-instant
    setAnswers(prev => ({
      ...prev,
      [questionId]: { selectedOption: optionKey, result: null, loading: true },
    }));

    // Fire API call
    api.post(`/aptitude/questions/${questionId}/submit`, {
      selectedOption: optionKey,
      timeSpent: 0,
    }).then(({ data }) => {
      const result = data.data as SubmissionResult;
      setAnswers(prev => ({
        ...prev,
        [questionId]: { selectedOption: optionKey, result, loading: false },
      }));
    }).catch((err: any) => {
      // On error, still show a local result (assume wrong since we can't verify)
      setAnswers(prev => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
      toast.error(err?.response?.data?.message || 'Network error');
    });
  };

  const resetQuiz = () => setAnswers({});

  // ═══════════════════════════════════════════════════════════════════
  // QUIZ VIEW - All questions at once, compact
  // ═══════════════════════════════════════════════════════════════════
  if (selectedChapter && selectedTopic) {
    if (chapterLoading) {
      return (
        <div className="page-wrapper flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (chapterQuestions.length === 0) {
      return (
        <div className="page-wrapper space-y-4">
          <button onClick={() => { setSelectedChapter(null); resetQuiz(); }}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-600 text-xs font-medium transition">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <Brain size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500 text-sm">No questions available yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="page-wrapper space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => { setSelectedChapter(null); resetQuiz(); }}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-medium transition">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            {quizStats.answered > 0 && (
              <>
                <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
                  {quizStats.correct}/{quizStats.answered} correct
                </span>
                <button onClick={resetQuiz} className="text-gray-400 hover:text-orange-500 transition">
                  <RotateCcw size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Chapter Title */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl px-5 py-4 text-white">
          <h2 className="text-lg font-bold">{chapterData?.name}</h2>
          <p className="text-sm text-orange-100 mt-0.5">{chapterQuestions.length} Questions</p>
        </div>

        {/* All Questions */}
        <div className="space-y-3">
          {chapterQuestions.map((q, qIdx) => {
            const answer = answers[q.id];
            const isAnswered = !!answer?.result;
            const isCorrect = answer?.result?.isCorrect;
            const isLoading = answer?.loading;

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIdx * 0.03 }}
                className={`bg-white dark:bg-gray-900 rounded-xl border p-4 transition-all ${
                  isAnswered
                    ? isCorrect
                      ? 'border-green-200 dark:border-green-800'
                      : 'border-red-200 dark:border-red-800'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                {/* Question */}
                <div className="flex gap-3 mb-3">
                  <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    isAnswered
                      ? isCorrect ? 'bg-green-100 dark:bg-green-900/40 text-green-600' : 'bg-red-100 dark:bg-red-900/40 text-red-600'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>{qIdx + 1}</span>
                  <div className="text-[15px] text-gray-800 dark:text-gray-200 font-medium leading-relaxed [&_table]:text-xs [&_table]:my-3 [&_table]:w-full [&_td]:px-3 [&_td]:py-2 [&_td]:border [&_td]:border-gray-300 dark:[&_td]:border-gray-600 [&_tr:first-child]:bg-gray-100 dark:[&_tr:first-child]:bg-gray-800 [&_tr:first-child]:font-bold" dangerouslySetInnerHTML={{ __html: q.statement.replace(/\n/g, '<br/>') }} />
                </div>

                {/* Options - 2 column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 ml-10">
                  {q.options.map((opt) => {
                    const isSelected = answer?.selectedOption === opt.optionKey;
                    const isCorrectOpt = isAnswered && answer?.result?.correctOption === opt.optionKey;
                    const isWrong = isAnswered && isSelected && !isCorrect;

                    let cls = 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/10 cursor-pointer';

                    if (isLoading && isSelected) {
                      cls = 'border-orange-400 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 cursor-wait';
                    } else if (isCorrectOpt) {
                      cls = 'border-green-400 dark:border-green-700 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300';
                    } else if (isWrong) {
                      cls = 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 line-through';
                    } else if (isAnswered) {
                      cls = 'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 opacity-50 cursor-default';
                    }

                    return (
                      <button
                        key={opt.optionKey}
                        onClick={() => handleOptionClick(q.id, opt.optionKey)}
                        disabled={isAnswered || isLoading}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${cls}`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isCorrectOpt ? 'bg-green-500 text-white' :
                          isWrong ? 'bg-red-500 text-white' :
                          isLoading && isSelected ? 'bg-orange-400 text-white' :
                          'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}>
                          {isCorrectOpt ? <CheckCircle2 size={13} /> : isWrong ? <XCircle size={13} /> : opt.optionKey}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation - slides open with transition */}
                <AnimatePresence>
                  {isAnswered && !isCorrect && answer?.result?.explanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden ml-10 mt-2.5"
                    >
                      <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <Lightbulb size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{answer.result.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                  {isAnswered && isCorrect && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-10 mt-2.5 space-y-2"
                    >
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <CheckCircle2 size={15} className="text-green-500" />
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">Correct! +{answer.result?.xpGained} XP</p>
                      </div>
                      {(q.explanation || answer.result?.explanation) && (
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <Lightbulb size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{answer.result?.explanation || q.explanation}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Stats (when all answered) */}
        {quizStats.answered === quizStats.total && quizStats.total > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Trophy size={18} className="text-amber-500" />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">All Done!</p>
                <p className="text-[10px] text-gray-500">{quizStats.correct}/{quizStats.total} correct ({Math.round((quizStats.correct/quizStats.total)*100)}%)</p>
              </div>
            </div>
            <button onClick={resetQuiz} className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
              Retry
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // CHAPTERS VIEW
  // ═══════════════════════════════════════════════════════════════════
  if (selectedTopic && currentTopic) {
    return (
      <div className="page-wrapper space-y-4">
        <button onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-medium transition">
          <ArrowLeft size={16} /> All Topics
        </button>

        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl px-5 py-4 text-white">
          <h2 className="text-lg font-bold">{currentTopic.name}</h2>
          <p className="text-xs text-orange-100 mt-0.5">{currentTopic.chapters?.length ?? 0} Chapters</p>
        </div>

        {currentTopic.chapters?.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <BookOpen size={28} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500 text-sm">No chapters available yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentTopic.chapters.map((chapter: any, idx: number) => (
              <motion.div key={chapter.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                onClick={() => { setSelectedChapter(chapter.id); resetQuiz(); }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3.5 hover:border-orange-400 hover:shadow-sm transition-all cursor-pointer group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors truncate">{chapter.name}</h4>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-500 transition flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // MAIN TOPICS VIEW
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="page-wrapper space-y-5 bg-brand-cream min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 text-white shadow-md">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-8 -translate-y-8">
          <Brain className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h1 className="font-bold text-xl">Aptitude Practice</h1>
          <p className="text-white/75 text-sm mt-1">Select a topic and start solving</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: BookOpen, label: 'Topics', value: topics.length, color: 'from-orange-500 to-amber-400' },
          { icon: Target, label: 'Chapters', value: totalChapters, color: 'from-blue-500 to-cyan-400' },
          { icon: Trophy, label: 'Solved', value: progress?.overall?.totalAttempted || 0, color: 'from-green-500 to-emerald-400' },
          { icon: BarChart3, label: 'Accuracy', value: `${progress?.overall?.accuracy || 0}%`, color: 'from-purple-500 to-pink-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-3 text-center">
            <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-1.5`}>
              <stat.icon size={14} className="text-white" />
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-[10px] text-gray-400 uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'Verbal Ability', label: 'Verbal Ability', icon: '🔤' },
          { key: 'Numerical Ability', label: 'Numerical Ability', icon: '🔢' },
          { key: 'Logical Reasoning', label: 'Logical Reasoning', icon: '🧠' },
        ].map((section) => {
          const count = topics.filter((t: any) => t.section === section.key).length;
          return (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeSection === section.key
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeSection === section.key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Topics */}
      {topicsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 mb-2" />
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1.5" />
              <div className="h-2.5 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <Brain size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-xs">{searchQuery ? `No topics matching "${searchQuery}"` : 'No topics available'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredTopics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => setSelectedTopic(topic.id)}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-4 cursor-pointer group hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-2 group-hover:shadow transition">
                <BookOpen size={14} className="text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight line-clamp-2 mb-1">
                {topic.name}
              </h3>
              <span className="text-[10px] text-gray-400 font-medium">
                {topic.chapters?.length ?? 0} chapters
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
