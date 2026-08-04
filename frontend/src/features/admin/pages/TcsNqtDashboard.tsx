import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Download, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { tcsNqtAdminService } from '../services/tcsNqtAdminService';
import { TcsQuestion } from '../types/tcsNqt';
import CreateEditTcsQuestionModal from '../components/CreateEditTcsQuestionModal';
import TcsQuestionTable from '../components/TcsQuestionTable';
import TcsQuestionFilters from '../components/TcsQuestionFilters';
import TcsBulkImportModal from '../components/TcsBulkImportModal';

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

  const handleCreateQuestion = async (question: TcsQuestion) => {
    try {
      await tcsNqtAdminService.createQuestion(question);
      toast.success('Placement prep question created successfully!');
      setShowCreateModal(false);
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
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to import questions');
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

          {/* Filters */}
          <TcsQuestionFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Questions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <TcsQuestionTable
            questions={questions}
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
