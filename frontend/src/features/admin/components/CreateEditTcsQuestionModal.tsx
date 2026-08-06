import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { TcsQuestion, TestCase } from '../types/tcsNqt';
import { topicAdminService, Topic } from '../services/topicAdminService';

interface Props {
  question?: TcsQuestion | null;
  onSave: (question: TcsQuestion) => Promise<void>;
  onClose: () => void;
}

const emptyTestCase = (): TestCase => ({
  input: '',
  output: '',
  isHidden: false,
  explanation: '',
});

const defaultForm = (): TcsQuestion => ({
  title: '',
  difficulty: 'easy',
  statement: '',
  inputFormat: '',
  outputFormat: '',
  constraints: '',
  referenceSolution: '',
  topic: '',
  companies: 'TCS',
  experienceLevel: 'freshers',
  testCases: [emptyTestCase()],
});

function normaliseTc(tc: any): TestCase {
  return {
    input: tc.input ?? '',
    output: tc.output ?? tc.expectedOutput ?? '',
    isHidden: tc.isHidden ?? false,
    explanation: tc.explanation ?? '',
  };
}

export default function CreateEditTcsQuestionModal({ question, onSave, onClose }: Props) {
  const [formData, setFormData] = useState<TcsQuestion>(() => {
    if (!question) return defaultForm();
    return {
      ...defaultForm(),
      ...question,
      testCases:
        question.testCases && question.testCases.length > 0
          ? question.testCases.map(normaliseTc)
          : [emptyTestCase()],
    };
  });

  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [expandedTc, setExpandedTc] = useState<number>(0);

  useEffect(() => {
    topicAdminService
      .getTopics('tcs-nqt', true)
      .then(setTopics)
      .catch(() => toast.error('Failed to load topics'))
      .finally(() => setTopicsLoading(false));
  }, []);

  // ── field helpers ──────────────────────────────────────────────────────────
  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── test-case helpers ──────────────────────────────────────────────────────
  const setTc = (index: number, field: keyof TestCase, value: any) => {
    setFormData(prev => {
      const tcs = [...(prev.testCases ?? [])];
      tcs[index] = { ...tcs[index], [field]: value };
      return { ...prev, testCases: tcs };
    });
  };

  const addTc = () => {
    const nextIdx = formData.testCases?.length ?? 0;
    setFormData(prev => ({
      ...prev,
      testCases: [...(prev.testCases ?? []), emptyTestCase()],
    }));
    setExpandedTc(nextIdx);
  };

  const removeTc = (index: number) => {
    setFormData(prev => {
      const tcs = (prev.testCases ?? []).filter((_, i) => i !== index);
      return { ...prev, testCases: tcs.length ? tcs : [emptyTestCase()] };
    });
    setExpandedTc(0);
  };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    if (!formData.statement.trim()) { toast.error('Problem Statement is required'); return; }
    if (!formData.topic) { toast.error('Please select a Topic'); return; }

    const tcs = formData.testCases ?? [];
    for (let i = 0; i < tcs.length; i++) {
      if (!tcs[i].input.trim() || !tcs[i].output.trim()) {
        toast.error(`Test Case ${i + 1}: Input and Output cannot be empty`);
        setExpandedTc(i);
        return;
      }
    }

    try {
      setLoading(true);
      await onSave(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── shared styles ──────────────────────────────────────────────────────────
  const inputCls =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400';
  const labelCls =
    'block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[94vh] flex flex-col shadow-2xl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {question ? 'Edit Question' : 'Add New Question'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Same format as the seed-script — fill all fields including test cases.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* ── Form (scrollable) ────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

            {/* Row 1 — Title · Difficulty · Experience Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className={labelCls}>Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleField}
                  placeholder="e.g. Maximum Subarray Sum"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Difficulty *</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleField} className={inputCls}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Experience Level *</label>
                <select name="experienceLevel" value={formData.experienceLevel ?? 'freshers'} onChange={handleField} className={inputCls}>
                  <option value="freshers">Freshers</option>
                  <option value="experienced">Experienced</option>
                </select>
              </div>
            </div>

            {/* Row 2 — Topic · Companies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Topic *</label>
                {topicsLoading ? (
                  <div className={`${inputCls} text-gray-400`}>Loading topics…</div>
                ) : (
                  <select name="topic" value={formData.topic ?? ''} onChange={handleField} className={inputCls}>
                    <option value="">-- Select Topic --</option>
                    {topics.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className={labelCls}>Companies (comma-separated)</label>
                <input
                  name="companies"
                  value={formData.companies ?? ''}
                  onChange={handleField}
                  placeholder="e.g. TCS, Wipro, Infosys"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Problem Statement */}
            <div>
              <label className={labelCls}>Problem Statement *</label>
              <textarea
                name="statement"
                value={formData.statement}
                onChange={handleField}
                placeholder="Given an integer array nums, find the subarray with the largest sum and return its sum."
                rows={4}
                className={inputCls}
              />
            </div>

            {/* Input Format · Output Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Input Format</label>
                <textarea
                  name="inputFormat"
                  value={formData.inputFormat}
                  onChange={handleField}
                  placeholder={`The first line contains an integer N.\nThe second line contains N space-separated integers.`}
                  rows={3}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Output Format</label>
                <textarea
                  name="outputFormat"
                  value={formData.outputFormat}
                  onChange={handleField}
                  placeholder="Print the maximum subarray sum."
                  rows={3}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Constraints */}
            <div>
              <label className={labelCls}>Constraints</label>
              <textarea
                name="constraints"
                value={formData.constraints}
                onChange={handleField}
                placeholder={`1 <= N <= 10^5\n-10^4 <= nums[i] <= 10^4`}
                rows={2}
                className={`${inputCls} font-mono`}
              />
            </div>

            {/* Reference Solution */}
            <div>
              <label className={labelCls}>Reference Solution (JavaScript)</label>
              <textarea
                name="referenceSolution"
                value={formData.referenceSolution}
                onChange={handleField}
                placeholder={`function solve(input) {\n  const lines = input.trim().split('\\n');\n  const n = parseInt(lines[0]);\n  // your logic here\n  console.log(result);\n}`}
                rows={6}
                className={`${inputCls} font-mono text-xs`}
              />
            </div>

            {/* ── Test Cases ────────────────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>
                  Test Cases
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[10px] font-bold normal-case tracking-normal">
                    {formData.testCases?.length ?? 0} added
                  </span>
                </label>
                <button
                  type="button"
                  onClick={addTc}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-800 transition"
                >
                  <Plus size={13} /> Add Test Case
                </button>
              </div>

              <div className="space-y-2">
                {(formData.testCases ?? []).map((tc, idx) => (
                  <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">

                    {/* Collapsed header */}
                    <button
                      type="button"
                      onClick={() => setExpandedTc(expandedTc === idx ? -1 : idx)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                          Test Case {idx + 1}
                        </span>
                        {tc.isHidden ? (
                          <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-900/30 text-red-500 border border-red-200 dark:border-red-800 font-semibold">
                            <EyeOff size={10} /> Hidden
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-900/30 text-green-600 border border-green-200 dark:border-green-800 font-semibold">
                            <Eye size={10} /> Visible
                          </span>
                        )}
                        {tc.input && (
                          <span className="text-[10px] text-gray-400 font-mono truncate max-w-[140px]">
                            {tc.input.replace(/\n/g, ' · ')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {(formData.testCases?.length ?? 0) > 1 && (
                          <span
                            role="button"
                            onClick={e => { e.stopPropagation(); removeTc(idx); }}
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 size={13} />
                          </span>
                        )}
                        {expandedTc === idx
                          ? <ChevronUp size={14} className="text-gray-400" />
                          : <ChevronDown size={14} className="text-gray-400" />}
                      </div>
                    </button>

                    {/* Expanded body */}
                    {expandedTc === idx && (
                      <div className="px-4 py-3 space-y-3 bg-white dark:bg-gray-900">
                        <div>
                          <label className={labelCls}>Input</label>
                          <textarea
                            value={tc.input}
                            onChange={e => setTc(idx, 'input', e.target.value)}
                            placeholder={`9\n-2 1 -3 4 -1 2 1 -5 4`}
                            rows={3}
                            className={`${inputCls} font-mono text-xs`}
                          />
                          <p className="text-[10px] text-gray-400 mt-0.5">Each Enter = new line of stdin input.</p>
                        </div>

                        <div>
                          <label className={labelCls}>Expected Output</label>
                          <textarea
                            value={tc.output}
                            onChange={e => setTc(idx, 'output', e.target.value)}
                            placeholder="6"
                            rows={2}
                            className={`${inputCls} font-mono text-xs`}
                          />
                        </div>

                        <div>
                          <label className={labelCls}>Explanation (optional)</label>
                          <input
                            value={tc.explanation ?? ''}
                            onChange={e => setTc(idx, 'explanation', e.target.value)}
                            placeholder="The subarray [4,-1,2,1] has the largest sum = 6."
                            className={inputCls}
                          />
                        </div>

                        {/* Hidden toggle */}
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setTc(idx, 'isHidden', !tc.isHidden)}
                            className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
                              tc.isHidden ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                              tc.isHidden ? 'translate-x-4' : 'translate-x-1'
                            }`} />
                          </button>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {tc.isHidden
                              ? 'Hidden — used for judging only, student cannot see this'
                              : 'Visible — shown as sample test case to student'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-400 mt-2">
                💡 Tip: Add 2–3 visible sample cases + 1–2 hidden cases (exactly like the seed-script format).
              </p>
            </div>

          </div>{/* end scroll area */}

          {/* ── Footer — inside form so type=submit works ─────────────────── */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
            <span className="text-xs text-gray-400">* Required fields</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Saving…' : question ? 'Update Question' : 'Create Question'}
              </button>
            </div>
          </div>

        </form>{/* end form */}
      </div>
    </div>
  );
}
