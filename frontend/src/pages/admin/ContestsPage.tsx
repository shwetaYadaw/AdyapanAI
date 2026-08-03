import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar, Clock, Trash2, Edit2, Save, X } from 'lucide-react';
import { api } from '../../core/services/api';
import Button from '../../shared/components/Button/Button';
import Card from '../../shared/components/Card/Card';
import Modal from '../../shared/components/Modal/Modal';
import toast from 'react-hot-toast';

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  questions: string[];
  createdAt: string;
}

interface ContestForm {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  questions: string;
}

export default function AdminContestsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [form, setForm] = useState<ContestForm>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    questions: '',
  });

  const queryClient = useQueryClient();

  // Fetch all contests
  const { data: contests, isLoading, error } = useQuery<Contest[]>({
    queryKey: ['adminContests'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/contests');
        return data.data || [];
      } catch (err) {
        console.error('Failed to fetch contests:', err);
        return [];
      }
    },
  });

  // Create/Update contest
  const saveMutation = useMutation({
    mutationFn: async (contestData: ContestForm) => {
      const payload = {
        ...contestData,
        questions: contestData.questions.split(',').map(q => q.trim()).filter(Boolean),
      };

      if (editingContest) {
        const response = await api.put(`/contests/${editingContest.id}`, payload);
        return response.data;
      } else {
        const response = await api.post('/contests', payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContests'] });
      toast.success(editingContest ? 'Contest updated!' : 'Contest created!');
      closeModal();
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      toast.error('Failed to save contest');
    },
  });

  // Delete contest
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/contests/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContests'] });
      toast.success('Contest deleted!');
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete contest');
    },
  });

  const openCreateModal = () => {
    setEditingContest(null);
    setForm({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      questions: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (contest: Contest) => {
    setEditingContest(contest);
    setForm({
      title: contest.title,
      description: contest.description,
      startTime: new Date(contest.startTime).toISOString().slice(0, 16),
      endTime: new Date(contest.endTime).toISOString().slice(0, 16),
      questions: Array.isArray(contest.questions) ? contest.questions.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContest(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.startTime || !form.endTime) {
      toast.error('Please fill all required fields');
      return;
    }

    if (new Date(form.startTime) >= new Date(form.endTime)) {
      toast.error('End time must be after start time');
      return;
    }

    saveMutation.mutate(form);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getContestStatus = (startTime: string, endTime: string) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) return { label: 'Upcoming', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' };
    if (now >= start && now <= end) return { label: 'Live', color: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400' };
    return { label: 'Ended', color: 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400' };
  };

  return (
    <div className="page-wrapper space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            Manage Contests
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage coding contests for students
          </p>
        </div>
        <Button variant="primary" size="md" onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Create Contest
        </Button>
      </div>

      {/* Contests List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : contests && contests.length > 0 ? (
        <div className="space-y-4">
          {contests.map((contest) => {
            const status = getContestStatus(contest.startTime, contest.endTime);
            const duration = Math.round(
              (new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime()) / (1000 * 60 * 60)
            );

            return (
              <Card key={contest.id} padding="md" className="border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Title and Status */}
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                          {contest.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {contest.description}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(contest.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{duration} hours</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">Problems:</span>
                        <span>{Array.isArray(contest.questions) ? contest.questions.length : 0}</span>
                      </div>
                    </div>

                    {/* Problem Slugs */}
                    {Array.isArray(contest.questions) && contest.questions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {contest.questions.map((slug, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                          >
                            {slug}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(contest)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                      title="Edit contest"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contest.id, contest.title)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      title="Delete contest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No contests yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Create your first contest to get started
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            Create Contest
          </Button>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingContest ? 'Edit Contest' : 'Create New Contest'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contest Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
              placeholder="Weekly Coding Challenge"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none"
              rows={3}
              placeholder="Solve DSA problems and compete with peers..."
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time *
            </label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="input-field"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Time *
            </label>
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="input-field"
              required
            />
          </div>

          {/* Problem Slugs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Problem Slugs (comma-separated)
            </label>
            <input
              type="text"
              value={form.questions}
              onChange={(e) => setForm({ ...form, questions: e.target.value })}
              className="input-field font-mono text-sm"
              placeholder="two-sum, reverse-linked-list, binary-search"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter problem slugs separated by commas
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={saveMutation.isPending}
              className="flex-1"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? 'Saving...' : editingContest ? 'Update Contest' : 'Create Contest'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closeModal}
              disabled={saveMutation.isPending}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
