import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Trophy, Clock, Users, X, Save } from 'lucide-react';
import { api } from '../../core/services/api';
import toast from 'react-hot-toast';

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  questions: string[];
}

export default function AdminContestsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '10:00',
    duration: '2', // hours
    questions: '', // comma-separated problem slugs or IDs
  });

  const { data: contests = [], isLoading } = useQuery<Contest[]>({
    queryKey: ['admin-contests'],
    queryFn: async () => {
      const { data } = await api.get('/contests');
      return data.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => api.post('/contests', payload),
    onSuccess: () => {
      toast.success('Contest created!', { position: 'top-center' });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create contest', { position: 'top-center' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/contests/${id}`),
    onSuccess: () => {
      toast.success('Contest deleted!', { position: 'top-center' });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete contest', { position: 'top-center' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.put(`/contests/${id}`, payload),
    onSuccess: () => {
      toast.success('Contest updated!', { position: 'top-center' });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update contest', { position: 'top-center' }),
  });

  const resetForm = () => {
    setForm({ title: '', description: '', startDate: '', startTime: '10:00', duration: '2', questions: '' });
    setEditingContest(null);
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (!form.title || !form.startDate) {
      toast.error('Title and start date are required', { position: 'top-center' });
      return;
    }

    const startTime = new Date(`${form.startDate}T${form.startTime}:00`);
    const endTime = new Date(startTime.getTime() + parseFloat(form.duration) * 60 * 60 * 1000);
    const questions = form.questions.split(',').map(q => q.trim()).filter(Boolean);

    const payload = {
      title: form.title,
      description: form.description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      questions,
    };

    if (editingContest) {
      updateMutation.mutate({ id: editingContest.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (contest: Contest) => {
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    const durationHours = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(1);

    setForm({
      title: contest.title,
      description: contest.description,
      startDate: start.toISOString().split('T')[0],
      startTime: start.toTimeString().slice(0, 5),
      duration: durationHours,
      questions: (contest.questions || []).join(', '),
    });
    setEditingContest(contest);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this contest?')) deleteMutation.mutate(id);
  };

  return (
    <div className="page-wrapper space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <Trophy size={24} className="text-orange-500" />
            Contest Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage coding contests. Add questions to each contest.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-semibold text-sm shadow-lg shadow-orange-200 dark:shadow-none"
        >
          <Plus size={18} />
          Create Contest
        </button>
      </div>

      {/* Contests List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-400 py-8">Loading contests...</p>
        ) : contests.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <Trophy size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No contests yet. Create your first contest!</p>
          </div>
        ) : (
          contests.map((contest) => {
            const start = new Date(contest.startTime);
            const end = new Date(contest.endTime);
            const isUpcoming = start.getTime() > Date.now();
            const isLive = Date.now() >= start.getTime() && Date.now() <= end.getTime();
            const durationHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));

            return (
              <div key={contest.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{contest.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isLive ? 'bg-green-100 text-green-700' :
                        isUpcoming ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {isLive ? 'LIVE' : isUpcoming ? 'UPCOMING' : 'ENDED'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{contest.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} at {start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>{durationHours}h duration</span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {(contest.questions || []).length} questions
                      </span>
                    </div>
                    {(contest.questions || []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {contest.questions.map((q, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{q}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleEdit(contest)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(contest.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                {editingContest ? 'Edit Contest' : 'Create New Contest'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Weekly Coding Speedrun #14"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the contest..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Start Date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Start Time</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Duration (hrs)</label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="1">1 hour</option>
                    <option value="1.5">1.5 hours</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                  Questions (problem slugs, comma-separated)
                </label>
                <textarea
                  value={form.questions}
                  onChange={(e) => setForm({ ...form, questions: e.target.value })}
                  placeholder="e.g., two-sum, reverse-linked-list, maximum-subarray"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-[10px] text-gray-400 mt-1">Enter problem slugs separated by commas. Students will solve these during the contest.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-semibold disabled:opacity-50"
              >
                <Save size={16} />
                {editingContest ? 'Update Contest' : 'Create Contest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
