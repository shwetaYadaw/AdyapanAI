import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { AptitudeQuestion, AptitudeOption } from '../../services/aptitudeAdminService';

interface AptitudeQuestionFormProps {
  question?: AptitudeQuestion | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function AptitudeQuestionForm({ question, onSave, onClose }: AptitudeQuestionFormProps) {
  const [formData, setFormData] = useState({
    statement: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    explanation: '',
    xpReward: 10,
    companies: '',
    timeLimit: 60,
    options: [
      { optionKey: 'A', text: '', isCorrect: false },
      { optionKey: 'B', text: '', isCorrect: false },
      { optionKey: 'C', text: '', isCorrect: true },
      { optionKey: 'D', text: '', isCorrect: false },
    ] as AptitudeOption[],
  });

  useEffect(() => {
    if (question) {
      setFormData({
        statement: question.statement || '',
        difficulty: question.difficulty as any,
        explanation: question.explanation || '',
        xpReward: question.xpReward || 10,
        companies: question.companies || '',
        timeLimit: question.timeLimit || 60,
        options: question.options || [
          { optionKey: 'A', text: '', isCorrect: false },
          { optionKey: 'B', text: '', isCorrect: false },
          { optionKey: 'C', text: '', isCorrect: true },
          { optionKey: 'D', text: '', isCorrect: false },
        ],
      });
    }
  }, [question]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['xpReward', 'timeLimit'].includes(name) ? parseInt(value) : value,
    }));
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect') {
      // Only one option can be correct
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      (newOptions[index] as any)[field] = value;
    }
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.statement.trim()) {
      alert('Question statement is required');
      return;
    }

    if (!formData.options.every((opt) => opt.text.trim())) {
      alert('All options must have text');
      return;
    }

    if (!formData.options.some((opt) => opt.isCorrect)) {
      alert('At least one option must be marked as correct');
      return;
    }

    onSave(formData);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];
  const correctOption = formData.options.find((opt) => opt.isCorrect);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {question ? 'Edit Question' : 'Create Question'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question Statement *
            </label>
            <textarea
              name="statement"
              value={formData.statement}
              onChange={handleChange}
              placeholder="Enter the question text"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Difficulty & Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                XP Reward
              </label>
              <input
                type="number"
                name="xpReward"
                value={formData.xpReward}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Time Limit & Companies */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                min="10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Companies (comma separated)
              </label>
              <input
                type="text"
                name="companies"
                value={formData.companies}
                onChange={handleChange}
                placeholder="e.g., TCS,Infosys,Wipro"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* MCQ Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              MCQ Options * (Select correct answer)
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={option.optionKey} className="flex gap-3 items-start">
                  {/* Option Letter Badge */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">
                    {option.optionKey}
                  </div>

                  {/* Option Text Input */}
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    placeholder={`Enter option ${option.optionKey}`}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  {/* Correct Answer Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={option.isCorrect}
                      onChange={() => handleOptionChange(index, 'isCorrect', true)}
                      className="w-4 h-4 text-green-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Correct</span>
                  </label>
                </div>
              ))}
            </div>
            {correctOption && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">
                  ✓ Correct answer: <span className="font-semibold">{correctOption.optionKey}</span>
                </p>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Explanation
            </label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              placeholder="Explain the solution and correct answer"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {question ? 'Update Question' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
