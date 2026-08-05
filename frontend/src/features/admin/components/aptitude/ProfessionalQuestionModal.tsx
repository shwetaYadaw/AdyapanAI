import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { AptitudeQuestion } from '../../services/aptitudeAdminService';

interface QuestionModalProps {
  isOpen: boolean;
  question?: AptitudeQuestion;
  chapterId: string;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

interface QuestionFormState {
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  negativeMarks: number;
  timeLimit: number;
  options: Array<{ key: string; text: string; isImage: boolean }>;
  correctOption: string;
  explanation: string;
  companies: string[];
  status: 'active' | 'inactive';
}

const COMPANIES = ['TCS', 'Infosys', 'Capgemini', 'Accenture', 'Wipro', 'Amazon', 'Microsoft', 'Google'];
const OPTION_KEYS = ['A', 'B', 'C', 'D'];

export default function ProfessionalQuestionModal({
  isOpen,
  question,
  chapterId,
  onSave,
  onClose,
}: QuestionModalProps) {
  const [form, setForm] = useState<QuestionFormState>({
    statement: '',
    difficulty: 'medium',
    marks: 1,
    negativeMarks: 0,
    timeLimit: 30,
    options: [
      { key: 'A', text: '', isImage: false },
      { key: 'B', text: '', isImage: false },
      { key: 'C', text: '', isImage: false },
      { key: 'D', text: '', isImage: false },
    ],
    correctOption: 'A',
    explanation: '',
    companies: [],
    status: 'active',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (question) {
      const opts = question.options || [];
      setForm({
        statement: question.statement || '',
        difficulty: (question.difficulty as any) || 'medium',
        marks: question.xpReward || 1,
        negativeMarks: 0,
        timeLimit: question.timeLimit || 30,
        options: OPTION_KEYS.map((key, idx) => ({
          key,
          text: opts[idx]?.text || '',
          isImage: false,
        })),
        correctOption: question.correctOption || 'A',
        explanation: question.explanation || '',
        companies: question.companies ? question.companies.split(',') : [],
        status: question.isActive ? 'active' : 'inactive',
      });
    }
  }, [question, isOpen]);

  const handleSave = async () => {
    if (!form.statement.trim()) {
      alert('Please enter the question');
      return;
    }

    if (form.options.some((opt) => !opt.text.trim())) {
      alert('All options must have text');
      return;
    }

    if (!form.explanation.trim()) {
      alert('Please enter an explanation');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        statement: form.statement,
        difficulty: form.difficulty,
        xpReward: form.marks,
        timeLimit: form.timeLimit,
        options: form.options.map((opt) => ({
          optionKey: opt.key,
          text: opt.text,
        })),
        correctOption: form.correctOption,
        explanation: form.explanation,
        companies: form.companies.join(','),
        isActive: form.status === 'active',
      };

      await onSave(payload);
      onClose();
    } catch (error) {
      console.error('Error saving question:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-900 dark:to-primary-800 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">
            {question ? 'Edit Question' : 'Create New Question'}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition"
              title={showPreview ? 'Hide preview' : 'Show preview'}
            >
              {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {showPreview ? (
            // Preview Section
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Student Preview</h3>

              {/* Question */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
                <p className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
                  {form.statement || '[Question will appear here]'}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Difficulty: <span className="font-semibold text-primary-600">{form.difficulty}</span></span>
                  <span>Marks: <span className="font-semibold text-primary-600">+{form.marks}</span></span>
                  <span>Time: <span className="font-semibold text-primary-600">{form.timeLimit}s</span></span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {form.options.map((opt) => (
                  <label key={opt.key} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 cursor-pointer transition">
                    <input
                      type="radio"
                      name="answer"
                      value={opt.key}
                      disabled
                      className="w-5 h-5"
                    />
                    <span className="flex-1 text-gray-900 dark:text-white font-medium">{opt.key}. {opt.text || '[Option]'}</span>
                    {form.correctOption === opt.key && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ Correct
                      </span>
                    )}
                  </label>
                ))}
              </div>

              {/* Explanation */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Explanation:</h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {form.explanation || '[Explanation will appear here]'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Section 1: Question Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Question Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Question *
                    </label>
                    <textarea
                      value={form.statement}
                      onChange={(e) => setForm({ ...form, statement: e.target.value })}
                      placeholder="Enter the question text..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Difficulty
                      </label>
                      <select
                        value={form.difficulty}
                        onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Marks
                      </label>
                      <select
                        value={form.marks}
                        onChange={(e) => setForm({ ...form, marks: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Negative Marks
                      </label>
                      <select
                        value={form.negativeMarks}
                        onChange={(e) => setForm({ ...form, negativeMarks: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="0">0</option>
                        <option value="0.25">0.25</option>
                        <option value="0.5">0.5</option>
                        <option value="1">1</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Time (sec)
                      </label>
                      <select
                        value={form.timeLimit}
                        onChange={(e) => setForm({ ...form, timeLimit: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="30">30 sec</option>
                        <option value="60">60 sec</option>
                        <option value="90">90 sec</option>
                        <option value="120">120 sec</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Options */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">MCQ Options</h3>
                <div className="space-y-3">
                  {form.options.map((opt, idx) => (
                    <div key={opt.key} className="flex items-start gap-3">
                      <div className="flex items-center pt-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            value={opt.key}
                            checked={form.correctOption === opt.key}
                            onChange={(e) => setForm({ ...form, correctOption: e.target.value })}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </label>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                            {opt.key}
                          </span>
                        </div>
                        <textarea
                          value={opt.text}
                          onChange={(e) => {
                            const newOptions = [...form.options];
                            newOptions[idx].text = e.target.value;
                            setForm({ ...form, options: newOptions });
                          }}
                          placeholder={`Option ${opt.key}...`}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Explanation */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Explanation *</h3>
                <textarea
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  placeholder="Provide a detailed step-by-step explanation..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                  rows={4}
                />
              </div>

              {/* Section 4: Tags */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Companies</h3>
                <div className="flex flex-wrap gap-2">
                  {COMPANIES.map((company) => (
                    <button
                      key={company}
                      onClick={() => {
                        setForm({
                          ...form,
                          companies: form.companies.includes(company)
                            ? form.companies.filter((c) => c !== company)
                            : [...form.companies, company],
                        });
                      }}
                      className={`px-4 py-2 rounded-full font-medium transition ${
                        form.companies.includes(company)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 5: Status */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Status</h3>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-8 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : question ? 'Update Question' : 'Create Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
