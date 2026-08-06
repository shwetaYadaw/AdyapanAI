import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Button from '../../shared/components/Button/Button';
import Card from '../../shared/components/Card/Card';
import Badge from '../../shared/components/Badge/Badge';

interface Question {
  text: string;
  image?: string; // Question image URL (optional)
  options: Array<{ 
    id: string; 
    text?: string; // Optional text for options
    image?: string; // Optional image for option
  }>;
  correctAnswer: string;
  explanation: string;
  marks: number;
}

interface TestPlayerProps {
  test: {
    id: string;
    title: string;
    duration: number;
    totalMarks: number;
    questions: Question[];
  };
}

export default function TestPlayer({ test }: TestPlayerProps) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.duration * 60); // in seconds
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Timer effect
  useEffect(() => {
    if (submitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted]);

  const handleAnswerChange = (optionId: string) => {
    if (!submitted) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: optionId,
      }));
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    let score = 0;
    test.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score += q.marks;
      }
    });
    return score;
  };

  const handleClose = () => {
    navigate('/student/placement');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const score = calculateScore();
  const percentage = (score / test.totalMarks) * 100;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <Card className="max-w-md w-full">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Test Submitted</h2>
            <button onClick={handleClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-white">{percentage.toFixed(0)}%</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {score} / {test.totalMarks} Marks
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {Object.keys(answers).length} of {test.questions.length} questions answered
              </p>
            </div>

            {/* Performance Feedback */}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              {percentage >= 80 && (
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Excellent performance! You're ready for the real test.
                </p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Good attempt! Review the questions you missed to improve.
                </p>
              )}
              {percentage >= 40 && percentage < 60 && (
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Need more practice. Review all concepts and try again.
                </p>
              )}
              {percentage < 40 && (
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Keep practicing! Go through the concepts and attempt this test again.
                </p>
              )}
            </div>

            {/* Question Breakdown */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Question Performance:</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {test.questions.map((q, idx) => {
                  const isCorrect = answers[idx] === q.correctAnswer;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded bg-gray-50 dark:bg-gray-800">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className="flex-1 text-gray-700 dark:text-gray-300">Q{idx + 1}</span>
                      <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? `+${q.marks}` : '0'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="secondary" fullWidth onClick={handleClose}>
                Back to Placement
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setTimeLeft(test.duration * 60);
                  setSubmitted(false);
                  setShowExplanation(false);
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <Card className="max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{test.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg px-4 py-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className={`font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600 dark:text-blue-400'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Object.keys(answers).length} of {test.questions.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Badge variant="primary" className="mb-3">
              {currentQuestion.marks} Marks
            </Badge>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestionIndex] === option.id;
              const isCorrect = option.id === currentQuestion.correctAnswer;
              const showResult = submitted || showExplanation;

              return (
                <motion.label
                  key={option.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${
                    showResult && isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                      : showResult && isSelected && !isCorrect
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                        : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(option.id)}
                    disabled={submitted}
                    className="w-5 h-5"
                  />
                  <span className="flex-1 text-gray-900 dark:text-white font-medium">{option.text}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {showResult && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-red-600" />}
                </motion.label>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {(submitted || showExplanation) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800"
            >
              <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">Explanation:</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-wrap">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            onClick={handlePrevious}
            disabled={isFirstQuestion}
          >
            Previous
          </Button>

          {!submitted && !showExplanation && (
            <Button variant="secondary" onClick={() => setShowExplanation(true)} className="ml-auto">
              Show Explanation
            </Button>
          )}

          {isLastQuestion && !submitted ? (
            <Button
              className="ml-auto"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length === 0}
            >
              Submit Test
            </Button>
          ) : (
            <Button
              className="ml-auto"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={handleNext}
              disabled={isLastQuestion}
            >
              Next
            </Button>
          )}
        </div>

        {/* Question Navigation */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Jump to question:</p>
          <div className="grid grid-cols-10 gap-2">
            {test.questions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isActive = idx === currentQuestionIndex;

              return (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setShowExplanation(false);
                  }}
                  className={`aspect-square rounded-lg font-semibold text-sm transition-all flex items-center justify-center ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg'
                      : isAnswered
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {idx + 1}
                </motion.button>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
