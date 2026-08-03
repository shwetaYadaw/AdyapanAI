import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../shared/hooks/hooks';
import {
  fetchPuzzleById,
  submitPuzzleAttempt,
  fetchAttempts,
  submitPuzzleReview,
  clearCurrentPuzzle,
} from './puzzleSlice';
import { Clock, RotateCw, ThumbsUp, Star } from 'lucide-react';

export const PuzzleViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentPuzzle, attempts, loading, error } = useAppSelector((state) => state.puzzles);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [confidence, setConfidence] = useState<number>(0.5);
  const [submitted, setSubmitted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const [rating, setRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPuzzleById(id));
      dispatch(fetchAttempts(id));
    }

    return () => {
      dispatch(clearCurrentPuzzle());
    };
  }, [id, dispatch]);

  const handleSubmit = async () => {
    if (!selectedAnswer || !id) return;

    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      const result = await dispatch(
        submitPuzzleAttempt({
          puzzleId: id,
          selectedAnswer,
          timeSpent: timeElapsed,
          confidence,
        })
      ).unwrap();

      setAttemptResult(result);
      setSubmitted(true);
      dispatch(fetchAttempts(id)); // Refresh attempts
    } catch (err) {
      console.error('Failed to submit attempt:', err);
    }
  };

  const handleReview = async () => {
    if (rating === 0 || !id) return;

    try {
      await dispatch(
        submitPuzzleReview({
          puzzleId: id,
          rating,
          comment: reviewComment,
        })
      ).unwrap();

      setShowReview(false);
      setRating(0);
      setReviewComment('');
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !currentPuzzle) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-800">{error || 'Puzzle not found'}</p>
      </div>
    );
  }

  const isCorrect = attemptResult?.isCorrect;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentPuzzle.title}</h1>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{currentPuzzle.puzzleType}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{currentPuzzle.difficulty}</span>
              {currentPuzzle.estimatedTime && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentPuzzle.estimatedTime}s
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          {currentPuzzle.rating > 0 && (
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(currentPuzzle.rating) ? 'fill-yellow-300 text-yellow-300' : 'text-white/30'}`}
                  />
                ))}
              </div>
              <p className="text-sm">{currentPuzzle.ratingCount} ratings</p>
            </div>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Question</h2>
        <p className="text-gray-700 text-lg leading-relaxed">{currentPuzzle.question}</p>

        {currentPuzzle.description && (
          <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
            <p className="text-gray-600">{currentPuzzle.description}</p>
          </div>
        )}
      </div>

      {/* Options */}
      {!submitted && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Select Your Answer</h2>
          <div className="space-y-3">
            {currentPuzzle.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAnswer === option.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 font-medium">
                  {option.description || option.id}
                </span>
                {option.imageUrl && (
                  <img src={option.imageUrl} alt={option.id} className="w-12 h-12 ml-auto" />
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Slider */}
      {!submitted && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">How confident are you?</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-bold text-indigo-600 w-12">{(confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Answer'}
        </button>
      )}

      {/* Result */}
      {submitted && attemptResult && (
        <div className={`rounded-lg p-6 text-white ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}>
          <h2 className="text-2xl font-bold mb-2">{isCorrect ? '🎉 Correct!' : '❌ Incorrect'}</h2>
          <p className="mb-4">
            {isCorrect
              ? `Great job! You earned ${attemptResult.xpEarned} XP!`
              : `The correct answer is: ${attemptResult.correctAnswer}`}
          </p>

          {attemptResult.explanation && (
            <div className="mt-4 bg-white/10 rounded p-4">
              <p className="font-semibold mb-2">Explanation:</p>
              <p>{attemptResult.explanation}</p>
            </div>
          )}

          <button
            onClick={() => {
              setSubmitted(false);
              setSelectedAnswer(null);
              setAttemptResult(null);
            }}
            className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded font-semibold hover:bg-gray-100 flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Try Another Puzzle
          </button>
        </div>
      )}

      {/* Review Section */}
      {submitted && !showReview && (
        <button
          onClick={() => setShowReview(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
        >
          <ThumbsUp className="w-5 h-5" />
          Rate This Puzzle
        </button>
      )}

      {showReview && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Rate This Puzzle</h3>

          {/* Star Rating */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your feedback (optional)..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            rows={3}
          />

          <div className="flex gap-2">
            <button
              onClick={handleReview}
              disabled={rating === 0 || loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
            >
              Submit Review
            </button>
            <button
              onClick={() => {
                setShowReview(false);
                setRating(0);
                setReviewComment('');
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Previous Attempts */}
      {attempts && attempts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Your Attempts</h3>
          <div className="space-y-2">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className={`font-medium ${attempt.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {attempt.isCorrect ? '✓' : '✗'} {attempt.selectedAnswer}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">{attempt.timeSpent}s</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(attempt.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
