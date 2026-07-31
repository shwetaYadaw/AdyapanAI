import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Loader } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import { api } from '../../services/api';

interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  module: string;
  topic: string;
  difficulty: string;
  questionImage?: string;
  optionImages?: Record<string, string>;
  isImageBased: boolean;
}

export default function AptitudeQuizPage() {
  const { module, topicSlug } = useParams<{ module: string; topicSlug: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({});

  // Fetch questions for this topic
  const { data: questions, isLoading } = useQuery<AptitudeQuestion[]>({
    queryKey: ['aptitudeQuiz', module, topicSlug],
    queryFn: async () => {
      try {
        const { data } = await api.get('/aptitude', {
          params: { module, topic: topicSlug },
        });
        return data.data || [];
      } catch (err) {
        console.error('Failed to fetch quiz questions:', err);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="page-wrapper">
        <Card padding="lg" className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No questions found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            This topic doesn't have any questions yet.
          </p>
          <Button variant="primary" onClick={() => navigate('/student/aptitude')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.answer;
  const totalCorrect = Object.values(answeredQuestions).filter(Boolean).length;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (option: string) => {
    if (!showExplanation) {
      setSelectedAnswer(option);
      setShowExplanation(true);
      setAnsweredQuestions({
        ...answeredQuestions,
        [currentIndex]: option === currentQuestion.answer,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleFinish = () => {
    const score = (totalCorrect / questions.length) * 100;
    alert(`Quiz Complete!\n\nScore: ${totalCorrect}/${questions.length} (${score.toFixed(1)}%)`);
    navigate('/student/aptitude');
  };

  return (
    <div className="page-wrapper space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/student/aptitude')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Topics
        </Button>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            Score: {totalCorrect}/{questions.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
        <div
          className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <Card padding="lg" className="border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          {/* Topic and Difficulty */}
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="capitalize">
              {currentQuestion.module}
            </Badge>
            <Badge
              variant={
                currentQuestion.difficulty === 'easy'
                  ? 'success'
                  : currentQuestion.difficulty === 'medium'
                  ? 'warning'
                  : 'danger'
              }
              className="capitalize"
            >
              {currentQuestion.difficulty}
            </Badge>
          </div>

          {/* Question */}
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-4">
              {currentQuestion.question}
            </h2>

            {currentQuestion.questionImage && (
              <img
                src={currentQuestion.questionImage}
                alt="Question"
                className="max-w-md mx-auto mb-4 rounded-lg"
              />
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQuestion.answer;
              const showCorrect = showExplanation && isCorrectOption;
              const showWrong = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                      : showWrong
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                      : isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {option}
                    </span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-2 ${
                      isCorrect ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                    }`}
                  >
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                  <p
                    className={`text-sm ${
                      isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}
                  >
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 md:flex-initial"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            variant="primary"
            onClick={handleFinish}
            disabled={!showExplanation}
            className="flex-1 md:flex-initial"
          >
            Finish Quiz
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!showExplanation}
            className="flex-1 md:flex-initial"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
