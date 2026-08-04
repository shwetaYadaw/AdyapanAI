import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../../core/services/api';
import Button from '../../../../shared/components/Button/Button';
import AddEditQuestionModal from './AddEditQuestionModal';
import Badge from '../../../../shared/components/Badge/Badge';

interface Question {
  id: string;
  question: string;
  difficulty: string;
  marks?: number;
  status?: string;
  options?: any[];
  correctOptionIndex?: number;
  explanation?: string;
}

interface AptitudeQuestionsListProps {
  topicId: string;
  chapterId: string;
  questions: Question[];
  onRefresh: () => void;
}

export default function AptitudeQuestionsList({
  topicId,
  chapterId,
  questions,
  onRefresh,
}: AptitudeQuestionsListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Delete this question?')) return;

    try {
      await api.delete(
        `/admin/aptitude/topics/${topicId}/chapters/${chapterId}/questions/${questionId}`
      );
      toast.success('Question deleted');
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleAddQuestion = async (data: Partial<Question>) => {
    try {
      await api.post(
        `/admin/aptitude/topics/${topicId}/chapters/${chapterId}/questions`,
        data
      );
      toast.success('Question created');
      setShowAddModal(false);
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create question');
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <Button
          onClick={() => setShowAddModal(true)}
          rightIcon={<Plus size={18} />}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          Add Question
        </Button>
      </div>

      {/* Questions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">Question</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">Difficulty</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">Marks</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">Options</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No questions found
                </td>
              </tr>
            ) : (
              filteredQuestions.map((question, idx) => (
                <tr key={question.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                        Q{idx + 1}.
                      </span>
                      <p className="text-gray-900 dark:text-white line-clamp-2">
                        {question.question.substring(0, 60)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        question.difficulty === 'easy'
                          ? 'success'
                          : question.difficulty === 'medium'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {question.difficulty}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {question.marks ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {question.options?.length ?? 4}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingQuestion(question)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition"
                        title="Delete"
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

      {/* Modals */}
      {(showAddModal || editingQuestion) && (
        <AddEditQuestionModal
          topicId={topicId}
          chapterId={chapterId}
          question={editingQuestion}
          onSave={handleAddQuestion}
          onClose={() => {
            setShowAddModal(false);
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
}
