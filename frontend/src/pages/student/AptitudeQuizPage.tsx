import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, XCircle, Brain,
  HelpCircle, Trophy, AlertCircle, BookOpen,
} from 'lucide-react';
import Card from '../../shared/components/Card/Card';
import Badge from '../../shared/components/Badge/Badge';
import { findTopic } from './aptitudeData';
import {
  TCS_NUMERICAL_TOPICS,
  TCS_REASONING_TOPICS,
  TCS_VERBAL_TOPICS,
} from './AptitudePage';

export default function AptitudeQuizPage() {
  const { module, topicSlug: slug } = useParams<{ module: string; topicSlug: string }>();

  const allTopics =
    module === 'tcs-reasoning'
      ? TCS_REASONING_TOPICS
      : module === 'tcs-verbal'
        ? TCS_VERBAL_TOPICS
        : TCS_NUMERICAL_TOPICS;
  const topic = slug ? findTopic(allTopics, slug) : undefined;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center space-y-4 mt-20">
        <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
        <p className="text-gray-500 font-medium">Topic not found.</p>
        <Link to="/student/aptitude" className="text-primary-600 text-sm underline">
          ← Back to Aptitude
        </Link>
      </div>
    );
  }

  const handleSelectOption = (key: string, option: string) => {
    if (selectedAnswers[key]) return;
    setSelectedAnswers((prev) => ({ ...prev, [key]: option }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = topic.questions.filter(
    (q, i) => selectedAnswers[`q-${i}`] === q.answer
  ).length;
  const allAnswered = answeredCount === topic.questions.length;

  const moduleLabel =
    module === 'tcs-reasoning'
      ? 'Adyapan Reasoning Ability'
      : module === 'tcs-verbal'
        ? 'Adyapan Verbal Ability'
        : 'Adyapan Numerical Ability';

  return (
    <div className="page-wrapper space-y-6">

      {/* Back link */}
      <Link
        to="/student/aptitude"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Aptitude
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-7 text-white shadow-lg">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-8 -translate-y-8 scale-150">
          <Brain className="w-72 h-72" />
        </div>
        <div className="relative z-10 space-y-2">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
            {moduleLabel}
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl">{topic.name}</h1>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Badge variant="primary" className="bg-white/20 text-white border-white/30 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {topic.questions.length} Questions
            </Badge>
            {allAnswered && (
              <Badge variant="success" className="bg-white/20 text-white border-white/30 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Score: {correctCount}/{topic.questions.length} ({Math.round((correctCount / topic.questions.length) * 100)}%)
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Score banner */}
      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 flex items-center gap-4"
        >
          <Trophy className="w-8 h-8 text-green-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800 dark:text-green-300">
              Quiz Complete! You scored {correctCount} / {topic.questions.length}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
              {Math.round((correctCount / topic.questions.length) * 100)}% accuracy —{' '}
              {correctCount === topic.questions.length
                ? 'Perfect score! 🎉'
                : correctCount >= topic.questions.length * 0.7
                ? 'Great job! Keep it up.'
                : "Keep practising — you'll get there!"}
            </p>
          </div>
        </motion.div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {topic.questions.map((q, qIdx) => {
          const key = `q-${qIdx}`;
          const selected = selectedAnswers[key];
          const isExplanationOpen = showExplanations[key];

          const optionLabels = ['A', 'B', 'C', 'D', 'E'];

          return (
            <Card key={qIdx} padding="none" className="border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              {/* Question header */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex gap-3">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 shrink-0">{qIdx + 1}.</span>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{q.question}</p>
                </div>

                {/* Question Image */}
                {q.questionImage && (
                  <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <img
                      src={q.questionImage}
                      alt="Question visualization"
                      className="w-full h-auto object-contain max-h-64"
                    />
                  </div>
                )}

              </div>

              {/* Options */}
              <div className="px-5 py-3 space-y-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selected === opt;
                  const isCorrect = opt === q.answer;
                  const answered = selected !== undefined;
                  const label = optionLabels[oIdx] ?? String(oIdx + 1);

                  let containerCls = 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-gray-900 cursor-pointer';
                  let labelCls = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
                  let textCls = 'text-gray-700 dark:text-gray-300';

                  if (answered) {
                    if (isCorrect) {
                      containerCls = 'border-green-400 bg-green-50 dark:bg-green-950/30 cursor-default';
                      labelCls = 'bg-green-500 text-white';
                      textCls = 'text-green-800 dark:text-green-300 font-semibold';
                    } else if (isSelected) {
                      containerCls = 'border-red-400 bg-red-50 dark:bg-red-950/20 cursor-default';
                      labelCls = 'bg-red-500 text-white';
                      textCls = 'text-red-700 dark:text-red-400';
                    } else {
                      containerCls = 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-default opacity-60';
                    }
                  }

                  return (
                    <button key={opt} disabled={!!selected} onClick={() => handleSelectOption(key, opt)}
                      className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${containerCls}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${labelCls}`}>
                        {label}
                      </span>
                      <span className={`flex-1 ${textCls}`}>{opt}</span>
                      {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                      {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Answer + Explanation */}
              {selected !== undefined && (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="px-5 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-3">

                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold flex items-center gap-1.5 ${selected === q.answer ? 'text-green-600' : 'text-red-500'}`}>
                        {selected === q.answer
                          ? <><CheckCircle2 className="w-4 h-4" /> Correct! Well done.</>
                          : <><AlertCircle className="w-4 h-4" /> Incorrect. Answer: <span className="text-green-600 ml-1">{q.answer}</span></>}
                      </span>
                      <button onClick={() => setShowExplanations(p => ({ ...p, [key]: !p[key] }))}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all">
                        {isExplanationOpen ? 'Hide' : 'Show'} Explanation
                      </button>
                    </div>

                    {isExplanationOpen && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 px-4 py-3">
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5">Explanation:</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{q.explanation}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </Card>
          );
        })}
      </div>

      {/* Bottom back link */}
      <Link
        to="/student/aptitude"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all chapters
      </Link>
    </div>
  );
}
