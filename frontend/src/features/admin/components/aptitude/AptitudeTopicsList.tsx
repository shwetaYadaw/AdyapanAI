import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, BookOpen, FileText, Clock, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../../core/services/api';
import Card from '../../../../shared/components/Card/Card';
import Button from '../../../../shared/components/Button/Button';
import Badge from '../../../../shared/components/Badge/Badge';
import AddTopicModal from './AddTopicModal';

interface Topic {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  chapters?: Chapter[];
  _count?: {
    chapters: number;
    questions: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Chapter {
  id: string;
  name: string;
  _count?: {
    questions: number;
  };
}

interface AptitudeTopicsListProps {
  onSelectTopic: (topicId: string) => void;
  refreshTrigger: number;
}

export default function AptitudeTopicsList({ onSelectTopic, refreshTrigger }: AptitudeTopicsListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: topics = [], isLoading, refetch } = useQuery<Topic[]>({
    queryKey: ['aptitude-topics', refreshTrigger],
    queryFn: async () => {
      const { data } = await api.get('/admin/aptitude/topics?limit=100');
      return data.data ?? [];
    },
  });

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic? All chapters and questions will be deleted.')) {
      return;
    }

    try {
      await api.delete(`/admin/aptitude/topics/${topicId}`);
      toast.success('Topic deleted successfully');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete topic');
    }
  };

  const handleAddTopic = async (data: Partial<Topic>) => {
    try {
      await api.post('/admin/aptitude/topics', data);
      toast.success('Topic created successfully');
      setShowAddModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create topic');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Button
          onClick={() => setShowAddModal(true)}
          rightIcon={<Plus size={18} />}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          Add Topic
        </Button>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))
        ) : filteredTopics.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">No topics found</p>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="mt-6"
            >
              Create First Topic
            </Button>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <Card
              key={topic.id}
              padding="lg"
              className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col justify-between group"
              onClick={() => onSelectTopic(topic.id)}
            >
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                      {topic.name}
                    </h3>
                    {topic.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {topic.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen size={16} className="text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {topic._count?.chapters ?? 0} Chapters
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileText size={16} className="text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {topic._count?.questions ?? 0} Questions
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Updated {new Date(topic.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between">
                <Badge variant={topic.isActive ? 'success' : 'warning'}>
                  {topic.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTopic(topic);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTopic(topic.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddTopicModal
          topic={editingTopic}
          onSave={handleAddTopic}
          onClose={() => {
            setShowAddModal(false);
            setEditingTopic(null);
          }}
        />
      )}
    </div>
  );
}
