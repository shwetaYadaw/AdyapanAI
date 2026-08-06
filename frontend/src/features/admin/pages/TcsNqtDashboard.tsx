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
  courseId?: string;
  courseName?: string;
}

type ExperienceLevel = 'freshers' | 'experienced';

export default function TcsNqtDashboard({ onBack, courseId, courseName }: TcsNqtDashboardProps) {
  const [questions, setQuestions] = useState<TcsQuestion[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({
    page: 1,
    limit: 500 // Fetch all, paginate client-side by level
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
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
      const queryFilters = courseId ? { ...filters, courseId } : filters;
      const result = await tcsNqtAdminService.getQuestions(queryFilters);
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

  // Client-side pagination for filtered questions
  const totalFiltered = filteredQuestions.length;
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when level changes
  const handleLevelChange = (level: ExperienceLevel) => {
    setActiveLevel(level);
    setCurrentPage(1);
  };

  const handleCreateQuestion = async (question: TcsQuestion) => {
    try {
      const questionData = courseId ? { ...question, courseId } : question;
      await tcsNqtAdminService.createQuestion(questionData);
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
    <div className="min-h-screen">
      {/* Header with gradient - matching Coding Arena style */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-medium transition">
            <ArrowLeft size={18} /> Back to Course
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {courseName ? `${courseName} - Placement Prep` : 'Placement Prep'}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {courseName ? `Placement questions for ${courseName}` : 'Placement Preparation Questions'} - Total: {pagination.total}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {pagination.total} Questions
              </div>
              <button onClick={() => setShowTopicModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 text-white rounded-xl hover:bg-white/30 transition font-medium text-sm">
                <Tag size={16} /> Manage Topics
              </button>
              <button onClick={() => { setSelectedQuestion(null); setShowCreateModal(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-700 rounded-xl hover:bg-orange-50 transition font-semibold text-sm shadow-lg">
                <Plus size={18} /> Add Question
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Experience Level Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => handleLevelChange('freshers')}
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
            onClick={() => handleLevelChange('experienced')}
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
            questions={paginatedQuestions}
            loading={loading}
            onEdit={(question) => {
              setSelectedQuestion(question);
              setShowCreateModal(true);
            }}
            onDelete={handleDeleteQuestion}
          />
        </div>

        {/* Pagination — Previous / Page Numbers / Next */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                      currentPage === pageNum
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-950/30'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}

        {/* Page info text */}
        {totalFiltered > 0 && (
          <p className="text-center text-xs text-gray-400 mt-3 mb-6">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalFiltered)} of {totalFiltered} questions
          </p>
        )}
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
