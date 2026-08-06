import React from 'react';
import { Edit, Trash2, RotateCcw } from 'lucide-react';
import { Problem } from '../types/problem';

interface ProblemTableProps {
  problems: Problem[];
  loading?: boolean;
  onEdit: (problem: Problem) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export default function ProblemTable({
  problems,
  loading = false,
  onEdit,
  onDelete,
  onRestore
}: ProblemTableProps) {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading problems...</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No problems found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Difficulty</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Topic</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Success Rate</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Attempts</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr
              key={problem.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{problem.title}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    problem.difficulty === 'easy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : problem.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {problem.topics || problem.category || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {problem.successRate?.toFixed(1) || 0}%
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {problem.totalAttempts || 0}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    problem.isArchived
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {problem.isArchived ? 'Archived' : 'Active'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(problem)}
                    className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  {problem.isArchived ? (
                    <button
                      onClick={() => onRestore(problem.id!)}
                      className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition"
                      title="Restore"
                    >
                      <RotateCcw size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onDelete(problem.id!)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
