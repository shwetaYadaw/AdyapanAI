import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ArrowLeft, Tag, X, ChevronDown, ChevronUp, Search, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../core/services/api';

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Dataset {
  id: string;
  name: string;
  description: string;
  tableName: string;
  columns: string;
  sampleData: string;
  questionLimit: number;
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
  dataset?: string; // dataset ID or name
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
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [editingProblem, setEditingProblem] = useState<CourseProblem | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTopicView, setSelectedTopicView] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  // Dataset management
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetForm, setDatasetForm] = useState({ name: '', description: '', tableName: '', columns: '', sampleData: '' });

  const [form, setForm] = useState<CourseProblem>({
    title: '', difficulty: 'easy', statement: '', inputFormat: '', outputFormat: '',
    constraints: '', referenceSolution: '', topic: '',
    testCases: [{ input: '', expectedOutput: '' }],
  });

  useEffect(() => { fetchProblems(); fetchTopics(); fetchDatasets(); }, [courseId]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/problems?courseId=${courseId}&limit=1000`);
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

  // Datasets are stored in localStorage per course (simple approach without new DB model)
  const fetchDatasets = () => {
    const stored = localStorage.getItem(`datasets_${courseId}`);
    setDatasets(stored ? JSON.parse(stored) : []);
  };

  const saveDataset = () => {
    if (!datasetForm.name || !datasetForm.tableName || !datasetForm.columns) {
      toast.error('Name, table name, and columns are required');
      return;
    }
    const newDataset: Dataset = {
      id: Date.now().toString(),
      name: datasetForm.name,
      description: datasetForm.description,
      tableName: datasetForm.tableName,
      columns: datasetForm.columns,
      sampleData: datasetForm.sampleData,
      questionLimit: parseInt((datasetForm as any).questionLimit) || 20,
      topic: (datasetForm as any).topic || '',
    } as any;
    const updated = [...datasets, newDataset];
    setDatasets(updated);
    localStorage.setItem(`datasets_${courseId}`, JSON.stringify(updated));
    setDatasetForm({ name: '', description: '', tableName: '', columns: '', sampleData: '' });
    toast.success('Dataset created!', { position: 'top-center' });
  };

  const deleteDataset = (id: string) => {
    const updated = datasets.filter(d => d.id !== id);
    setDatasets(updated);
    localStorage.setItem(`datasets_${courseId}`, JSON.stringify(updated));
    toast.success('Dataset deleted!', { position: 'top-center' });
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
      const { data } = await api.get(`/admin/topics?system=coding-arena`);
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
              <p className="text-cyan-100 text-sm mt-1">Manage coding problems for {courseName} students · <strong>{problems.length} Questions</strong> added</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDatasetModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 text-white rounded-xl hover:bg-white/30 transition font-medium text-sm">
                <Database size={16} /> Datasets ({datasets.length})
              </button>
              <button onClick={() => setShowTopicModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white/20 border-2 border-white/40 text-white rounded-xl hover:bg-white/30 transition font-semibold text-sm">
                <Tag size={18} /> Add / Manage Topics ({topics.length})
              </button>
              <button onClick={() => { resetForm(); setShowAddForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition font-semibold text-sm shadow-lg">
                <Plus size={18} /> Add Problem
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Total Questions Count */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Total Questions: {problems.length}</h2>
        </div>

        {/* Topics as Cards */}
        {topics.length > 0 && !selectedTopicView && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {topics.map(t => {
              const count = problems.filter((p: any) => (p.topics || p.topic || '').toLowerCase().includes(t.toLowerCase())).length;
              const topicDatasets = datasets.filter(d => (d as any).topic === t);
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTopicView(t)}
                  className="p-4 rounded-xl border-2 text-left transition-all bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-md"
                >
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{t}</p>
                  <p className="text-xs mt-1 text-gray-400">{count} Questions</p>
                  {topicDatasets.length > 0 && <p className="text-[10px] mt-0.5 text-blue-500">{topicDatasets.length} Datasets</p>}
                </button>
              );
            })}
          </div>
        )}

        {/* Topic Detail View - Datasets & Questions */}
        {selectedTopicView && (
          <div className="mb-6">
            <button onClick={() => { setSelectedTopicView(null); setTopicFilter(''); }} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-4">
              <ArrowLeft size={16} /> Back to All Topics
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedTopicView}</h2>
            <p className="text-sm text-gray-500 mb-4">Manage questions for {selectedTopicView} topic.</p>

            {/* Add Dataset section - for SQL, Pandas, and NumPy topics */}
            {['sql', 'pandas', 'numpy'].includes(selectedTopicView.toLowerCase()) && (
            <>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Database size={16} className="text-blue-500" /> Add New Dataset for {selectedTopicView}</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input value={datasetForm.name} onChange={e => setDatasetForm({ ...datasetForm, name: e.target.value })} placeholder="Dataset name (e.g., Employees Table)" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <input value={datasetForm.tableName} onChange={e => setDatasetForm({ ...datasetForm, tableName: e.target.value })} placeholder="Table name (e.g., employees)" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <input value={datasetForm.columns} onChange={e => setDatasetForm({ ...datasetForm, columns: e.target.value })} placeholder="Columns: employee_id, first_name, last_name, department, salary, manager_id" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
              <textarea value={datasetForm.sampleData} onChange={e => setDatasetForm({ ...datasetForm, sampleData: e.target.value })} placeholder={"Sample rows (one per line):\n101, Alice, Johnson, HR, 45000, NULL\n102, Bob, Smith, IT, 60000, 101\n103, Charlie, Brown, Finance, 55000, 101"} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
              <div className="flex items-center gap-3">
                <input type="number" min={1} value={(datasetForm as any).questionLimit || 20} onChange={e => setDatasetForm({ ...datasetForm, questionLimit: e.target.value } as any)} className="w-32 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <span className="text-xs text-gray-500">questions will use this dataset</span>
                <button onClick={() => { (datasetForm as any).topic = selectedTopicView; saveDataset(); }} className="ml-auto px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">+ Create Dataset</button>
              </div>
            </div>

            {/* Existing Datasets for this topic */}
            {datasets.filter(d => (d as any).topic === selectedTopicView).length > 0 ? (
              <div className="space-y-3 mb-6">
                {datasets.filter(d => (d as any).topic === selectedTopicView).map((d, idx) => {
                  const cols = d.columns.split(',').map(c => c.trim());
                  const rows = d.sampleData.split('\n').filter(r => r.trim());
                  return (
                    <div key={d.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{d.name}</h4>
                          <p className="text-[10px] text-gray-500">Table: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{d.tableName}</code> · {d.questionLimit} questions · Dataset #{idx + 1}</p>
                        </div>
                        <button onClick={() => deleteDataset(d.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                      {/* Table Preview */}
                      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800">
                              {cols.map(c => <th key={c} className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">{c}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, ri) => (
                              <tr key={ri} className="border-b border-gray-100 dark:border-gray-800 last:border-none">
                                {row.split(',').map((cell, ci) => <td key={ci} className="px-3 py-1.5 text-gray-700 dark:text-gray-300">{cell.trim()}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Add Question under this dataset */}
                      <div className="mt-4">
                        <button
                          onClick={() => { resetForm(); setForm({ ...form, topic: selectedTopicView!, dataset: d.name, inputFormat: `Use table: ${d.tableName}\nColumns: ${d.columns}`, outputFormat: 'Return the result set as a table' }); setShowAddForm(true); }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                        >
                          <Plus size={14} /> Add SQL Question under "{d.name}"
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">No datasets yet for {selectedTopicView}. Add one above to group questions.</p>
            )}
            </>
            )}

            {/* Questions under this topic */}
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Questions in {selectedTopicView} ({problems.filter((p: any) => (p.topics || p.topic || '').toLowerCase().includes(selectedTopicView.toLowerCase())).length})</h3>
            <button onClick={() => { resetForm(); setForm({ ...form, topic: selectedTopicView }); setShowAddForm(true); }} className="mb-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"><Plus size={16} /> Add Question to {selectedTopicView}</button>
          </div>
        )}

        {/* Filters - show when NOT in topic detail view OR when in detail view */}
        {!selectedTopicView && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search problems..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={difficultyFilter} onChange={e => { setDifficultyFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select value={topicFilter} onChange={e => { setTopicFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories ({topics.length})</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        )}

        {/* Problems List */}
        {(() => {
          // Apply filters
          let filtered = problems;
          if (selectedTopicView) {
            filtered = filtered.filter((p: any) => (p.topics || p.topic || '').toLowerCase().includes(selectedTopicView.toLowerCase()));
          }
          if (search) filtered = filtered.filter((p: any) => p.title?.toLowerCase().includes(search.toLowerCase()));
          if (difficultyFilter) filtered = filtered.filter((p: any) => p.difficulty === difficultyFilter);
          if (topicFilter) filtered = filtered.filter((p: any) => (p.topics || p.topic || '').toLowerCase().includes(topicFilter.toLowerCase()));
          const totalPages = Math.ceil(filtered.length / perPage);
          const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

          return (<>
        {loading ? <p className="text-center text-gray-400 py-8">Loading...</p> :
        paginated.length === 0 && !showAddForm ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 mb-4">{problems.length === 0 ? `No problems added yet for ${courseName}` : 'No problems match your filters'}</p>
            {problems.length === 0 && <button onClick={() => setShowAddForm(true)} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm">+ Add First Problem</button>}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Title</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-400">Difficulty</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-400">Topic</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-400">Success Rate</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-400">Attempts</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginated.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${p.difficulty === 'hard' ? 'bg-red-100 text-red-600' : p.difficulty === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{p.difficulty}</span>
                    </td>
                    <td className="text-center px-3 py-3 text-xs text-gray-600 dark:text-gray-400">{p.topics || p.topic || '-'}</td>
                    <td className="text-center px-3 py-3 text-xs text-gray-600">{p.successRate || '0.0'}%</td>
                    <td className="text-center px-3 py-3 text-xs text-gray-600">{p.totalAttempts || 0}</td>
                    <td className="text-center px-3 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{p.isArchived ? 'Archived' : 'Active'}</span>
                    </td>
                    <td className="text-center px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => startEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteProblem(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-40">← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3.5 py-2 rounded-lg text-sm font-semibold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700'}`}>{i + 1}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-40">Next →</button>
          </div>
        )}
          </>); })()}

        {/* Add/Edit Problem Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-800 my-8 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">{editingProblem ? 'Edit Problem' : 'Add New Problem'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Title & Difficulty */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2"><label className="text-xs font-semibold text-gray-500 mb-1 block">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder={form.dataset ? "e.g., Find employees with salary > 50000" : "e.g., Two Sum"} /></div>
                <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Difficulty</label><select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Topic</label><select value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"><option value="">-- No Topic --</option>{topics.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              {datasets.length > 0 && (
                <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Dataset (for SQL questions)</label><select value={form.dataset || ''} onChange={e => setForm({ ...form, dataset: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"><option value="">-- No Dataset --</option>{datasets.map(d => <option key={d.id} value={d.name}>{d.name} ({d.tableName})</option>)}</select></div>
              )}

              {/* SQL-specific form */}
              {(form.dataset || (form.topic || '').toLowerCase() === 'sql') ? (
                <>
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">📊 SQL Question Mode</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400">This question will be solved by writing SQL queries against the dataset table.</p>
                  </div>
                  <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Problem Statement * (What should the student query?)</label><textarea value={form.statement} onChange={e => setForm({ ...form, statement: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Write a SQL query to find all employees whose salary is greater than 50000." /></div>
                  <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Expected SQL Query (Correct Answer)</label><textarea value={form.referenceSolution} onChange={e => setForm({ ...form, referenceSolution: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="SELECT * FROM employees WHERE salary > 50000;" /></div>
                  <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Expected Output (Result Table - one row per line, comma-separated)</label><textarea value={form.outputFormat} onChange={e => setForm({ ...form, outputFormat: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder={"employee_id, first_name, last_name, department, salary, manager_id\n102, Bob, Smith, IT, 60000, 101\n103, Charlie, Brown, Finance, 55000, 101"} /></div>
                  <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Hints / Notes (optional)</label><textarea value={form.constraints} onChange={e => setForm({ ...form, constraints: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Use WHERE clause for filtering. Consider using ORDER BY for sorted results." /></div>
                </>
              ) : (
                <>
                  {/* Regular coding question form */}
                  <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Problem Statement *</label><textarea value={form.statement} onChange={e => setForm({ ...form, statement: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe the problem..." /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Input Format</label><textarea value={form.inputFormat} onChange={e => setForm({ ...form, inputFormat: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Output Format</label><textarea value={form.outputFormat} onChange={e => setForm({ ...form, outputFormat: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                  </div>
                  <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Constraints</label><textarea value={form.constraints} onChange={e => setForm({ ...form, constraints: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1 <= N <= 10^5" /></div>
                  <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Reference Solution</label><textarea value={form.referenceSolution} onChange={e => setForm({ ...form, referenceSolution: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                </>
              )}

              {/* Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500">{form.dataset ? 'Test Queries' : 'Test Cases'} ({form.testCases.length})</label>
                  <button onClick={() => setForm({ ...form, testCases: [...form.testCases, { input: '', expectedOutput: '' }] })} className="text-xs px-2 py-1 bg-green-600 text-white rounded font-medium">+ Add</button>
                </div>
                {form.testCases.map((tc, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                    <div><label className="text-[9px] text-gray-400">{form.dataset ? 'SQL Query' : 'Input'}</label><textarea value={tc.input} onChange={e => { const tcs = [...form.testCases]; tcs[i].input = e.target.value; setForm({ ...form, testCases: tcs }); }} rows={2} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono bg-white dark:bg-gray-800" placeholder={form.dataset ? "SELECT * FROM employees WHERE salary > 50000;" : "5\n1 2 3 4 5"} /></div>
                    <div><label className="text-[9px] text-gray-400">{form.dataset ? 'Expected Result' : 'Expected Output'}</label><textarea value={tc.expectedOutput} onChange={e => { const tcs = [...form.testCases]; tcs[i].expectedOutput = e.target.value; setForm({ ...form, testCases: tcs }); }} rows={2} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono bg-white dark:bg-gray-800" placeholder={form.dataset ? "102, Bob, Smith, IT, 60000, 101" : "15"} /></div>
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
          </div>
        )}
      </div>

      {/* Dataset Management Modal */}
      {showDatasetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-bold text-lg flex items-center gap-2"><Database size={20} className="text-blue-500" /> Manage Datasets</h2>
              <button onClick={() => setShowDatasetModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Create Dataset Form */}
              <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 uppercase">Create New Dataset</p>
                <input value={datasetForm.name} onChange={e => setDatasetForm({ ...datasetForm, name: e.target.value })} placeholder="Dataset name (e.g., Employee Database)" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <input value={datasetForm.tableName} onChange={e => setDatasetForm({ ...datasetForm, tableName: e.target.value })} placeholder="Table name (e.g., employees)" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
                <input value={datasetForm.columns} onChange={e => setDatasetForm({ ...datasetForm, columns: e.target.value })} placeholder="Columns (comma-separated): id, name, salary, department" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
                <textarea value={datasetForm.sampleData} onChange={e => setDatasetForm({ ...datasetForm, sampleData: e.target.value })} placeholder={"Sample data (one row per line):\n1, John, 50000, Engineering\n2, Jane, 60000, Marketing\n3, Bob, 45000, Engineering"} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">Questions Limit (how many Qs use this dataset)</label>
                    <input type="number" min={1} value={(datasetForm as any).questionLimit || 20} onChange={e => setDatasetForm({ ...datasetForm, questionLimit: e.target.value } as any)} placeholder="20" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">Description (optional)</label>
                    <input value={datasetForm.description} onChange={e => setDatasetForm({ ...datasetForm, description: e.target.value })} placeholder="Brief description..." className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <button onClick={saveDataset} className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">+ Create Dataset</button>
              </div>

              {/* Existing Datasets */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {datasets.length === 0 ? <p className="text-center text-gray-400 text-sm py-4">No datasets yet. Create one above.</p> :
                datasets.map(d => (
                  <div key={d.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{d.name}</span>
                      <button onClick={() => deleteDataset(d.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono">Table: {d.tableName} | Columns: {d.columns}</p>
                    <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Limit: {d.questionLimit} questions</p>
                    {d.description && <p className="text-[10px] text-gray-400 mt-0.5">{d.description}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t"><button onClick={() => setShowDatasetModal(false)} className="w-full py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium text-sm">Done</button></div>
          </div>
        </div>
      )}

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
