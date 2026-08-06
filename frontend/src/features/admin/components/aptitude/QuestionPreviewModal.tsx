import React, { useState } from 'react';
import { X, Lightbulb, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import { AptitudeQuestion } from '../../services/aptitudeAdminService';

const DIFF_COLOR: Record<string, string> = {
  easy:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  hard:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

interface Props {
  question: AptitudeQuestion;
  onClose: () => void;
}

export default function QuestionPreviewModal({ question, onClose }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (key: string) => {
    if (revealed) return;
    setSelected(key);
  };

  const handleReveal = () => setRevealed(true);

  const getOptionClass = (key: string) => {
    const base = 'w-full text-left flex items-center gap-3 p-3.5 rounded-xl border-2 transition text-sm';
    if (!revealed) {
      return `${base} ${selected === key ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/40'} cursor-pointer`;
    }
    if (key === question.correctOption) return `${base} border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default`;
    if (key === selected) return `${base} border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default`;
    return `${base} border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700/40 opacity-50 cursor-default`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl my-4">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Question Preview</span>
            {question.difficulty && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${DIFF_COLOR[question.difficulty] || ''}`}>
                {question.difficulty}
              </span>
            )}
            {question.questionType && question.questionType !== 'MCQ' && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                {question.questionType}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Statement */}
          <p className="text-gray-900 dark:text-white font-medium leading-relaxed text-[0.95rem]">
            {question.statement}
          </p>

          {/* Image */}
          {question.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <img src={question.imageUrl} alt="Question diagram" className="max-h-56 mx-auto object-contain p-2" />
            </div>
          )}

          {/* Hints */}
          {question.hints && !revealed && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
              <Lightbulb size={15} className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-700 dark:text-yellow-400">{question.hints}</p>
            </div>
          )}

          {/* Options */}
          {question.options && question.options.length > 0 && (
            <div className="space-y-2">
              {question.options.map((opt) => (
                <button key={opt.optionKey} type="button" className={getOptionClass(opt.optionKey)} onClick={() => handleSelect(opt.optionKey)}>
                  <span className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    revealed && opt.optionKey === question.correctOption ? 'bg-green-500 text-white' :
                    revealed && opt.optionKey === selected ? 'bg-red-500 text-white' :
                    selected === opt.optionKey ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>{opt.optionKey}</span>
                  <span className="flex-1 text-gray-900 dark:text-white">{opt.text}</span>
                  {revealed && opt.optionKey === question.correctOption && <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />}
                  {revealed && opt.optionKey === selected && opt.optionKey !== question.correctOption && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* Check Answer / Reveal */}
          {!revealed ? (
            <button
              type="button"
              onClick={handleReveal}
              disabled={!selected}
              className="w-full py-2.5 rounded-xl font-semibold text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
            >
              Check Answer
            </button>
          ) : (
            <div className={`p-4 rounded-xl border ${selected === question.correctOption ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
              <p className={`text-sm font-semibold ${selected === question.correctOption ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {selected === question.correctOption ? '✓ Correct!' : `✗ Incorrect. Correct answer: ${question.correctOption}`}
              </p>
            </div>
          )}

          {/* Explanation */}
          {revealed && question.explanation && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Explanation</span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Step solution */}
          {revealed && question.stepSolution && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Step-by-step Solution</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">{question.stepSolution}</p>
            </div>
          )}

          {/* Formula */}
          {question.formula && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Formula:</span>
              <code className="text-xs text-gray-800 dark:text-gray-200 font-mono">{question.formula}</code>
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap text-xs text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-700">
            {question.xpReward && <span>⚡ {question.xpReward} XP</span>}
            {question.timeLimit && <span>⏱ {question.timeLimit}s</span>}
            {question.tags && <span>🏷 {question.tags}</span>}
            {question.companies && <span>🏢 {question.companies}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
