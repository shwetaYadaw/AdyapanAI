import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Archive, RotateCcw, Search, Download, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Problem, AdminProblemFilters } from '../types/problem';
import { problemAdminService } from '../services/problemAdminService';
import CreateEditProblemModal from '../components/CreateEditProblemModal';
import ProblemTable from '../components/ProblemTable';
import ProblemFilters from '../components/ProblemFilters';
import BulkImportModal from '../components/BulkImportModal';

interface CodingArenaDashboardProps {
  onBack: () => void;
}

export default function CodingArenaDashboard({ onBack }: CodingArenaDashboardProps) {
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Fetch problems
  useEffect(() => {
    fetchProblems();
  }, [filters]);

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
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update problem');
    }
  };

  const handleDeleteProblem = async (id: string) => {
    if (!confirm('Are you sure you want to archive this problem?')) return;
    try {
      await problemAdminService.deleteProblem(id);
      toast.success('Coding Arena problem archived successfully!');
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to archive problem');
    }
  };

  const handleImport = async (problems: Problem[]) => {
    try {
      await problemAdminService.importProblems(problems);
      toast.success('Coding Arena problems imported successfully!');
      setShowImportModal(false);
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to import problems');
    }
  };

  const handleRestoreProblem = async (id: string) => {
    try {
      // You can implement restore logic here if needed
      toast.success('Problem restored successfully!');
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to restore problem');
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

          {/* Filters */}
          <ProblemFilters filters={filters} onFiltersChange={setFilters} />
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
