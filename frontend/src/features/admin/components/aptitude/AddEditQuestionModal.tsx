import React, { useState } from 'react';
import { X, Plus, Trash2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../../shared/components/Button/Button';
import RichTextEditor from '../RichTextEditor';

interface Question {
  id?: string;
  question: string;
  difficulty: string;
  marks?: number;
  negativeMarks?: number;
  estimatedTime?: number;
  options?: Option[];
  correctOptionIndex?: number;
  explanation?: string;
  tags?: string[];
  company?: string;
  status?: string;
}

interface Option {
  id?: string;
  text: string;
  image?: string;
  isCorrect?: boolean;
}

interface AddEditQuestionModalProps {
  topicId: string;
  chapterId: string;
  question?: Question | null;
  onSave: (data: Partial<Question>) => Promise<void>;
  onClose: () => void;
}

export default function AddEditQuestionModal({
  topicId,
  chapterId,
  question,
  onSave,
  onClose,
}: AddEditQuestionModalProps) {
  const [formData, setFormData] = useState<Partial<Question>>({
    question: question?.question ?? '',
    difficulty: question?.difficulty ?? 'medium',
    marks: question?.marks ?? 1,
    negativeMarks: question?.negativeMarks ?? 0,
    estimatedTime: question?.estimatedTime ?? 60,
    options: question?.options ?? [
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
    ],
    correctOptionIndex: question?.correctOptionIndex ?? 0,
    explanation: question?.explanation ?? '',
    company: question?.company ?? '',
    status: question?.status ?? 'active',
  });

  const [currentTab, setCurrentTab] = useState('details');
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], text };
    setFormData({ ...formData, options: newOptions });
  };

  const handleAddOption = () => {
    if ((formData.options?.length ?? 0) < 6) {
      setFormData({
        ...formData,
        options: [...(formData.options || []), { text: '' }],
      });
    }
  };

  const handleRemoveOption = (index: number) => {
    if ((formData.options?.length ?? 0) > 2) {
      const newOptions = formData.options?.filter((_, i) => i !== index) ?? [];
      let correctIndex = formData.correctOptionIndex ?? 0;
      if (correctIndex >= newOptions.length) {
        correctIndex = Math.max(0, newOptions.length - 1);
      }
      setFormData({
        ...formData,
        options: newOptions,
        correctOptionIndex: correctIndex,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question?.trim()) {
      toast.error('Question is required');
      return;
    }

    if (!formData.options?.some(opt => opt.text.trim())) {
      toast.error('At least one option is required');
      return;
    }

    if (formData.correctOptionIndex === undefined) {
      toast.error('Select correct answer');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {question ? 'Edit Question' : 'Create New Question'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-6 border-b border-gray-200 dark:border-gray-700">
          {['details', 'options', 'explanation', 'preview'].map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-4 py-2 font-medium rounded-t-lg transition ${
                currentTab === tab
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tab: Details */}
          {currentTab === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Question *
                </label>
                <RichTextEditor
                  value={formData.question || ''}
                  onChange={(value) => setFormData({ ...formData, question: value })}
                  placeholder="Enter your question here..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Marks
                  </label>
                  <select
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Negative Marks
                  </label>
                  <select
                    value={formData.negativeMarks}
                    onChange={(e) => setFormData({ ...formData, negativeMarks: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0">0</option>
                    <option value="0.25">0.25</option>
                    <option value="0.5">0.5</option>
                    <option value="1">1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time (sec)
                  </label>
                  <select
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                    <option value="120">120</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., TCS, Infosys, Wipro"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Tab: Options */}
          {currentTab === 'options' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Correct Answer and Enter Options
              </h3>

              <div className="space-y-4">
                {(formData.options || []).map((option, index) => {
                  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                  const isCorrect = formData.correctOptionIndex === index;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition ${
                        isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }`}
                    >
                      <div className="flex gap-4 items-start">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, correctOptionIndex: index })}
                          className={`mt-3 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                            isCorrect
                              ? 'border-green-600 bg-green-600'
                              : 'border-gray-400 hover:border-green-500'
                          }`}
                          title="Select as correct answer"
                        >
                          {isCorrect && <span className="w-2 h-2 bg-white rounded-full" />}
                        </button>

                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Option {letters[index]} *
                          </label>
                          <textarea
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Enter option ${letters[index]}`}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {(formData.options?.length ?? 0) > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="mt-6 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition flex-shrink-0"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {(formData.options?.length ?? 0) < 6 && (
                <Button
                  type="button"
                  onClick={handleAddOption}
                  variant="secondary"
                  rightIcon={<Plus size={16} />}
                >
                  Add Option
                </Button>
              )}
            </div>
          )}

          {/* Tab: Explanation */}
          {currentTab === 'explanation' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Explanation with Steps
                </label>
                <RichTextEditor
                  value={formData.explanation || ''}
                  onChange={(value) => setFormData({ ...formData, explanation: value })}
                  placeholder="Enter step-by-step explanation with formulas, images, etc."
                />
              </div>
            </div>
          )}

          {/* Tab: Preview */}
          {currentTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Question Preview</h3>
                <div
                  className="prose dark:prose-invert max-w-none text-gray-900 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: formData.question || '' }}
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Answer Options</h3>
                <div className="space-y-3">
                  {(formData.options || []).map((option, index) => {
                    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                    const isCorrect = formData.correctOptionIndex === index;
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold ${
                            isCorrect
                              ? 'border-green-600 bg-green-600 text-white'
                              : 'border-gray-400 text-gray-900 dark:text-white'
                          }`}>
                            {letters[index]}
                          </div>
                          <p className="text-gray-900 dark:text-white">{option.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {loading ? 'Saving...' : 'Save Question'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
