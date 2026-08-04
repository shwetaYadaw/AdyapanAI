import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { topicAdminService, Topic } from '../services/topicAdminService';

interface TopicManagementPageProps {
  onBack: () => void;
}

export default function TopicManagementPage({ onBack }: TopicManagementPageProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<'coding-arena' | 'tcs-nqt' | 'aptitude'>('coding-arena');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');

  useEffect(() => {
    fetchTopics();
  }, [selectedSystem]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Not authenticated. Please log in again.');
        return;
      }
      const data = await topicAdminService.getTopics(selectedSystem);
      console.log(`Fetched ${data?.length || 0} topics for system: ${selectedSystem}`, data);
      setTopics(data || []);
    } catch (err: any) {
      console.error('Failed to fetch topics:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      toast.error('Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopicName.trim()) {
      toast.error('Topic name is required');
      return;
    }

    try {
      setLoading(true);
      await topicAdminService.createTopic({
        name: newTopicName,
        system: selectedSystem,
        description: newTopicDescription || undefined
      });
      toast.success('Topic added successfully!');
      setNewTopicName('');
      setNewTopicDescription('');
      setShowAddModal(false);
      await fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add topic');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTopic = async () => {
    if (!editingTopic || !editingTopic.id || !editingTopic.name.trim()) {
      toast.error('Topic name is required');
      return;
    }

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic? This will not affect existing problems.')) {
      return;
    }

    try {
      setLoading(true);
      await topicAdminService.deleteTopic(topicId);
      toast.success('Topic deleted successfully!');
      await fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete topic');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newTopics = [...topics];
    [newTopics[index], newTopics[index - 1]] = [newTopics[index - 1], newTopics[index]];
    setTopics(newTopics);
  };

  const handleMoveDown = (index: number) => {
    if (index === topics.length - 1) return;
    const newTopics = [...topics];
    [newTopics[index], newTopics[index + 1]] = [newTopics[index + 1], newTopics[index]];
    setTopics(newTopics);
  };

  const systemLabels = {
    'coding-arena': 'Coding Arena',
    'tcs-nqt': 'Placement Prep (TCS NQT)',
    'aptitude': 'Aptitude Assessment'
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Topic Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage topics/categories for each system</p>
        </div>

        {/* System Selector */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(['coding-arena', 'tcs-nqt', 'aptitude'] as const).map(system => (
            <button
              key={system}
              onClick={() => setSelectedSystem(system)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedSystem === system
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600'
              }`}
            >
              {systemLabels[system]}
            </button>
          ))}
        </div>

        {/* Add Topic Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add New Topic
          </button>
        </div>

        {/* Topics List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {loading && topics.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p>Loading topics...</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No topics created for {systemLabels[selectedSystem]} yet
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Create First Topic
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition flex items-center justify-between"
                >
                  <div className="flex-1">
                    {editingTopic?.id === topic.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingTopic?.name || ''}
                          onChange={(e) => {
                            if (editingTopic) {
                              setEditingTopic({ ...editingTopic, name: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Topic name"
                        />
                        <textarea
                          value={editingTopic?.description || ''}
                          onChange={(e) => {
                            if (editingTopic) {
                              setEditingTopic({ ...editingTopic, description: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Description (optional)"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {topic.name}
                        </h3>
                        {topic.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {topic.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Order: {topic.order || 0}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {editingTopic?.id === topic.id ? (
                      <>
                        <button
                          onClick={handleUpdateTopic}
                          disabled={loading}
                          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTopic(null)}
                          className="px-3 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingTopic(topic)}
                          className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === topics.length - 1}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (topic.id) {
                              handleDeleteTopic(topic.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Topic Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add Topic to {systemLabels[selectedSystem]}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topic Name *
                  </label>
                  <input
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="e.g., Arrays, Strings, DP"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newTopicDescription}
                    onChange={(e) => setNewTopicDescription(e.target.value)}
                    placeholder="Brief description of this topic"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTopicName('');
                    setNewTopicDescription('');
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTopic}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Topic'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
