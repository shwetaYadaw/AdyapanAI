import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Archive, RotateCcw, Search, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Problem, AdminProblemFilters } from '../types/problem';
import { problemAdminService } from '../services/problemAdminService';
import CreateEditProblemModal from '../components/CreateEditProblemModal';
import ProblemTable from '../components/ProblemTable';
import ProblemFilters from '../components/ProblemFilters';
import BulkImportModal from '../components/BulkImportModal';

export default function ProblemManagement() {
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
      toast.success('Problem created successfully!');
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
      toast.success('Problem updated successfully!');
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
      toast.success('Problem archived successfully!');
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to archive problem');
    }
  };

  const handleRestoreProblem = async (id: string) => {
    try {
      await problemAdminService.restoreProblem(id);
      toast.success('Problem restored successfully!');
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to restore problem');
    }
  };

  const handleImport = async (problems: Problem[]) => {
    try {
      await problemAdminService.importProblems(problems);
      toast.success('Problems imported successfully!');
      setShowImportModal(false);
      fetchProblems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to import problems');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(problems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `problems-export-${new Date().toISOString()}.json`;
    link.click();
    toast.success('Problems exported successfully!');
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Problem Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Total: {pagination.total} problems
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <Download size={20} />
                Export
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Upload size={20} />
                Import
              </button>
              <button
                onClick={() => {
                  setSelectedProblem(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={20} />
                Add Problem
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-center gap-2">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${
                    pagination.page === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEditProblemModal
          problem={selectedProblem}
          onSave={selectedProblem ? handleUpdateProblem : handleCreateProblem}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedProblem(null);
          }}
        />
      )}

      {showImportModal && (
        <BulkImportModal
          onImport={handleImport}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
}
