import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ArrowLeft, Tag, X, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../core/services/api';

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface CourseProblem {
  id?: string;
  title: string;
  difficulty: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  referenceSolution: string;
  topic: string;
  testCases: TestCase[];
}

interface Props {
  onBack: () => void;
  courseId: string;
  courseName: string;
}

export default function CourseCodingArena({ onBack, courseId, courseName }: Props) {
  const [problems, setProblems] = useState<CourseProblem[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [editingProblem, setEditingProblem] = useState<CourseProblem | null>(null);

  const [form, setForm] = useState<CourseProblem>({
    title: '', difficulty: 'easy', statement: '', inputFormat: '', outputFormat: '',
    constraints: '', referenceSolution: '', topic: '',
    testCases: [{ input: '', expectedOutput: '' }],
  });

  useEffect(() => { fetchProblems(); fetchTopics(); }, [courseId]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/problems?courseId=${courseId}&limit=100`);
      const inner = data.data?.problems || data.data || [];
      setProblems(Array.isArray(inner) ? inner : []);
    } catch { setProblems([]); }
    finally { setLoading(false); }
  };

  const fetchTopics = async () => {
    try {
      const { data } = await api.get(`/admin/topics?system=coding-arena&courseId=${courseId}`);
      setTopics((data.data || []).map((t: any) => t.name));
    } catch { setTopics([]); }
  };

  const handleAddTopic = async () => {
    if (!newTopic.trim()) return;
    try {
      await api.post('/admin/topics', { name: newTopic, system: 'coding-arena', courseId });
      toast.success('Topic added!', { position: 'top-center' });
      setNewTopic('');
      fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed', { position: 'top-center' });
    }
  };

  const handleDeleteTopic = async (topicName: string) => {
    if (!confirm(`Delete topic "${topicName}"?`)) return;
    try {
      const { data } = await api.get(`/admin/topics?system=coding-arena&courseId=${courseId}`);
      const topic = (data.data || []).find((t: any) => t.name === topicName);
      if (topic) {
        await api.delete(`/admin/topics/${topic.id}`);
        toast.success('Deleted!', { position: 'top-center' });
        fetchTopics();
      }
    } catch { toast.error('Failed to delete', { position: 'top-center' }); }
  };

  const handleSubmitProblem = async () => {
    if (!form.title || !form.statement) { toast.error('Title and statement required'); return; }
    try {
      const payload = { ...form, courseId, topics: form.topic, companies: '', tags: '', starterCode: { javascript: '', python: '', cpp: '', java: '' } };
      if (editingProblem?.id) {
        await api.put(`/admin/problems/${editingProblem.id}`, payload);
        toast.success('Updated!', { position: 'top-center' });
      } else {
        await api.post('/admin/problems', payload);
        toast.success('Problem added!', { position: 'top-center' });
      }
      resetForm();
      fetchProblems();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed', { position: 'top-center' }); }
  };

  const handleDeleteProblem = async (id: string) => {
    if (!confirm('Delete this problem?')) return;
    try { await api.delete(`/admin/problems/${id}`); toast.success('Deleted!', { position: 'top-center' }); fetchProblems(); }
    catch { toast.error('Failed'); }
  };

  const resetForm = () => {
    setForm({ title: '', difficulty: 'easy', statement: '', inputFormat: '', outputFormat: '', constraints: '', referenceSolution: '', topic: '', testCases: [{ input: '', expectedOutput: '' }] });
    setEditingProblem(null);
    setShowAddForm(false);
  };

  const startEdit = (p: any) => {
    setForm({ title: p.title, difficulty: p.difficulty, statement: p.statement || '', inputFormat: p.inputFormat || '', outputFormat: p.outputFormat || '', constraints: p.constraints || '', referenceSolution: p.referenceSolution || '', topic: p.topics || p.topic || '', testCases: [{ input: '', expectedOutput: '' }] });
    setEditingProblem(p);
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-medium transition">
            <ArrowLeft size={18} /> Back to Course
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">{courseName} - Coding Arena</h1>
              <p className="text-cyan-100 text-sm mt-1">Manage coding problems for {courseName} students</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowTopicModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 text-white rounded-xl hover:bg-white/30 transition font-medium text-sm">
                <Tag size={16} /> Topics ({topics.length})
              </button>
              <button onClick={() => { resetForm(); setShowAddForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition font-semibold text-sm shadow-lg">
                <Plus size={18} /> Add Problem
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Problems List */}
        {loading ? <p className="text-center text-gray-400 py-8">Loading...</p> :
        problems.length === 0 && !showAddForm ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 mb-4">No problems added yet for {courseName}</p>
            <button onClick={() => setShowAddForm(true)} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm">+ Add First Problem</button>
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map((p: any) => (
              <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between hover:shadow-sm transition">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{p.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.difficulty === 'hard' ? 'bg-red-100 text-red-600' : p.difficulty === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{p.difficulty}</span>
                    {(p.topics || p.topic) && <span className="text-[10px] text-gray-400">{p.topics || p.topic}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={15} /></button>
                  <button onClick={() => handleDeleteProblem(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Problem Form */}
        {showAddForm && (
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">{editingProblem ? 'Edit Problem' : 'Add New Problem'}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2"><label className="text-xs font-semibold text-gray-500 mb-1 block">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Two Sum" /></div>
                <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Difficulty</label><select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Topic</label><select value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"><option value="">-- No Topic --</option>{topics.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Problem Statement *</label><textarea value={form.statement} onChange={e => setForm({ ...form, statement: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe the problem..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Input Format</label><textarea value={form.inputFormat} onChange={e => setForm({ ...form, inputFormat: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Output Format</label><textarea value={form.outputFormat} onChange={e => setForm({ ...form, outputFormat: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Constraints</label><textarea value={form.constraints} onChange={e => setForm({ ...form, constraints: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1 <= N <= 10^5" /></div>
              <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Reference Solution</label><textarea value={form.referenceSolution} onChange={e => setForm({ ...form, referenceSolution: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" /></div>

              {/* Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500">Test Cases ({form.testCases.length})</label>
                  <button onClick={() => setForm({ ...form, testCases: [...form.testCases, { input: '', expectedOutput: '' }] })} className="text-xs px-2 py-1 bg-green-600 text-white rounded font-medium">+ Add</button>
                </div>
                {form.testCases.map((tc, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                    <div><label className="text-[9px] text-gray-400">Input</label><textarea value={tc.input} onChange={e => { const tcs = [...form.testCases]; tcs[i].input = e.target.value; setForm({ ...form, testCases: tcs }); }} rows={2} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono bg-white dark:bg-gray-800" placeholder="5\n1 2 3 4 5" /></div>
                    <div><label className="text-[9px] text-gray-400">Expected Output</label><textarea value={tc.expectedOutput} onChange={e => { const tcs = [...form.testCases]; tcs[i].expectedOutput = e.target.value; setForm({ ...form, testCases: tcs }); }} rows={2} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono bg-white dark:bg-gray-800" placeholder="15" /></div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={handleSubmitProblem} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">
                  {editingProblem ? 'Update Problem' : 'Create Problem'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Topic Management Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-bold text-lg">Manage Topics - {courseName}</h2>
              <button onClick={() => setShowTopicModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5">
              <div className="flex gap-2 mb-4">
                <input value={newTopic} onChange={e => setNewTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTopic()} placeholder="New topic name..." className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" />
                <button onClick={handleAddTopic} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"><Plus size={16} /></button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {topics.length === 0 ? <p className="text-center text-gray-400 text-sm py-4">No topics yet</p> :
                topics.map(t => (
                  <div key={t} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{t}</span>
                    <button onClick={() => handleDeleteTopic(t)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t"><button onClick={() => setShowTopicModal(false)} className="w-full py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-medium text-sm">Done</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
