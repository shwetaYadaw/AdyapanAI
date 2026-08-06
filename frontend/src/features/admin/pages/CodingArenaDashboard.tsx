import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { Problem, AdminProblemFilters } from '../types/problem';
import { problemAdminService } from '../services/problemAdminService';
import { topicAdminService, Topic } from '../services/topicAdminService';
import CreateEditProblemModal from '../components/CreateEditProblemModal';
import ProblemTable from '../components/ProblemTable';
import ProblemFilters from '../components/ProblemFilters';
import CacheManager from '../../../utils/cacheManager';

interface CodingArenaDashboardProps {
  onBack: () => void;
}

export default function CodingArenaDashboard({ onBack }: CodingArenaDashboardProps) {
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
      const result = await problemAdminService.getProblems(filters);
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
      await problemAdminService.createProblem(problem);
      toast.success('Coding Arena problem created successfully!');
      setShowCreateModal(false);
      // Clear cache after creation
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">DSA Problems</h1>
              <p className="text-cyan-100 text-sm mt-1">Manage coding problems for the student portal</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {pagination.total} Problems
              </div>
              <button
                onClick={() => { setSelectedProblem(null); setShowCreateModal(true); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition font-semibold text-sm shadow-lg"
              >
                <Plus size={18} />
                Add Problem
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Topic Pills + Management Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setSelectedTopic(null); setFilters(prev => ({ ...prev, topic: undefined, page: 1 })); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              !selectedTopic
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
          >
            All Topics
          </button>
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => handleSelectTopic(topic)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedTopic?.id === topic.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              {topic.name}
            </button>
          ))}
          <button
            onClick={() => setShowTopicManagement(!showTopicManagement)}
            className="px-3 py-2 rounded-full text-xs font-medium text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
          >
            {showTopicManagement ? '✕ Close' : '+ Manage'}
          </button>
        </div>

        {/* Topic Management Panel (Collapsible) */}
        {showTopicManagement && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Topic Management</h3>
            <div className="flex gap-2">
              <input type="text" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} placeholder="New topic name" className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()} />
              <input type="text" value={newTopicDescription} onChange={(e) => setNewTopicDescription(e.target.value)} placeholder="Description (optional)" className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              <button onClick={handleAddTopic} disabled={topicsLoading} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <div key={topic.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs">
                  {editingTopic?.id === topic.id ? (
                    <>
                      <input value={editingTopic.name} onChange={(e) => setEditingTopic({...editingTopic, name: e.target.value})} className="w-24 px-1 py-0.5 border rounded text-xs" />
                      <button onClick={handleUpdateTopic} className="text-blue-600 font-bold">✓</button>
                      <button onClick={() => setEditingTopic(null)} className="text-gray-400">✕</button>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{topic.name}</span>
                      <button onClick={() => setEditingTopic(topic)} className="text-gray-400 hover:text-blue-500"><Edit size={11} /></button>
                      <button onClick={() => topic.id && handleDeleteTopic(topic.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={11} /></button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <ProblemFilters filters={filters} onFiltersChange={setFilters} system="coding-arena" />

        {/* Problems Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <ProblemTable
            problems={problems}
            loading={loading}
            onEdit={(problem) => { setSelectedProblem(problem); setShowCreateModal(true); }}
            onDelete={handleDeleteProblem}
            onRestore={handleRestoreProblem}
          />
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button onClick={() => setFilters(prev => ({...prev, page: Math.max(1, (prev.page||1) - 1)}))} disabled={(filters.page||1) <= 1} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-40 transition">← Prev</button>
            {Array.from({length: Math.min(pagination.pages, 7)}, (_, i) => {
              let p: number;
              if (pagination.pages <= 7) p = i+1;
              else if (pagination.page <= 4) p = i+1;
              else if (pagination.page >= pagination.pages - 3) p = pagination.pages - 6 + i;
              else p = pagination.page - 3 + i;
              return (<button key={p} onClick={() => setFilters(prev => ({...prev, page: p}))} className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${pagination.page === p ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-50'}`}>{p}</button>);
            })}
            <button onClick={() => setFilters(prev => ({...prev, page: Math.min(pagination.pages, (prev.page||1) + 1)}))} disabled={(filters.page||1) >= pagination.pages} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-40 transition">Next →</button>
          </div>
        )}
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
