import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AptitudeTopic, AptitudeSection } from '../../services/aptitudeAdminService';

const SECTIONS: AptitudeSection[] = ['Verbal Ability', 'Numerical Ability', 'Logical Reasoning'];
const EMOJIS = ['📚', '🔢', '🧠', '📖', '✍️', '🎯', '🏆', '💡', '📊', '🔍', '📐', '🔤', '🔬', '🎲', '📈'];

interface Props {
  topic?: AptitudeTopic | null;
  defaultSection?: AptitudeSection;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function AptitudeTopicModal({ topic, defaultSection = 'Numerical Ability', onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name: '',
    section: defaultSection as AptitudeSection,
    description: '',
    icon: '📚',
    order: 0,
  });

  useEffect(() => {
    if (topic) {
      setForm({
        name: topic.name || '',
        section: (topic.section as AptitudeSection) || defaultSection,
        description: topic.description || '',
        icon: topic.icon || '📚',
        order: topic.order || 0,
      });
    } else {
      setForm((prev) => ({ ...prev, section: defaultSection }));
    }
  }, [topic, defaultSection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { alert('Topic name is required'); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {topic ? 'Edit Topic' : 'Create Topic'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, icon: emoji }))}
                  className={`text-xl p-2 rounded-xl transition ${form.icon === emoji ? 'bg-orange-500 ring-2 ring-orange-400 scale-110' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Section *</label>
            <select
              value={form.section}
              onChange={(e) => setForm((p) => ({ ...p, section: e.target.value as AptitudeSection }))}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Topic Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Percentage"
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Brief description of this topic"
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium text-sm transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-sm transition">
              {topic ? 'Save Changes' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
