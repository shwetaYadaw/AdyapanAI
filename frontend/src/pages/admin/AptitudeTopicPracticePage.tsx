import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, XCircle, Plus, Megaphone } from 'lucide-react';
import { aptitudeAdminService, AptitudeQuestion } from '../../features/admin/services/aptitudeAdminService';

// ─── Directions mapping per section/topic type ────────────────────────────────

const DIRECTIONS: Record<string, string> = {
  'Verbal Analogies': 'Each question consist of two words which have a certain relationship to each other followed by four pairs of related words. Select the pair which has the same relationship.',
  'Synonyms': 'In each of the following questions, choose the word which is closest in meaning to the given word.',
  'Antonyms': 'In each of the following questions, choose the word which is opposite in meaning to the given word.',
  'Sentence Completion': 'In each of the following sentences, a blank space is given. Choose the word or phrase from the options that best completes the sentence.',
  'Sentence Correction': 'In each of the following questions, find the part of the sentence that has an error. If there is no error, choose "No Error".',
  'Spotting Errors': 'Read each sentence to find out whether there is any grammatical or idiomatic error in it. The error, if any, will be in one part of the sentence.',
  'Ordering of Words': 'In each question below, there are words arranged in a meaningful order. Choose the correct arrangement.',
  'Ordering of Sentences': 'Arrange the given sentences in the correct logical order to form a meaningful paragraph.',
  'Blood Relations': 'Read the given information carefully and answer the questions based on the family relationships described.',
  'Direction Sense Test': 'A person starts from a point and walks in different directions. Based on the movements, determine the final position or distance.',
  'Coding-Decoding': 'In a certain code language, words or letters are coded in a particular pattern. Study the pattern and answer the questions.',
  'Number Series': 'Find the missing number or the wrong number in the given series by identifying the pattern.',
  'Analogy': 'In each question, there is a certain relationship between two given words. Find the word from the options that has the same relationship with the given word.',
  'Classification': 'In each question, four or five items are given. Find the one that does not belong to the group.',
  'Syllogism': 'In each question, some statements are given followed by conclusions. Choose the conclusion that logically follows from the given statements.',
  'Percentage': 'Solve the following problems related to percentage calculations. Use the formula: Percentage = (Part/Whole) × 100.',
  'Profit and Loss': 'Solve the following problems related to profit, loss, cost price, selling price, and discount.',
  'Ratio and Proportion': 'Solve the following problems involving ratios, proportions, and their applications.',
  'Average': 'Solve the following problems related to finding averages, weighted averages, and related calculations.',
  'Time and Work': 'Solve the following problems related to work done, time taken, and efficiency of workers.',
  'Time and Distance': 'Solve the following problems involving speed, distance, time, and relative motion.',
  'Simple Interest': 'Solve the following problems using the formula: SI = (P × R × T) / 100.',
  'Compound Interest': 'Solve the following problems involving compound interest and its applications.',
  'HCF and LCM': 'Find the Highest Common Factor (HCF) or Least Common Multiple (LCM) of the given numbers.',
  'Problems on Ages': 'Solve the following problems by forming equations based on the given age-related information.',
};

function getDirections(topicName: string): string {
  return DIRECTIONS[topicName] || 'Read each question carefully and select the most appropriate answer from the given options.';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AptitudeTopicPracticePage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const { data: topic } = useQuery({
    queryKey: ['aptitude-topic-detail', topicId],
    queryFn: () => aptitudeAdminService.getTopic(topicId!),
    enabled: !!topicId,
  });

  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['aptitude-topic-questions-practice', topicId],
    queryFn: () => aptitudeAdminService.getTopicQuestions(topicId!, { limit: 100 }),
    enabled: !!topicId,
  });

  const questions = questionsData?.questions ?? [];
  const topicName = topic?.name || '';
  const sectionName = topic?.section || '';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/aptitude')}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Exercise :</p>
                <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
                  {topicName} {sectionName ? `- ${sectionName}` : ''}
                </h1>
              </div>
            </div>
            <button
              onClick={() => navigate(`/admin/aptitude/topics/${topicId}/questions`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
            >
              <Plus size={16} />
              Add Question
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-400 text-sm mt-3">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-base mb-4">
              No questions added yet in this topic.
            </p>
            <button
              onClick={() => navigate(`/admin/aptitude/topics/${topicId}/questions`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm"
            >
              <Plus size={18} />
              Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-0">
            {/* Topic Checkbox Header */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 mb-6">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                <span className="text-lg">☑</span>
                <span>{topicName}</span>
              </div>
            </div>

            {/* Directions to Solve */}
            <div className="mb-8 border-l-4 border-green-500 pl-4 py-3 bg-green-50/50 dark:bg-green-950/10 rounded-r-lg">
              <h3 className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-base mb-2">
                <span>📢</span> Directions to Solve
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {getDirections(topicName)}
              </p>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 dark:border-gray-800 mb-6" />

            {/* Questions */}
            {questions.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Question Card ────────────────────────────────────────────────────────────

function QuestionCard({ question, index }: { question: AptitudeQuestion; index: number }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selectedOption === question.correctOption;

  const handleSubmit = () => {
    if (!selectedOption) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <div className="py-6 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
      {/* Question Statement */}
      <p className="text-gray-900 dark:text-white font-semibold text-base mb-4">
        <span className="text-gray-700 dark:text-gray-300">{index}.</span>{' '}
        {question.statement}
      </p>

      {/* Options */}
      <div className="space-y-3 ml-4 mb-4">
        {question.options?.map((option) => {
          const isSelected = selectedOption === option.optionKey;
          const isCorrectOption = option.optionKey === question.correctOption;

          let circleStyle = 'border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900';
          let textStyle = 'text-gray-800 dark:text-gray-200';

          if (submitted) {
            if (isCorrectOption) {
              circleStyle = 'border-green-500 bg-green-500 text-white';
              textStyle = 'text-green-700 dark:text-green-300 font-semibold';
            } else if (isSelected && !isCorrectOption) {
              circleStyle = 'border-red-500 bg-red-500 text-white';
              textStyle = 'text-red-600 dark:text-red-400 line-through';
            }
          } else if (isSelected) {
            circleStyle = 'border-green-600 bg-green-600 text-white';
            textStyle = 'text-gray-900 dark:text-white font-medium';
          }

          return (
            <button
              key={option.optionKey}
              onClick={() => !submitted && setSelectedOption(option.optionKey)}
              disabled={submitted}
              className="flex items-center gap-3 w-full text-left py-1 group"
            >
              <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition ${circleStyle}`}>
                {option.optionKey}
              </span>
              <span className={`text-sm transition ${textStyle}`}>
                {option.text}
              </span>
              {submitted && isCorrectOption && (
                <CheckCircle size={16} className="ml-2 text-green-500 flex-shrink-0" />
              )}
              {submitted && isSelected && !isCorrectOption && (
                <XCircle size={16} className="ml-2 text-red-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Submit / Result */}
      <div className="ml-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition"
          >
            Submit Answer
          </button>
        ) : (
          <div className="space-y-3 mt-2">
            {/* Result */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
              isCorrect
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              {isCorrect ? (
                <><CheckCircle size={16} /> Correct!</>
              ) : (
                <><XCircle size={16} /> Incorrect — Correct answer: {question.correctOption}</>
              )}
            </div>

            {/* Explanation */}
            {question.explanation && (
              <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50/50 dark:bg-blue-950/10 rounded-r-lg">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                  💡 Explanation
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {question.explanation}
                </p>
              </div>
            )}

            {/* Try Again */}
            <button
              onClick={handleReset}
              className="px-4 py-1.5 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
