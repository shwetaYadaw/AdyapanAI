import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Download, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { TcsQuestion } from '../types/tcsNqt';
import { tcsNqtAdminService } from '../services/tcsNqtAdminService';
import CreateEditTcsQuestionModal from '../components/CreateEditTcsQuestionModal';
import TcsQuestionTable from '../components/TcsQuestionTable';
import TcsQuestionFilters from '../components/TcsQuestionFilters';
import TcsBulkImportModal from '../components/TcsBulkImportModal';

interface AptitudeDashboardProps {
  onBack: () => void;
}

interface AptitudeQuestion {
  id?: string;
  title: string;
  slug?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  timeLimit?: number;
  memoryLimit?: number;
  referenceSolution: string;
  topics?: string;
  companies?: string;
  testCases?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AptitudeDashboard({ onBack }: AptitudeDashboardProps) {
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
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
  const [selectedQuestion, setSelectedQuestion] = useState<AptitudeQuestion | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      // For now, we'll use the same TCS NQT service
      // In production, this would be a separate aptitude service
      const result = await tcsNqtAdminService.getQuestions(filters);
      setQuestions(result.questions as any);
      setPagination(result.pagination);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch Aptitude questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (question: AptitudeQuestion) => {
    try {
      await tcsNqtAdminService.createQuestion(question as any);
      toast.success('Aptitude question created successfully!');
      setShowCreateModal(false);
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create question');
    }
  };

  const handleUpdateQuestion = async (question: AptitudeQuestion) => {
    try {
      if (!selectedQuestion?.id) throw new Error('No question selected');
      await tcsNqtAdminService.updateQuestion(selectedQuestion.id, question as any);
      toast.success('Aptitude question updated successfully!');
      setSelectedQuestion(null);
      setShowCreateModal(false);
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Aptitude question?')) return;
    try {
      await tcsNqtAdminService.deleteQuestion(id);
      toast.success('Aptitude question deleted successfully!');
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleImport = async (questions: AptitudeQuestion[]) => {
    try {
      await tcsNqtAdminService.importQuestions(questions as any);
      toast.success('Aptitude questions imported successfully!');
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
            className="flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Aptitude Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                General Aptitude Questions - Total: {pagination.total}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedQuestion(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={20} />
                Add Aptitude Question
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
              setSelectedQuestion(question as any);
              setShowCreateModal(true);
            }}
            onDelete={handleDeleteQuestion}
          />
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEditTcsQuestionModal
          question={selectedQuestion as any}
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
