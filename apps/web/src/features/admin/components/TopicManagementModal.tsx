import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Topic, topicAdminService } from '../services/topicAdminService';

interface TopicManagementModalProps {
  system: 'coding-arena' | 'tcs-nqt' | 'aptitude';
  onClose: () => void;
}

export default function TopicManagementModal({ system, onClose }: TopicManagementModalProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Fetch topics on mount
  useEffect(() => {
    fetchTopics();
  }, [system]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await topicAdminService.getTopics(system, false);
      setTopics(data);
    } catch (err: any) {
      toast.error('Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTopicName.trim()) {
      toast.error('Topic name is required');
      return;
    }

    try {
      const newTopic = await topicAdminService.createTopic({
        name: newTopicName.trim(),
        system,
        description: newTopicDescription.trim() || undefined,
        isActive: true
      });

      setTopics([...topics, newTopic]);
      setNewTopicName('');
      setNewTopicDescription('');
      toast.success('Topic added successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add topic');
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;

    try {
      await topicAdminService.deleteTopic(id);
      setTopics(topics.filter(t => t.id !== id));
      toast.success('Topic deleted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete topic');
    }
  };

  const handleUpdateTopic = async () => {
    if (!editingId) return;

    try {
      const updated = await topicAdminService.updateTopic(editingId, {
        name: editName.trim(),
        description: editDescription.trim() || undefined
      });

      setTopics(topics.map(t => (t.id === editingId ? updated : t)));
      setEditingId(null);
      setEditName('');
      setEditDescription('');
      toast.success('Topic updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update topic');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    try {
      const newTopics = [...topics];
      [newTopics[index], newTopics[index - 1]] = [newTopics[index - 1], newTopics[index]];

      // Update order in backend
      await topicAdminService.reorderTopics(
        newTopics.map((t, idx) => ({
          id: t.id || '',
          order: idx
        }))
      );

      setTopics(newTopics);
      toast.success('Topic moved up!');
    } catch (err: any) {
      toast.error('Failed to reorder topics');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === topics.length - 1) return;

    try {
      const newTopics = [...topics];
      [newTopics[index], newTopics[index + 1]] = [newTopics[index + 1], newTopics[index]];

      // Update order in backend
      await topicAdminService.reorderTopics(
        newTopics.map((t, idx) => ({
          id: t.id || '',
          order: idx
        }))
      );

      setTopics(newTopics);
      toast.success('Topic moved down!');
    } catch (err: any) {
      toast.error('Failed to reorder topics');
    }
  };

  const systemLabel = system === 'coding-arena' ? 'Coding Arena' : system === 'tcs-nqt' ? 'TCS NQT' : 'Aptitude';
  const systemColor = system === 'coding-arena' ? 'blue' : system === 'tcs-nqt' ? 'orange' : 'green';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Manage {systemLabel} Topics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Topic Form */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add New Topic</h3>
            <form onSubmit={handleAddTopic} className="space-y-3">
              <input
                type="text"
                placeholder="Topic name (e.g., Arrays, Strings)"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${
                  systemColor === 'blue'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : systemColor === 'orange'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white rounded transition`}
              >
                <Plus size={18} />
                Add Topic
              </button>
            </form>
          </div>

          {/* Topics List */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Topics ({topics.length})
            </h3>

            {loading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading topics...</p>
            ) : topics.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                No topics found. Add your first topic above!
              </p>
            ) : (
              <div className="space-y-2">
                {topics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                  >
                    {editingId === topic.id ? (
                      // Edit Mode
                      <div className="flex-1 space-y-2 mr-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateTopic}
                            className="flex-1 px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 px-2 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{topic.name}</p>
                          {topic.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Order: {topic.order} {!topic.isActive && ' (Inactive)'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                            title="Move up"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === topics.length - 1}
                            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                            title="Move down"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(topic.id || null);
                              setEditName(topic.name);
                              setEditDescription(topic.description || '');
                            }}
                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => topic.id && handleDeleteTopic(topic.id)}
                            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded transition"
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
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
