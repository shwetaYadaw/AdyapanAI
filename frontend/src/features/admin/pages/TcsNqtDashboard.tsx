import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Download, Upload, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { tcsNqtAdminService } from '../services/tcsNqtAdminService';
import { topicAdminService, Topic } from '../services/topicAdminService';
import { TcsQuestion } from '../types/tcsNqt';
import CreateEditTcsQuestionModal from '../components/CreateEditTcsQuestionModal';
import TcsQuestionTable from '../components/TcsQuestionTable';
import TcsQuestionFilters from '../components/TcsQuestionFilters';
import TcsBulkImportModal from '../components/TcsBulkImportModal';
import CacheManager from '../../../utils/cacheManager';

interface TcsNqtDashboardProps {
  onBack: () => void;
}

export default function TcsNqtDashboard({ onBack }: TcsNqtDashboardProps) {
  const [questions, setQuestions] = useState<TcsQuestion[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20
  });
  const [selectedQuestion, setSelectedQuestion] = useState<TcsQuestion | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTopicManagement, setShowTopicManagement] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const result = await tcsNqtAdminService.getQuestions(filters);
      if (result && result.questions) {
        setQuestions(result.questions as TcsQuestion[]);
        setPagination(result.pagination);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch placement prep questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (topicName: string) => {
    if (selectedTopic === topicName) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(topicName);
    }
  };

  // Filter questions by selected topic
  const filteredQuestions = selectedTopic
    ? questions.filter(q => q.topic && q.topic.toLowerCase() === selectedTopic.toLowerCase())
    : questions;

  const handleCreateQuestion = async (question: TcsQuestion) => {
    try {
      await tcsNqtAdminService.createQuestion(question);
      toast.success('Placement prep question created successfully!');
      setShowCreateModal(false);
      // Clear cache after creation
      CacheManager.clearQuestionCache();
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create question');
    }
  };

  const handleUpdateQuestion = async (question: TcsQuestion) => {
    try {
      if (!selectedQuestion?.id) throw new Error('No question selected');
      await tcsNqtAdminService.updateQuestion(selectedQuestion.id, question);
      toast.success('Placement prep question updated!');
      setSelectedQuestion(null);
      setShowCreateModal(false);
      // Clear cache after update
      CacheManager.clearQuestionCache(selectedQuestion.id);
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this placement prep question?')) return;
    try {
      await tcsNqtAdminService.deleteQuestion(id);
      toast.success('Placement prep question deleted!');
      
      // Clear cache for this question
      CacheManager.clearQuestionCache(id);
      
      // Refresh list
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleImport = async (questions: TcsQuestion[]) => {
    try {
      await tcsNqtAdminService.importQuestions(questions);
      toast.success('Placement prep questions imported successfully!');
      setShowImportModal(false);
      // Clear all question cache after import
      CacheManager.clearQuestionCache();
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to import questions');
    }
  };

  // Topic Management Functions
  const fetchTopics = async () => {
    try {
      setTopicsLoading(true);
      const data = await topicAdminService.getTopics('tcs-nqt', false);
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
        system: 'tcs-nqt',
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
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Placement Prep Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Placement Preparation Questions - Total: {pagination.total}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedQuestion(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                <Plus size={20} />
                Add Placement Question
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
                      placeholder="Topic name (e.g., Quantitative, Verbal)"
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
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Click a topic to filter questions</div>
                    {topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
                              onClick={handleUpdateTopic}
                              disabled={topicsLoading}
                              className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTopic(null)}
                              className="px-2 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleSelectTopic(topic.name)}
                            >
                              <div className={`font-medium text-gray-900 dark:text-white ${selectedTopic === topic.name ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                {topic.name}
                              </div>
                              {topic.description && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTopic(topic);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
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
          <TcsQuestionFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Questions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <TcsQuestionTable
            questions={filteredQuestions}
            loading={loading}
            onEdit={(question) => {
              setSelectedQuestion(question);
              setShowCreateModal(true);
            }}
            onDelete={handleDeleteQuestion}
          />
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEditTcsQuestionModal
          question={selectedQuestion}
          onSave={selectedQuestion ? handleUpdateQuestion : handleCreateQuestion}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedQuestion(null);
          }}
        />
      )}

      {showImportModal && (
        <TcsBulkImportModal
          onImport={handleImport}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
}
