import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Trophy, Clock, X, Save, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../core/services/api';
import toast from 'react-hot-toast';

interface ContestQuestion {
  title: string;
  difficulty: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  testCases: { input: string; expectedOutput: string }[];
}

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  questions: ContestQuestion[];
}

const EMPTY_QUESTION: ContestQuestion = {
  title: '', difficulty: 'easy', statement: '', inputFormat: '', outputFormat: '', constraints: '',
  testCases: [{ input: '', expectedOutput: '' }],
};

export default function AdminContestsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [form, setForm] = useState({ title: '', description: '', startDate: '', startTime: '10:00', duration: '2' });
  const [questions, setQuestions] = useState<ContestQuestion[]>([{ ...EMPTY_QUESTION }]);
  const [expandedQ, setExpandedQ] = useState<number>(0);

  const { data: contests = [], isLoading } = useQuery<Contest[]>({
    queryKey: ['admin-contests'],
    queryFn: async () => { const { data } = await api.get('/contests'); return data.data ?? []; },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => api.post('/contests', payload),
    onSuccess: () => { toast.success('Contest created!', { position: 'top-center' }); queryClient.invalidateQueries({ queryKey: ['admin-contests'] }); resetForm(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed', { position: 'top-center' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.put(`/contests/${id}`, payload),
    onSuccess: () => { toast.success('Contest updated!', { position: 'top-center' }); queryClient.invalidateQueries({ queryKey: ['admin-contests'] }); resetForm(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed', { position: 'top-center' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/contests/${id}`),
    onSuccess: () => { toast.success('Deleted!', { position: 'top-center' }); queryClient.invalidateQueries({ queryKey: ['admin-contests'] }); },
  });

  const resetForm = () => {
    setForm({ title: '', description: '', startDate: '', startTime: '10:00', duration: '2' });
    setQuestions([{ ...EMPTY_QUESTION }]);
    setEditingContest(null);
    setShowModal(false);
    setExpandedQ(0);
  };

  const handleSubmit = () => {
    if (!form.title || !form.startDate) { toast.error('Title and date required'); return; }
    const validQs = questions.filter(q => q.title && q.statement);
    if (validQs.length === 0) { toast.error('Add at least 1 question with title and statement'); return; }

    const startTime = new Date(`${form.startDate}T${form.startTime}:00`);
    const endTime = new Date(startTime.getTime() + parseFloat(form.duration) * 3600000);

    const payload = { title: form.title, description: form.description, startTime: startTime.toISOString(), endTime: endTime.toISOString(), questions: validQs };

    if (editingContest) { updateMutation.mutate({ id: editingContest.id, payload }); }
    else { createMutation.mutate(payload); }
  };

  const handleEdit = (contest: Contest) => {
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    setForm({ title: contest.title, description: contest.description, startDate: start.toISOString().split('T')[0], startTime: start.toTimeString().slice(0, 5), duration: String(((end.getTime() - start.getTime()) / 3600000).toFixed(1)) });
    setQuestions(Array.isArray(contest.questions) && contest.questions.length > 0 ? contest.questions : [{ ...EMPTY_QUESTION }]);
    setEditingContest(contest);
    setShowModal(true);
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const updateTestCase = (qIdx: number, tcIdx: number, field: string, value: string) => {
    setQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, testCases: q.testCases.map((tc, j) => j === tcIdx ? { ...tc, [field]: value } : tc) } : q));
  };

  const addTestCase = (qIdx: number) => {
    setQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, testCases: [...q.testCases, { input: '', expectedOutput: '' }] } : q));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="mx-4 sm:mx-6 mt-4 bg-gradient-to-r from-primary-600 via-primary-500 to-brand-amber px-6 sm:px-8 py-8 rounded-xl shadow-brand">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Trophy size={28} /> Contest Management
            </h1>
            <p className="text-white/70 text-sm mt-1">Create contests with full coding questions for students.</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 rounded-lg hover:bg-primary-50 font-semibold text-sm shadow-lg transition hover:-translate-y-0.5">
            <Plus size={18} /> Create Contest
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">

      {/* Contests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? <p className="text-center text-gray-400 py-8 col-span-full">Loading...</p> :
        contests.length === 0 ? <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 col-span-full"><Trophy size={48} className="text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No contests yet.</p></div> :
        contests.map(contest => {
          const start = new Date(contest.startTime);
          const end = new Date(contest.endTime);
          const isLive = Date.now() >= start.getTime() && Date.now() <= end.getTime();
          const isUpcoming = start.getTime() > Date.now();
          const qCount = Array.isArray(contest.questions) ? contest.questions.length : 0;
          return (
            <div key={contest.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-card hover:shadow-card-hover transition-all group hover:-translate-y-1 duration-300">
              {/* Card Header — gradient */}
              <div className="h-24 bg-gradient-to-br from-primary-500 via-primary-400 to-brand-amber relative p-4">
                <span className={`absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full font-bold ${isLive ? 'bg-green-500 text-white' : isUpcoming ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {isLive ? 'LIVE' : isUpcoming ? 'UPCOMING' : 'ENDED'}
                </span>
                <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Trophy size={18} className="text-white" />
                </div>
              </div>
              {/* Card Body */}
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 transition-colors">{contest.title}</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{contest.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Clock size={10} />{start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  <span>{Math.round((end.getTime() - start.getTime()) / 3600000)}h</span>
                  <span className="flex items-center gap-1"><Code2 size={10} />{qCount} Q</span>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] text-orange-600 font-medium flex items-center gap-1"><Code2 size={10} /> Coding Contest</span>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEdit(contest)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit2 size={13} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(contest.id); }} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-200 dark:border-gray-800 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <h2 className="font-bold text-lg">{editingContest ? 'Edit Contest' : 'Create Contest'}</h2>
              <button onClick={resetForm}><X size={20} className="text-gray-400" /></button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Weekly Speedrun #14" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="5 problems in 2 hours" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Date *</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Time</label><input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Duration</label><select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"><option value="1">1h</option><option value="1.5">1.5h</option><option value="2">2h</option><option value="3">3h</option></select></div>
              </div>

              {/* Questions Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2"><Code2 size={16} className="text-blue-500" /> Questions ({questions.length})</h3>
                  <button onClick={() => { setQuestions([...questions, { ...EMPTY_QUESTION }]); setExpandedQ(questions.length); }} className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-1"><Plus size={14} /> Add Question</button>
                </div>

                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button onClick={() => setExpandedQ(expandedQ === idx ? -1 : idx)} className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Q{idx + 1}. {q.title || <span className="text-gray-400 italic">Untitled</span>}
                          <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${q.difficulty === 'hard' ? 'bg-red-100 text-red-600' : q.difficulty === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{q.difficulty}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setQuestions(questions.filter((_, i) => i !== idx)); }} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                          {expandedQ === idx ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </div>
                      </button>

                      {expandedQ === idx && (
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-[10px] font-semibold text-gray-500 mb-1 block">TITLE *</label><input value={q.title} onChange={e => updateQuestion(idx, 'title', e.target.value)} placeholder="Two Sum" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div><label className="text-[10px] font-semibold text-gray-500 mb-1 block">DIFFICULTY</label><select value={q.difficulty} onChange={e => updateQuestion(idx, 'difficulty', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
                          </div>
                          <div><label className="text-[10px] font-semibold text-gray-500 mb-1 block">PROBLEM STATEMENT *</label><textarea value={q.statement} onChange={e => updateQuestion(idx, 'statement', e.target.value)} rows={3} placeholder="Given an array..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-[10px] font-semibold text-gray-500 mb-1 block">INPUT FORMAT</label><textarea value={q.inputFormat} onChange={e => updateQuestion(idx, 'inputFormat', e.target.value)} rows={2} placeholder="First line: N..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div><label className="text-[10px] font-semibold text-gray-500 mb-1 block">OUTPUT FORMAT</label><textarea value={q.outputFormat} onChange={e => updateQuestion(idx, 'outputFormat', e.target.value)} rows={2} placeholder="Print the result..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                          </div>
                          <div><label className="text-[10px] font-semibold text-gray-500 mb-1 block">CONSTRAINTS</label><textarea value={q.constraints} onChange={e => updateQuestion(idx, 'constraints', e.target.value)} rows={2} placeholder="1 <= N <= 10^5" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>

                          {/* Test Cases */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-[10px] font-semibold text-gray-500">TEST CASES ({q.testCases.length})</label>
                              <button onClick={() => addTestCase(idx)} className="text-[10px] px-2 py-1 bg-green-600 text-white rounded font-medium">+ Add</button>
                            </div>
                            {q.testCases.map((tc, tcIdx) => (
                              <div key={tcIdx} className="grid grid-cols-2 gap-2 mb-2">
                                <div>
                                  <label className="text-[9px] text-gray-400">Input</label>
                                  <textarea value={tc.input} onChange={e => updateTestCase(idx, tcIdx, 'input', e.target.value)} rows={2} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="5\n1 2 3 4 5" />
                                </div>
                                <div>
                                  <label className="text-[9px] text-gray-400">Expected Output</label>
                                  <textarea value={tc.expectedOutput} onChange={e => updateTestCase(idx, tcIdx, 'expectedOutput', e.target.value)} rows={2} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="15" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700 shrink-0">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold disabled:opacity-50">
                <Save size={16} /> {editingContest ? 'Update' : 'Create'} Contest
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
