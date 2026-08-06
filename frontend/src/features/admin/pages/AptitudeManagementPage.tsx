import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  aptitudeAdminService,
  AptitudeTopic,
  AptitudeSection,
} from '../services/aptitudeAdminService';

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionTab = 'Verbal Ability' | 'Numerical Ability' | 'Logical Reasoning';

const SECTIONS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'Verbal Ability', label: 'Verbal Ability', icon: '🔤' },
  { key: 'Numerical Ability', label: 'Numerical Ability', icon: '🔢' },
  { key: 'Logical Reasoning', label: 'Logical Reasoning', icon: '🧠' },
];

const STORAGE_KEY = 'aptitude-active-section';

function getSavedSection(): SectionTab {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (saved === 'Verbal Ability' || saved === 'Numerical Ability' || saved === 'Logical Reasoning') {
    return saved;
  }
  return 'Verbal Ability';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AptitudeManagementPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<AptitudeTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionTab>(getSavedSection);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<AptitudeTopic | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  // Persist section selection so it survives navigation
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, activeSection);
  }, [activeSection]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const result = await aptitudeAdminService.getTopics({ limit: 200 });
      setTopics(result.topics);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (data: any) => {
    try {
      await aptitudeAdminService.createTopic(data);
      toast.success('Topic created successfully!');
      setShowTopicModal(false);
      fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create topic');
    }
  };

  const handleUpdateTopic = async (data: any) => {
    if (!editingTopic?.id) return;
    try {
      await aptitudeAdminService.updateTopic(editingTopic.id, data);
      toast.success('Topic updated successfully!');
      setShowTopicModal(false);
      setEditingTopic(null);
      fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update topic');
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic? All chapters and questions will be removed.')) return;
    try {
      await aptitudeAdminService.deleteTopic(topicId);
      toast.success('Topic deleted!');
      fetchTopics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete topic');
    }
  };

  // Filter topics by active section
  const filteredTopics = topics.filter((t) => t.section === activeSection);

  // Count topics per section
  const sectionCounts = SECTIONS.map((s) => ({
    ...s,
    count: topics.filter((t) => t.section === s.key).length,
  }));

  const totalQuestions = topics.reduce((sum, t) => sum + (t.questionCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Aptitude Management
              </h1>
              <p className="text-emerald-100 text-sm mt-1">
                Manage Sections, Topics and Aptitude Questions — Total: {topics.length} topics · {totalQuestions} questions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingTopic(null);
                  setShowTopicModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl hover:bg-green-50 transition font-semibold text-sm shadow-lg"
              >
                <Plus size={18} />
                Add Topic
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2">
          {sectionCounts.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeSection === section.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeSection === section.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {section.count}
              </span>
            </button>
          ))}
        </div>

        {/* Topics List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-gray-400 text-sm mt-3">Loading topics...</p>
          </div>
        ) : filteredTopics.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 py-16 px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 mb-4">
              <BookOpen size={28} className="text-emerald-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-base mb-6">
              📚 No topics available in this section.
            </p>
            <button
              onClick={() => {
                setEditingTopic(null);
                setShowTopicModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold text-sm shadow-lg"
            >
              <Plus size={18} />
              Add Topic
            </button>
          </div>
        ) : (
          /* Topics List - Vertical Stack */
          <div className="grid grid-cols-1 gap-4">
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClickTopic={() => navigate(`/admin/aptitude/topics/${topic.id}/practice`)}
                onAddQuestion={() => navigate(`/admin/aptitude/topics/${topic.id}/questions`)}
                onEdit={() => {
                  setEditingTopic(topic);
                  setShowTopicModal(true);
                }}
                onDelete={() => topic.id && handleDeleteTopic(topic.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Topic Modal */}
      {showTopicModal && (
        <TopicFormModal
          topic={editingTopic}
          defaultSection={activeSection}
          onSave={editingTopic ? handleUpdateTopic : handleCreateTopic}
          onClose={() => {
            setShowTopicModal(false);
            setEditingTopic(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Topic Card ───────────────────────────────────────────────────────────────

interface TopicCardProps {
  topic: AptitudeTopic;
  onClickTopic: () => void;
  onAddQuestion: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function TopicCard({ topic, onClickTopic, onAddQuestion, onEdit, onDelete }: TopicCardProps) {
  const questionCount = topic.questionCount || 0;
  const chapterCount = topic.chapters?.length || 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon + Name + Stats (clickable) */}
        <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={onClickTopic}>
          <span className="text-2xl flex-shrink-0">{topic.icon || '📚'}</span>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-emerald-600 transition truncate">
              {topic.name}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium">
                {chapterCount} chapters
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-medium">
                {questionCount} questions
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons + Status */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onAddQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-medium transition"
          >
            <Plus size={13} />
            Add Question
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 text-xs font-medium transition"
          >
            <Edit size={13} />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-medium transition"
          >
            <Trash2 size={13} />
            Delete
          </button>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ml-2 ${
              topic.isActive !== false
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}
          >
            {topic.isActive !== false ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Topic Form Modal ─────────────────────────────────────────────────────────

interface TopicFormModalProps {
  topic?: AptitudeTopic | null;
  defaultSection?: SectionTab;
  onSave: (data: any) => void;
  onClose: () => void;
}

function TopicFormModal({ topic, defaultSection = 'Numerical Ability', onSave, onClose }: TopicFormModalProps) {
  const [form, setForm] = useState({
    name: '',
    section: defaultSection as AptitudeSection,
    description: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (topic) {
      setForm({
        name: topic.name || '',
        section: (topic.section as AptitudeSection) || defaultSection,
        description: topic.description || '',
        isActive: topic.isActive !== false,
      });
    } else {
      setForm((prev) => ({ ...prev, section: defaultSection }));
    }
  }, [topic, defaultSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Topic name is required');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {topic ? 'Edit Topic' : 'Add Topic'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Topic Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Topic Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Percentage, Blood Relations"
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Section <span className="text-red-500">*</span>
            </label>
            <select
              value={form.section}
              onChange={(e) => setForm((p) => ({ ...p, section: e.target.value as AptitudeSection }))}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            >
              <option value="Verbal Ability">🔤 Verbal Ability</option>
              <option value="Numerical Ability">🔢 Numerical Ability</option>
              <option value="Logical Reasoning">🧠 Logical Reasoning</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Brief description of this topic"
              rows={3}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Status
            </label>
            <div className="flex gap-3">
              <label
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition text-sm font-medium ${
                  form.isActive
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  checked={form.isActive}
                  onChange={() => setForm((p) => ({ ...p, isActive: true }))}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Active
              </label>
              <label
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition text-sm font-medium ${
                  !form.isActive
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  checked={!form.isActive}
                  onChange={() => setForm((p) => ({ ...p, isActive: false }))}
                  className="sr-only"
                />
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Inactive
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.name.trim()}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
