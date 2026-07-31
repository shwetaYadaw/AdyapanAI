import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Save, X, Code2 } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Modal from '../../components/common/Modal/Modal';
import Badge from '../../components/common/Badge/Badge';
import toast from 'react-hot-toast';

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  timeLimit: number;
  memoryLimit: number;
  starterCode: any;
  referenceSolution: string;
  topics: string;
  companies: string;
  createdAt: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  type: string;
}

interface ProblemForm {
  title: string;
  slug: string;
  difficulty: string;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  timeLimit: string;
  memoryLimit: string;
  starterCode: string;
  referenceSolution: string;
  topics: string;
  companies: string;
  testCases: TestCase[];
}

export default function AdminProblemsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [form, setForm] = useState<ProblemForm>({
    title: '',
    slug: '',
    difficulty: 'easy',
    statement: '',
    constraints: '',
    inputFormat: '',
    outputFormat: '',
    timeLimit: '2000',
    memoryLimit: '256',
    starterCode: '{}',
    referenceSolution: '',
    topics: '',
    companies: '',
    testCases: [{ input: '', expectedOutput: '', isHidden: false, type: 'sample' }],
  });

  const queryClient = useQueryClient();

  // Fetch all problems
  const { data: problems, isLoading } = useQuery<Problem[]>({
    queryKey: ['adminProblems'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/problems');
        return data.data || [];
      } catch (err) {
        console.error('Failed to fetch problems:', err);
        return [];
      }
    },
  });

  // Create/Update problem
  const saveMutation = useMutation({
    mutationFn: async (problemData: ProblemForm) => {
      const payload = {
        ...problemData,
        timeLimit: parseInt(problemData.timeLimit),
        memoryLimit: parseInt(problemData.memoryLimit),
        starterCode: JSON.parse(problemData.starterCode),
        testCases: problemData.testCases,
      };

      if (editingProblem) {
        const response = await api.put(`/problems/${editingProblem.id}`, payload);
        return response.data;
      } else {
        const response = await api.post('/problems', payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
      toast.success(editingProblem ? 'Problem updated!' : 'Problem created!');
      closeModal();
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save problem');
    },
  });

  // Delete problem
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/problems/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
      toast.success('Problem deleted!');
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete problem');
    },
  });

  const openCreateModal = () => {
    setEditingProblem(null);
    setForm({
      title: '',
      slug: '',
      difficulty: 'easy',
      statement: '',
      constraints: '',
      inputFormat: '',
      outputFormat: '',
      timeLimit: '2000',
      memoryLimit: '256',
      starterCode: JSON.stringify({ javascript: '// Write your code here', python: '# Write your code here', java: '// Write your code here' }, null, 2),
      referenceSolution: '',
      topics: '',
      companies: '',
      testCases: [{ input: '', expectedOutput: '', isHidden: false, type: 'sample' }],
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (problem: Problem) => {
    setEditingProblem(problem);
    
    // Fetch full problem details including test cases
    try {
      const { data } = await api.get(`/problems/${problem.id}/admin`);
      const fullProblem = data.data;
      
      setForm({
        title: fullProblem.title,
        slug: fullProblem.slug,
        difficulty: fullProblem.difficulty,
        statement: fullProblem.statement,
        constraints: fullProblem.constraints,
        inputFormat: fullProblem.inputFormat,
        outputFormat: fullProblem.outputFormat,
        timeLimit: String(fullProblem.timeLimit),
        memoryLimit: String(fullProblem.memoryLimit),
        starterCode: JSON.stringify(fullProblem.starterCode, null, 2),
        referenceSolution: fullProblem.referenceSolution,
        topics: fullProblem.topics,
        companies: fullProblem.companies,
        testCases: fullProblem.testCases || [{ input: '', expectedOutput: '', isHidden: false, type: 'sample' }],
      });
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to load problem details');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProblem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.slug || !form.statement) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate starter code JSON
    try {
      JSON.parse(form.starterCode);
    } catch {
      toast.error('Starter code must be valid JSON');
      return;
    }

    saveMutation.mutate(form);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete all related submissions.`)) {
      deleteMutation.mutate(id);
    }
  };

  const addTestCase = () => {
    setForm({
      ...form,
      testCases: [...form.testCases, { input: '', expectedOutput: '', isHidden: true, type: 'hidden' }],
    });
  };

  const removeTestCase = (index: number) => {
    setForm({
      ...form,
      testCases: form.testCases.filter((_, i) => i !== index),
    });
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const updated = [...form.testCases];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, testCases: updated });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'primary';
    }
  };

  return (
    <div className="page-wrapper space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            Manage Problems
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage DSA coding problems
          </p>
        </div>
        <Button variant="primary" size="md" onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Create Problem
        </Button>
      </div>

      {/* Problems List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : problems && problems.length > 0 ? (
        <div className="space-y-4">
          {problems.map((problem) => (
            <Card key={problem.id} padding="md" className="border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                      {problem.title}
                    </h3>
                    <Badge variant={getDifficultyColor(problem.difficulty) as any} className="capitalize">
                      {problem.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-semibold">Slug:</span> {problem.slug}
                    </div>
                    <div>
                      <span className="font-semibold">Time Limit:</span> {problem.timeLimit}ms
                    </div>
                    <div>
                      <span className="font-semibold">Memory:</span> {problem.memoryLimit}MB
                    </div>
                  </div>

                  {problem.topics && (
                    <div className="flex flex-wrap gap-2">
                      {problem.topics.split(',').map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded text-xs"
                        >
                          {topic.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(problem)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                    title="Edit problem"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(problem.id, problem.title)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Delete problem"
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
          <div className="text-6xl mb-4">💻</div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No problems yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Create your first coding problem to get started
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            Create Problem
          </Button>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProblem ? 'Edit Problem' : 'Create New Problem'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="Two Sum"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="input-field font-mono text-sm"
                placeholder="two-sum"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty *
              </label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="input-field"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Limit (ms)
              </label>
              <input
                type="number"
                value={form.timeLimit}
                onChange={(e) => setForm({ ...form, timeLimit: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Memory Limit (MB)
              </label>
              <input
                type="number"
                value={form.memoryLimit}
                onChange={(e) => setForm({ ...form, memoryLimit: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Problem Statement *
            </label>
            <textarea
              value={form.statement}
              onChange={(e) => setForm({ ...form, statement: e.target.value })}
              className="input-field resize-none font-mono text-sm"
              rows={4}
              placeholder="Given an array of integers..."
              required
            />
          </div>

          {/* Constraints, Input, Output */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Constraints
              </label>
              <textarea
                value={form.constraints}
                onChange={(e) => setForm({ ...form, constraints: e.target.value })}
                className="input-field resize-none text-sm"
                rows={3}
                placeholder="1 <= n <= 10^5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Input Format
              </label>
              <textarea
                value={form.inputFormat}
                onChange={(e) => setForm({ ...form, inputFormat: e.target.value })}
                className="input-field resize-none text-sm"
                rows={3}
                placeholder="First line: n..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Output Format
              </label>
              <textarea
                value={form.outputFormat}
                onChange={(e) => setForm({ ...form, outputFormat: e.target.value })}
                className="input-field resize-none text-sm"
                rows={3}
                placeholder="Single integer..."
              />
            </div>
          </div>

          {/* Topics and Companies */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topics (comma-separated)
              </label>
              <input
                type="text"
                value={form.topics}
                onChange={(e) => setForm({ ...form, topics: e.target.value })}
                className="input-field text-sm"
                placeholder="Arrays, Hash Table, Two Pointers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Companies (comma-separated)
              </label>
              <input
                type="text"
                value={form.companies}
                onChange={(e) => setForm({ ...form, companies: e.target.value })}
                className="input-field text-sm"
                placeholder="Google, Amazon, Facebook"
              />
            </div>
          </div>

          {/* Starter Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Starter Code (JSON) *
            </label>
            <textarea
              value={form.starterCode}
              onChange={(e) => setForm({ ...form, starterCode: e.target.value })}
              className="input-field resize-none font-mono text-xs"
              rows={4}
              placeholder='{"javascript": "function solve() {}", "python": "def solve():", "java": "class Solution {}"}'
              required
            />
          </div>

          {/* Reference Solution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reference Solution *
            </label>
            <textarea
              value={form.referenceSolution}
              onChange={(e) => setForm({ ...form, referenceSolution: e.target.value })}
              className="input-field resize-none font-mono text-sm"
              rows={6}
              placeholder="function solve(input) { ... }"
              required
            />
          </div>

          {/* Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Test Cases
              </label>
              <Button type="button" variant="outline" size="xs" onClick={addTestCase}>
                <Plus className="w-3 h-3" />
                Add Test Case
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {form.testCases.map((tc, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Test Case {idx + 1}
                    </span>
                    {form.testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(idx)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                        className="input-field resize-none text-xs font-mono"
                        rows={2}
                        placeholder="[2,7,11,15]\n9"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Expected Output</label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(idx, 'expectedOutput', e.target.value)}
                        className="input-field resize-none text-xs font-mono"
                        rows={2}
                        placeholder="[0,1]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={(e) => updateTestCase(idx, 'isHidden', e.target.checked)}
                        className="rounded"
                      />
                      Hidden
                    </label>

                    <select
                      value={tc.type}
                      onChange={(e) => updateTestCase(idx, 'type', e.target.value)}
                      className="input-field text-xs py-1 px-2"
                    >
                      <option value="sample">Sample</option>
                      <option value="hidden">Hidden</option>
                      <option value="edge">Edge Case</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={saveMutation.isPending}
              className="flex-1"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? 'Saving...' : editingProblem ? 'Update Problem' : 'Create Problem'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closeModal}
              disabled={saveMutation.isPending}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
