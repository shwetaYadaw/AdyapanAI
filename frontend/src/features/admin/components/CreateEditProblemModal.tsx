import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Problem, ProblemTestCase, ProblemSolution } from '../types/problem';
import toast from 'react-hot-toast';
import { topicAdminService, Topic } from '../services/topicAdminService';

interface CreateEditProblemModalProps {
  problem?: Problem | null;
  type?: 'coding-arena' | 'tcs-nqt';
  onSave: (problem: Problem, changeReason?: string) => Promise<void>;
  onClose: () => void;
}

export default function CreateEditProblemModal({
  problem,
  type = 'coding-arena',
  onSave,
  onClose
}: CreateEditProblemModalProps) {
  const [formData, setFormData] = useState<Problem>({
    title: '',
    difficulty: 'easy',
    statement: '',
    constraints: '',
    inputFormat: '',
    outputFormat: '',
    referenceSolution: '',
    topics: '',
    companies: '',
    tags: '',
    category: 'general',
    timeLimit: 2000,
    memoryLimit: 256,
    testCases: [],
    solutions: [],
    ...problem
  });

  const [changeReason, setChangeReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [newTestCase, setNewTestCase] = useState<ProblemTestCase>({
    input: '',
    expectedOutput: '',
    isHidden: true,
    explanation: ''
  });

  // Fetch topics on mount
  useEffect(() => {
    fetchTopics();
  }, [type]);

  const fetchTopics = async () => {
    try {
      setTopicsLoading(true);
      const system = type === 'coding-arena' ? 'coding-arena' : 'tcs-nqt';
      const data = await topicAdminService.getTopics(system, true);
      console.log(`Fetched ${data?.length || 0} topics for ${system}`, data);
      setTopics(data);
    } catch (err: any) {
      console.error('Failed to fetch topics:', err);
      toast.error('Failed to fetch topics');
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'timeLimit' || name === 'memoryLimit' ? parseInt(value) : value
    }));
  };

  const handleAddTestCase = () => {
    if (!newTestCase.input || !newTestCase.expectedOutput) {
      toast.error('Input and expected output are required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      testCases: [...(prev.testCases || []), { ...newTestCase, order: (prev.testCases || []).length }]
    }));
    setNewTestCase({
      input: '',
      expectedOutput: '',
      isHidden: true,
      explanation: ''
    });
    toast.success('Test case added');
  };

  const handleRemoveTestCase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases?.filter((_, i) => i !== index)
    }));
  };

  const handleSeedTopics = async () => {
    if (!confirm('This will create initial topics for all systems (Coding Arena, Placement Prep, Aptitude). Continue?')) {
      return;
    }

    try {
      setSeeding(true);
      const result = await topicAdminService.seedTopics();
      toast.success(`Successfully seeded ${result?.created || 0} topics!`);
      // Refresh topics
      await fetchTopics();
    } catch (err: any) {
      console.error('Seed error:', err);
      toast.error(err.response?.data?.message || 'Failed to seed topics');
    } finally {
      setSeeding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.statement) {
      toast.error('Title and statement are required');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData, problem ? changeReason : undefined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {problem ? `Edit ${type === 'tcs-nqt' ? 'Placement Prep Question' : 'Coding Arena Problem'}` : `Create New ${type === 'tcs-nqt' ? 'Placement Prep Question' : 'Coding Arena Problem'}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Problem title"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., arrays"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Problem Statement *
            </label>
            <textarea
              name="statement"
              value={formData.statement}
              onChange={handleInputChange}
              placeholder="Detailed problem description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Input/Output Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Input Format
              </label>
              <textarea
                name="inputFormat"
                value={formData.inputFormat}
                onChange={handleInputChange}
                placeholder="Input format description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <textarea
                name="outputFormat"
                value={formData.outputFormat}
                onChange={handleInputChange}
                placeholder="Output format description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Constraints */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Constraints
            </label>
            <textarea
              name="constraints"
              value={formData.constraints}
              onChange={handleInputChange}
              placeholder="Problem constraints"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reference Solution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reference Solution
            </label>
            <textarea
              name="referenceSolution"
              value={formData.referenceSolution}
              onChange={handleInputChange}
              placeholder="Sample solution code"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Topic & Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic Dropdown - Now fetched from database */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic *
              </label>
              {topicsLoading ? (
                <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  Loading topics...
                </div>
              ) : topics.length === 0 ? (
                <div className="space-y-2">
                  <div className="w-full px-4 py-3 border border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                    ⚠️ No topics found for {type === 'coding-arena' ? 'Coding Arena' : 'Placement Prep'}!
                  </div>
                  <button
                    type="button"
                    onClick={handleSeedTopics}
                    disabled={seeding}
                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {seeding ? '🌱 Seeding Topics...' : '🌱 Seed Initial Topics (One-time Setup)'}
                  </button>
                  <input
                    type="text"
                    name="topics"
                    value={formData.topics}
                    onChange={handleInputChange}
                    placeholder="Or enter topic name manually"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <select
                  name="topics"
                  value={formData.topics}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a Topic --</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.name}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Companies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Companies (comma-separated)
              </label>
              <input
                type="text"
                name="companies"
                value={formData.companies}
                onChange={handleInputChange}
                placeholder="e.g., Google, Amazon, Facebook"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Test Cases</h3>
            
            {/* Add Test Case Form */}
            <div className="space-y-3 mb-4">
              <textarea
                placeholder="Test input"
                value={newTestCase.input}
                onChange={(e) => setNewTestCase(prev => ({ ...prev, input: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Expected output"
                value={newTestCase.expectedOutput}
                onChange={(e) => setNewTestCase(prev => ({ ...prev, expectedOutput: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newTestCase.isHidden}
                  onChange={(e) => setNewTestCase(prev => ({ ...prev, isHidden: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Hidden (not shown to users)</span>
              </label>
              <button
                type="button"
                onClick={handleAddTestCase}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <Plus size={18} />
                Add Test Case
              </button>
            </div>

            {/* List Test Cases */}
            {formData.testCases && formData.testCases.length > 0 && (
              <div className="space-y-2">
                {formData.testCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start p-3 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500"
                  >
                    <div className="flex-1 text-sm">
                      <p className="font-mono text-gray-700 dark:text-gray-300 break-all">
                        Input: {tc.input.substring(0, 50)}...
                      </p>
                      <p className="font-mono text-gray-700 dark:text-gray-300 break-all">
                        Output: {tc.expectedOutput.substring(0, 50)}...
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(idx)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Change Reason (if editing) */}
          {problem && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Change Reason
              </label>
              <input
                type="text"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Why are you making this change?"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : problem ? 'Update Problem' : 'Create Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
