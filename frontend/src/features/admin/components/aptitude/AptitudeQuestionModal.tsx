import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { AptitudeQuestion, AptitudeOption, QuestionType, Difficulty } from '../../services/aptitudeAdminService';

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy',   label: 'Easy',   color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
  { value: 'hard',   label: 'Hard',   color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
];

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'MCQ', label: 'Multiple Choice (MCQ)' },
  { value: 'TrueFalse', label: 'True / False' },
  { value: 'DiagramBased', label: 'Diagram Based' },
  { value: 'Numerical', label: 'Numerical' },
  { value: 'Coding', label: 'Coding' },
];

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

const emptyForm = () => ({
  statement: '',
  difficulty: 'medium' as Difficulty,
  questionType: 'MCQ' as QuestionType,
  options: OPTION_KEYS.map((k, i) => ({ optionKey: k, text: '', isCorrect: i === 0 })) as AptitudeOption[],
  explanation: '',
  stepSolution: '',
  formula: '',
  hints: '',
  imageUrl: '',
  tags: '',
  xpReward: 10,
  timeLimit: 30,
  companies: '',
});

interface Props {
  question?: AptitudeQuestion | null;
  chapters?: { id: string; name: string }[];
  defaultChapterId?: string;
  onSave: (data: any) => void;
  onClose: () => void;
  saving?: boolean;
}

export default function AptitudeQuestionModal({ question, chapters = [], defaultChapterId, onSave, onClose, saving }: Props) {
  const [form, setForm] = useState(emptyForm());
  const [chapterId, setChapterId] = useState(defaultChapterId || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (question) {
      setForm({
        statement: question.statement || '',
        difficulty: question.difficulty || 'medium',
        questionType: (question.questionType as QuestionType) || 'MCQ',
        options: question.options?.length
          ? question.options.map((o) => ({ optionKey: o.optionKey, text: o.text, isCorrect: o.isCorrect }))
          : OPTION_KEYS.map((k, i) => ({ optionKey: k, text: '', isCorrect: i === 0 })),
        explanation: question.explanation || '',
        stepSolution: question.stepSolution || '',
        formula: question.formula || '',
        hints: question.hints || '',
        imageUrl: question.imageUrl || '',
        tags: question.tags || '',
        xpReward: question.xpReward || 10,
        timeLimit: question.timeLimit || 30,
        companies: question.companies || '',
      });
      if (question.imageUrl) setImagePreview(question.imageUrl);
      if (question.chapterId) setChapterId(question.chapterId);
    } else {
      setForm(emptyForm());
      setChapterId(defaultChapterId || '');
      setImagePreview('');
    }
  }, [question, defaultChapterId]);

  const setOption = (index: number, field: keyof AptitudeOption, value: any) => {
    setForm((prev) => {
      const options = prev.options.map((o, i) => {
        if (field === 'isCorrect') return { ...o, isCorrect: i === index };
        if (i === index) return { ...o, [field]: value };
        return o;
      });
      return { ...prev, options };
    });
  };

  const handleImageFile = (file: File) => {
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      alert('Only PNG, JPG, SVG are supported'); return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.statement.trim()) { alert('Question statement is required'); return; }
    const filled = form.options.filter((o) => o.text.trim());
    if (filled.length < 2) { alert('At least 2 options must have text'); return; }
    if (!form.options.some((o) => o.isCorrect)) { alert('Select a correct answer'); return; }
    if (!form.difficulty) { alert('Difficulty is required'); return; }

    const payload: any = {
      ...form,
      options: form.options.filter((o) => o.text.trim()),
      chapterId: chapterId || undefined,
    };
    onSave(payload);
  };

  const correctKey = form.options.find((o) => o.isCorrect)?.optionKey;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center p-3 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {question ? 'Edit Question' : 'Add Question'}
            </h2>
            {correctKey && <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Correct: Option {correctKey}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Chapter selector (if chapters provided) */}
          {chapters.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Chapter</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">— Auto (General chapter) —</option>
                {chapters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Question Type + Difficulty row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Question Type</label>
              <select
                value={form.questionType}
                onChange={(e) => setForm((p) => ({ ...p, questionType: e.target.value as QuestionType }))}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Difficulty *</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, difficulty: d.value }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition border-2 ${form.difficulty === d.value ? `${d.color} border-current` : 'bg-gray-50 dark:bg-gray-700 text-gray-500 border-transparent hover:border-gray-300'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Statement */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Question *</label>
            <textarea
              value={form.statement}
              onChange={(e) => setForm((p) => ({ ...p, statement: e.target.value }))}
              placeholder="Enter the question text…"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Diagram / Image (optional)</label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${dragOver ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(''); setForm((p) => ({ ...p, imageUrl: '' })); }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2 text-gray-400 dark:text-gray-500">
                  <ImageIcon size={24} />
                  <p className="text-xs">Drag & drop or click to upload PNG, JPG, SVG</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.svg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
            </div>
            {/* OR paste URL */}
            <input
              type="url"
              value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
              onChange={(e) => { setForm((p) => ({ ...p, imageUrl: e.target.value })); setImagePreview(e.target.value); }}
              placeholder="…or paste an image URL"
              className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* MCQ Options */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Options * — click radio to set correct answer
            </label>
            <div className="space-y-2">
              {form.options.map((opt, i) => (
                <div key={opt.optionKey} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition ${opt.isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40'}`}>
                  <button
                    type="button"
                    onClick={() => setOption(i, 'isCorrect', true)}
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${opt.isCorrect ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-500 hover:border-green-400'}`}
                  >
                    {opt.isCorrect && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </button>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${opt.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                    {opt.optionKey}
                  </span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => setOption(i, 'text', e.target.value)}
                    placeholder={`Option ${opt.optionKey}`}
                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Explanation</label>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))}
              placeholder="Explain why the correct answer is right…"
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced((p) => !p)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-orange-500 transition"
          >
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showAdvanced ? 'Hide' : 'Show'} advanced fields (step solution, formula, hints, tags…)
          </button>

          {showAdvanced && (
            <div className="space-y-4 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Step-by-step Solution</label>
                <textarea value={form.stepSolution} onChange={(e) => setForm((p) => ({ ...p, stepSolution: e.target.value }))} placeholder="Step 1: …&#10;Step 2: …" rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Formula Used</label>
                <input type="text" value={form.formula} onChange={(e) => setForm((p) => ({ ...p, formula: e.target.value }))} placeholder="e.g., SI = (P × R × T) / 100"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Hints</label>
                <input type="text" value={form.hints} onChange={(e) => setForm((p) => ({ ...p, hints: e.target.value }))} placeholder="e.g., Try to simplify the fraction first"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                  <input type="text" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="e.g., percentage,profit"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Est. Time (seconds)</label>
                  <input type="number" value={form.timeLimit} min={10} onChange={(e) => setForm((p) => ({ ...p, timeLimit: parseInt(e.target.value) || 30 }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">XP Reward</label>
                  <input type="number" value={form.xpReward} min={1} onChange={(e) => setForm((p) => ({ ...p, xpReward: parseInt(e.target.value) || 10 }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Companies</label>
                  <input type="text" value={form.companies} onChange={(e) => setForm((p) => ({ ...p, companies: e.target.value }))} placeholder="TCS,Infosys"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-xl font-medium text-sm transition">
              {saving ? 'Saving…' : question ? 'Save Changes' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
