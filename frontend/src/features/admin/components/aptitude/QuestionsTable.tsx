import React, { useState, useMemo } from 'react';
import { Search, Filter, Edit2, Trash2, Eye, ChevronDown } from 'lucide-react';
import { AptitudeQuestion } from '../../services/aptitudeAdminService';

interface QuestionsTableProps {
  questions: AptitudeQuestion[];
  onViewQuestion: (question: AptitudeQuestion) => void;
  onEditQuestion: (question: AptitudeQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
  isLoading?: boolean;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';

export default function QuestionsTable({
  questions,
  onViewQuestion,
  onEditQuestion,
  onDeleteQuestion,
  isLoading = false,
}: QuestionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch = q.statement?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? q.isActive : !q.isActive);

      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [questions, searchTerm, difficultyFilter, statusFilter]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredQuestions.length} of {questions.length} questions
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Question</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Difficulty</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Marks</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Answer</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading questions...
                </td>
              </tr>
            ) : filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    {questions.length === 0 ? 'No questions yet' : 'No matching questions found'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredQuestions.map((question) => (
                <tr
                  key={question.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >
                  {/* Question */}
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {question.statement}
                      </p>
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="px-4 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty?.charAt(0).toUpperCase() + question.difficulty?.slice(1)}
                    </span>
                  </td>

                  {/* Marks */}
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {question.xpReward || 1}
                    </span>
                  </td>

                  {/* Correct Answer */}
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold text-sm">
                      {question.correctOption}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        question.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {question.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewQuestion(question)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                        title="View question"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditQuestion(question)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition"
                        title="Edit question"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => question.id && onDeleteQuestion(question.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                        title="Delete question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
