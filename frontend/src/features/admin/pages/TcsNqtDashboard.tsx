import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, ArrowLeft, Users, Briefcase, Tag, X } from 'lucide-react';
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

type ExperienceLevel = 'freshers' | 'experienced';

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
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeLevel, setActiveLevel] = useState<ExperienceLevel>('freshers');
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [topicsLoading, setTopicsLoading] = useState(false);

  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  // Fetch topics on mount
  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setTopicsLoading(true);
      const data = await topicAdminService.getTopics('tcs-nqt', false);
      setTopics(data || []);
    } catch (err: any) {
      console.error('Failed to fetch topics:', err);
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
      toast.success('Topic added!');
      setNewTopicName('');
      setNewTopicDescription('');
      await fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add topic');
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Delete this topic?')) return;
    try {
      setTopicsLoading(true);
      await topicAdminService.deleteTopic(topicId);
      toast.success('Topic deleted!');
      await fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete topic');
    } finally {
      setTopicsLoading(false);
    }
  };

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

  // Filter questions by experience level
  const filteredQuestions = questions.filter(q => {
    const level = (q as any).experienceLevel || 'freshers';
    return level === activeLevel;
  });

  const handleCreateQuestion = async (question: TcsQuestion) => {
    try {
      await tcsNqtAdminService.createQuestion(question);
      toast.success('Placement prep question created successfully!');
      setShowCreateModal(false);
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
      CacheManager.clearQuestionCache(id);
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
      CacheManager.clearQuestionCache();
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to import questions');
    }
  };

  const freshersCount = questions.filter(q => ((q as any).experienceLevel || 'freshers') === 'freshers').length;
  const experiencedCount = questions.filter(q => ((q as any).experienceLevel || 'freshers') === 'experienced').length;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Placement Prep</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Total Questions: {pagination.total}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTopicModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 hover:text-orange-600 transition font-semibold"
            >
              <Tag size={18} />
              Manage Topics
            </button>
            <button
              onClick={() => {
                setSelectedQuestion(null);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-200 dark:shadow-none font-semibold"
            >
              <Plus size={20} />
              Add Question
            </button>
          </div>
        </div>

        {/* Experience Level Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveLevel('freshers')}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all border-2 ${
              activeLevel === 'freshers'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 shadow-md'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeLevel === 'freshers' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <Users size={20} className={activeLevel === 'freshers' ? 'text-blue-600' : 'text-gray-500'} />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Freshers Level</div>
              <div className="text-xs opacity-70">{freshersCount} questions</div>
            </div>
          </button>

          <button
            onClick={() => setActiveLevel('experienced')}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all border-2 ${
              activeLevel === 'experienced'
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300 shadow-md'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300 hover:bg-purple-50/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeLevel === 'experienced' ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <Briefcase size={20} className={activeLevel === 'experienced' ? 'text-purple-600' : 'text-gray-500'} />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Experience Level</div>
              <div className="text-xs opacity-70">{experiencedCount} questions</div>
            </div>
          </button>
        </div>

        {/* Filters */}
        <TcsQuestionFilters filters={filters} onFiltersChange={setFilters} />

        {/* Questions Table */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
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

      {/* Topic Management Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Manage Topics</h2>
              <button
                onClick={() => setShowTopicModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Add Topic Form */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Topic name (e.g., Arrays, DP)"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                />
                <button
                  onClick={handleAddTopic}
                  disabled={topicsLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition text-sm font-medium"
                >
                  <Plus size={16} />
                </button>
              </div>
              <input
                type="text"
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Topics List */}
            <div className="p-5 max-h-64 overflow-y-auto">
              {topicsLoading && topics.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">Loading...</p>
              ) : topics.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">No topics yet. Add one above.</p>
              ) : (
                <div className="space-y-2">
                  {topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{topic.name}</p>
                        {topic.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{topic.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => topic.id && handleDeleteTopic(topic.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        title="Delete topic"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowTopicModal(false)}
                className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
