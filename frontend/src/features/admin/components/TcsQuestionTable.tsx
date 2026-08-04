import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { TcsQuestion } from '../types/tcsNqt';

interface TcsQuestionTableProps {
  questions: TcsQuestion[];
  loading?: boolean;
  onEdit: (question: TcsQuestion) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function TcsQuestionTable({
  questions,
  loading = false,
  onEdit,
  onDelete
}: TcsQuestionTableProps) {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading placement prep questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No placement prep questions found</p>
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
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Topics</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Companies</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr
              key={question.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900 dark:text-white">{question.title}</p>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    question.difficulty === 'easy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : question.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {question.difficulty}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {question.topics || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {question.companies || '-'}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(question)}
                    className="p-1 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900 rounded transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(question.id!)}
                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
