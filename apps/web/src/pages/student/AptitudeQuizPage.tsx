import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, XCircle, Brain,
  HelpCircle, Trophy, AlertCircle, BookOpen,
} from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import { findTopic } from './aptitudeData';
import { TCS_NUMERICAL_TOPICS, TCS_REASONING_TOPICS } from './AptitudePage';

export default function AptitudeQuizPage() {
  const { module, topicSlug: slug } = useParams<{ module: string; topicSlug: string }>();

  const allTopics =
    module === 'tcs-reasoning' ? TCS_REASONING_TOPICS : TCS_NUMERICAL_TOPICS;
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
    module === 'tcs-reasoning' ? 'TCS Reasoning Ability' : 'TCS Numerical Ability';

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

          return (
            <Card
              key={qIdx}
              padding="md"
              className="border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="space-y-4">
                {/* Question text */}
                <div className="flex gap-2.5">
                  <span className="text-sm font-bold text-primary-500 mt-0.5 flex-shrink-0">
                    Q{qIdx + 1}.
                  </span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                    {q.question}
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = selected === opt;
                    const isCorrect = opt === q.answer;
                    const answered = selected !== undefined;

                    let cls =
                      'border-gray-200 hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-700 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 cursor-pointer';
                    let icon: React.ReactNode = null;

                    if (answered) {
                      if (isCorrect) {
                        cls =
                          'border-green-500 bg-green-50/60 dark:bg-green-950/20 text-green-800 dark:text-green-300 cursor-default';
                        icon = <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
                      } else if (isSelected) {
                        cls =
                          'border-red-500 bg-red-50/60 dark:bg-red-950/20 text-red-700 dark:text-red-400 cursor-default';
                        icon = <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
                      } else {
                        cls =
                          'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-400 dark:text-gray-600 cursor-default';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        disabled={!!selected}
                        onClick={() => handleSelectOption(key, opt)}
                        className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all ${cls}`}
                      >
                        {icon && <span>{icon}</span>}
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Result + explanation */}
                {selected !== undefined && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2 pt-1 border-t border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-between pt-2">
                        {selected === q.answer ? (
                          <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct!
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Incorrect — Correct answer: <span className="text-green-600">{q.answer}</span>
                          </span>
                        )}
                        <button
                          onClick={() =>
                            setShowExplanations((p) => ({ ...p, [key]: !p[key] }))
                          }
                          className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {isExplanationOpen ? 'Hide' : 'Show'} Explanation
                        </button>
                      </div>

                      {isExplanationOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800/50 px-4 py-3"
                        >
                          <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">
                            Step-by-step explanation:
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                            {q.explanation}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
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
