import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Save, X, Brain } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Modal from '../../components/common/Modal/Modal';
import Badge from '../../components/common/Badge/Badge';
import toast from 'react-hot-toast';

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
  createdAt: string;
}

interface QuestionForm {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  module: string;
  topic: string;
  difficulty: string;
  questionImage: string;
  optionImages: string;
  isImageBased: boolean;
}

export default function AdminAptitudePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AptitudeQuestion | null>(null);
  const [form, setForm] = useState<QuestionForm>({
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    module: 'quantitative',
    topic: '',
    difficulty: 'medium',
    questionImage: '',
    optionImages: '',
    isImageBased: false,
  });

  const queryClient = useQueryClient();

  // Fetch all questions
  const { data: questions, isLoading } = useQuery<AptitudeQuestion[]>({
    queryKey: ['adminAptitude'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/aptitude');
        return data.data || [];
      } catch (err) {
        console.error('Failed to fetch aptitude questions:', err);
        return [];
      }
    },
  });

  // Create/Update question
  const saveMutation = useMutation({
    mutationFn: async (questionData: QuestionForm) => {
      const payload = {
        ...questionData,
        options: questionData.options.filter((opt) => opt.trim() !== ''),
        optionImages: questionData.optionImages ? JSON.parse(questionData.optionImages) : null,
      };

      if (editingQuestion) {
        const response = await api.put(`/aptitude/${editingQuestion.id}`, payload);
        return response.data;
      } else {
        const response = await api.post('/aptitude', payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAptitude'] });
      toast.success(editingQuestion ? 'Question updated!' : 'Question created!');
      closeModal();
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save question');
    },
  });

  // Delete question
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/aptitude/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAptitude'] });
      toast.success('Question deleted!');
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete question');
    },
  });

  const openCreateModal = () => {
    setEditingQuestion(null);
    setForm({
      question: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: '',
      module: 'quantitative',
      topic: '',
      difficulty: 'medium',
      questionImage: '',
      optionImages: '',
      isImageBased: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (question: AptitudeQuestion) => {
    setEditingQuestion(question);
    setForm({
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
      module: question.module,
      topic: question.topic,
      difficulty: question.difficulty,
      questionImage: question.questionImage || '',
      optionImages: question.optionImages ? JSON.stringify(question.optionImages, null, 2) : '',
      isImageBased: question.isImageBased,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.question || !form.answer || !form.explanation || !form.module || !form.topic) {
      toast.error('Please fill all required fields');
      return;
    }

    const validOptions = form.options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    if (!validOptions.includes(form.answer)) {
      toast.error('Answer must be one of the options');
      return;
    }

    saveMutation.mutate(form);
  };

  const handleDelete = (id: string, question: string) => {
    if (window.confirm(`Are you sure you want to delete this question?`)) {
      deleteMutation.mutate(id);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const addOption = () => {
    setForm({ ...form, options: [...form.options, ''] });
  };

  const removeOption = (index: number) => {
    if (form.options.length > 2) {
      const newOptions = form.options.filter((_, i) => i !== index);
      setForm({ ...form, options: newOptions });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <div className="page-wrapper space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            Manage Aptitude Questions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage quantitative, verbal, and logical reasoning questions
          </p>
        </div>
        <Button variant="primary" size="md" onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Create Question
        </Button>
      </div>

      {/* Questions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse"
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : questions && questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card
              key={question.id}
              padding="md"
              className="border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="font-display font-semibold text-base text-gray-900 dark:text-white line-clamp-2">
                      {question.question}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant={getDifficultyColor(question.difficulty) as any} className="capitalize">
                      {question.difficulty}
                    </Badge>
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded text-xs capitalize">
                      {question.module}
                    </span>
                    <span className="px-2 py-1 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded text-xs">
                      {question.topic}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Answer:</span> {question.answer}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(question)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                    title="Edit question"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(question.id, question.question)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">No questions yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Create your first aptitude question to get started
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            Create Question
          </Button>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingQuestion ? 'Edit Question' : 'Create New Question'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {/* Module and Topic */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Module *</label>
              <select value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value })} className="input-field">
                <option value="quantitative">Quantitative</option>
                <option value="verbal">Verbal</option>
                <option value="logical">Logical Reasoning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic *</label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="input-field"
                placeholder="percentage, profit-loss, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty *</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="input-field">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question *</label>
            <textarea
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="input-field resize-none text-sm"
              rows={3}
              placeholder="Enter the question text..."
              required
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options *</label>
              <Button type="button" variant="outline" size="xs" onClick={addOption}>
                <Plus className="w-3 h-3" />
                Add Option
              </Button>
            </div>

            <div className="space-y-2">
              {form.options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    className="input-field text-sm flex-1"
                    placeholder={`Option ${idx + 1}`}
                  />
                  {form.options.length > 2 && (
                    <button type="button" onClick={() => removeOption(idx)} className="text-red-600 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correct Answer *</label>
            <input
              type="text"
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className="input-field"
              placeholder="Must match one of the options exactly"
              required
            />
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explanation *</label>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              className="input-field resize-none text-sm"
              rows={3}
              placeholder="Provide a detailed explanation of the solution..."
              required
            />
          </div>

          {/* Optional: Image fields */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={form.isImageBased}
                onChange={(e) => setForm({ ...form, isImageBased: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image-based question</label>
            </div>

            {form.isImageBased && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Image Path</label>
                  <input
                    type="text"
                    value={form.questionImage}
                    onChange={(e) => setForm({ ...form, questionImage: e.target.value })}
                    className="input-field text-sm"
                    placeholder="/images/questions/q1.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Option Images (JSON)
                  </label>
                  <textarea
                    value={form.optionImages}
                    onChange={(e) => setForm({ ...form, optionImages: e.target.value })}
                    className="input-field resize-none text-xs font-mono"
                    rows={3}
                    placeholder='{"Option A": "/images/opt1.png", "Option B": "/images/opt2.png"}'
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
            <Button type="submit" variant="primary" size="md" disabled={saveMutation.isPending} className="flex-1">
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
            </Button>
            <Button type="button" variant="outline" size="md" onClick={closeModal} disabled={saveMutation.isPending}>
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
