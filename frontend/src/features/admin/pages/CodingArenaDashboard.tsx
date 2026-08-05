import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit, Archive, RotateCcw, Search, Download, Upload, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { Problem, AdminProblemFilters } from '../types/problem';
import { problemAdminService } from '../services/problemAdminService';
import { topicAdminService, Topic } from '../services/topicAdminService';
import CreateEditProblemModal from '../components/CreateEditProblemModal';
import ProblemTable from '../components/ProblemTable';
import ProblemFilters from '../components/ProblemFilters';
import BulkImportModal from '../components/BulkImportModal';
import CacheManager from '../../../utils/cacheManager';

interface CodingArenaDashboardProps {
  onBack: () => void;
  courseId?: string;
  courseName?: string;
}

export default function CodingArenaDashboard({ onBack, courseId, courseName }: CodingArenaDashboardProps) {
  const queryClient = useQueryClient();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AdminProblemFilters>({
    page: 1,
    limit: 20
  });
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null); // Track selected topic
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTopicManagement, setShowTopicManagement] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');

  // Fetch problems when filters change
  useEffect(() => {
    fetchProblems();
  }, [filters]);

  // Fetch topics only once on mount
  useEffect(() => {
    fetchTopics();
  }, []);

  // Handle topic selection - filter problems by topic
  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(selectedTopic?.id === topic.id ? null : topic);
    setFilters(prev => ({
      ...prev,
      page: 1,
      topic: selectedTopic?.id === topic.id ? undefined : topic.name
    }));
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const queryFilters = courseId ? { ...filters, courseId } : filters;
      const result = await problemAdminService.getProblems(queryFilters);
      setProblems(result.problems);
      setPagination(result.pagination);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProblem = async (problem: Problem) => {
    try {
      const problemData = courseId ? { ...problem, courseId } : problem;
      await problemAdminService.createProblem(problemData);
      toast.success('Coding Arena problem created successfully!');
      setShowCreateModal(false);
      CacheManager.clearProblemCache();
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create problem');
    }
  };

  const handleUpdateProblem = async (problem: Problem, changeReason?: string) => {
    try {
      if (!selectedProblem?.id) throw new Error('No problem selected');
      await problemAdminService.updateProblem(selectedProblem.id, problem, changeReason);
      toast.success('Coding Arena problem updated successfully!');
      setSelectedProblem(null);
      setShowCreateModal(false);
      // Clear cache after update
      CacheManager.clearProblemCache(selectedProblem.id);
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update problem');
    }
  };

  const handleDeleteProblem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    try {
      await problemAdminService.deleteProblem(id, queryClient);
      toast.success('Coding Arena problem deleted successfully!');
      
      // Clear cache for this problem
      CacheManager.clearProblemCache(id);
      
      // Refresh list
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete problem');
    }
  };

  const handleImport = async (problems: Problem[]) => {
    try {
      await problemAdminService.importProblems(problems);
      toast.success('Coding Arena problems imported successfully!');
      setShowImportModal(false);
      // Clear all problem cache after import
      CacheManager.clearProblemCache();
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to import problems');
    }
  };

  const handleRestoreProblem = async (id: string) => {
    try {
      // You can implement restore logic here if needed
      toast.success('Problem restored successfully!');
      CacheManager.clearProblemCache(id);
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to restore problem');
    }
  };

  // Topic Management Functions
  const fetchTopics = async () => {
    try {
      setTopicsLoading(true);
      const data = await topicAdminService.getTopics('coding-arena', false);
      setTopics(data || []);
    } catch (err: any) {
      console.error('Failed to fetch topics:', err);
      toast.error('Failed to fetch topics');
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopicName.trim()) {
      toast.error('Topic name is required');
      return;
    }

    try {
      setTopicsLoading(true);
      await topicAdminService.createTopic({
        name: newTopicName,
        system: 'coding-arena',
        description: newTopicDescription || undefined
      });
      toast.success('Topic added successfully!');
      setNewTopicName('');
      setNewTopicDescription('');
      await fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add topic');
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleUpdateTopic = async () => {
    if (!editingTopic || !editingTopic.id || !editingTopic.name.trim()) {
      toast.error('Topic name is required');
      return;
    }

    try {
      setTopicsLoading(true);
      await topicAdminService.updateTopic(editingTopic.id, {
        name: editingTopic.name,
        description: editingTopic.description
      });
      toast.success('Topic updated successfully!');
      setEditingTopic(null);
      await fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update topic');
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;

    try {
      setTopicsLoading(true);
      await topicAdminService.deleteTopic(topicId);
      toast.success('Topic deleted successfully!');
      await fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete topic');
    } finally {
      setTopicsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button & Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coding Arena Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                DSA & Interview Problems - Total: {pagination.total}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedProblem(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Add Coding Problem
              </button>
            </div>
          </div>

          {/* Topic Management Collapsible Section */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <button
              onClick={() => {
                if (showTopicManagement) {
                  setShowTopicManagement(false);
                } else {
                  setShowTopicManagement(true);
                  if (topics.length === 0) fetchTopics();
                }
              }}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Manage Topics</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({topics.length} topics)</span>
              </div>
              {showTopicManagement ? (
                <ChevronUp size={20} className="text-gray-600" />
              ) : (
                <ChevronDown size={20} className="text-gray-600" />
              )}
            </button>

            {showTopicManagement && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 space-y-4">
                {/* Add New Topic */}
                <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      placeholder="Topic name (e.g., Arrays, Strings)"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddTopic}
                      disabled={topicsLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                  <textarea
                    value={newTopicDescription}
                    onChange={(e) => setNewTopicDescription(e.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Topics List */}
                {topicsLoading && topics.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Loading topics...</div>
                ) : topics.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No topics yet. Add your first topic above.</div>
                ) : (
                  <div className="space-y-2">
                    {topics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                          selectedTopic?.id === topic.id
                            ? 'bg-blue-100 dark:bg-blue-900/50 border border-blue-500'
                            : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {editingTopic?.id === topic.id ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={editingTopic?.name || ''}
                              onChange={(e) => {
                                if (editingTopic) {
                                  setEditingTopic({ ...editingTopic, name: e.target.value });
                                }
                              }}
                              className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateTopic();
                              }}
                              disabled={topicsLoading}
                              className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTopic(null);
                              }}
                              className="px-2 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">{topic.name}</div>
                              {topic.description && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</div>
                              )}
                            </div>
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setEditingTopic(topic)}
                                className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  if (topic.id) handleDeleteTopic(topic.id);
                                }}
                                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filters */}
          <ProblemFilters filters={filters} onFiltersChange={setFilters} system="coding-arena" />
        </div>

        {/* Problems Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <ProblemTable
            problems={problems}
            loading={loading}
            onEdit={(problem) => {
              setSelectedProblem(problem);
              setShowCreateModal(true);
            }}
            onDelete={handleDeleteProblem}
            onRestore={handleRestoreProblem}
          />
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEditProblemModal
          problem={selectedProblem}
          type="coding-arena"
          onSave={selectedProblem ? handleUpdateProblem : handleCreateProblem}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedProblem(null);
          }}
        />
      )}
    </div>
  );
}
