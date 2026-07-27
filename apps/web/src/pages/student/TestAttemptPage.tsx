import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Award, AlertCircle, Loader } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import TestPlayer from '../../components/aptitude/TestPlayer';
import PageLoader from '../../components/common/Loader/PageLoader';

export default function TestAttemptPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [attemptStarted, setAttemptStarted] = useState(false);

  const { data: test, isLoading, isError } = useQuery({
    queryKey: ['aptitudeTest', testId],
    queryFn: async () => {
      const { data } = await api.get(`/placement/aptitude/tests/${testId}`);
      return data.data;
    },
    enabled: !!testId,
  });

  useEffect(() => {
    if (test?.questions && typeof test.questions === 'string') {
      try {
        test.questions = JSON.parse(test.questions);
      } catch (e) {
        console.error('Failed to parse questions:', e);
      }
    }
  }, [test]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !test) {
    return (
      <div className="page-wrapper">
        <Card className="max-w-md mx-auto mt-8">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Test Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">The test you're looking for doesn't exist or has been removed.</p>
            <Button fullWidth onClick={() => navigate('/student/placement')}>
              Back to Placement
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (attemptStarted) {
    return <TestPlayer test={test} />;
  }

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{test.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{test.category === 'reasoning' ? 'Reasoning Ability Test' : 'Aptitude Test'}</p>
          </div>

          {/* Test Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Duration</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{test.duration} min</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Marks</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{test.totalMarks}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Questions</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                    {Array.isArray(test.questions) ? test.questions.length : 0}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Test Instructions */}
          <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-950/30 rounded-lg border-l-4 border-amber-500">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Instructions
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>Read each question carefully before answering.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>You can review and change your answers before submitting.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>A timer will track the remaining time. If time runs out, your test will be auto-submitted.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>Once submitted, you cannot modify your answers.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>Your score and detailed explanation will be shown after submission.</span>
              </li>
            </ul>
          </div>

          {/* Difficulty and Company Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge
              variant={test.difficulty === 'hard' ? 'danger' : test.difficulty === 'medium' ? 'warning' : 'success'}
              className="capitalize"
            >
              {test.difficulty} Level
            </Badge>
            <Badge variant="primary">{test.company}</Badge>
            {test.category && (
              <Badge variant="primary" className="capitalize">
                {test.category}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" fullWidth onClick={() => navigate('/student/placement')}>
              Back to Placement
            </Button>
            <Button fullWidth onClick={() => setAttemptStarted(true)}>
              Start Test
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
