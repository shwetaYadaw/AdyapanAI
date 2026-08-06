import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Brain, BookOpen, ChevronRight, Search } from 'lucide-react';
import { api } from '../../core/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionTab = 'Verbal Ability' | 'Numerical Ability' | 'Logical Reasoning';

interface Topic {
  id: string;
  name: string;
  section: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  chapters?: { id: string; name: string; order: number }[];
}

const SECTIONS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'Verbal Ability', label: 'Verbal Ability', icon: '🔤' },
  { key: 'Numerical Ability', label: 'Numerical Ability', icon: '🔢' },
  { key: 'Logical Reasoning', label: 'Logical Reasoning', icon: '🧠' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AptitudePrepPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionTab>('Verbal Ability');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all topics from the student-facing API
  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ['student-aptitude-topics'],
    queryFn: async () => {
      const { data } = await api.get('/aptitude/topics');
      return data.data ?? [];
    },
  });

  // Filter by section and search
  const filteredTopics = topics
    .filter((t) => t.section === activeSection)
    .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Count per section
  const sectionCounts = SECTIONS.map((s) => ({
    ...s,
    count: topics.filter((t) => t.section === s.key).length,
  }));

  const totalQuestions = topics.reduce(
    (sum, t) => sum + (t.chapters?.reduce((cs, c) => cs + 0, 0) ?? 0),
    0
  );

  return (
    <div className="page-wrapper space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
          <Brain className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <h1 className="font-black text-3xl sm:text-4xl tracking-tight leading-tight">
            Aptitude Preparation
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Master quantitative ability, logical reasoning, and verbal skills to ace top MNC placement assessments.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-white/70 pt-2 border-t border-white/20">
            <span>📚 {topics.length} Topics</span>
            <span>📖 {topics.reduce((sum, t) => sum + (t.chapters?.length ?? 0), 0)} Chapters</span>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {sectionCounts.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeSection === section.key
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-950/30'
            }`}
          >
            <span>{section.icon}</span>
            <span>{section.label}</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeSection === section.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {section.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
      </div>

      {/* Topics List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-400 text-sm mt-3">Loading topics...</p>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 py-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No topics available in this section.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => navigate(`/student/aptitude/topic/${topic.id}/practice`)}
              className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 transition-all hover:shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{topic.icon || '📚'}</span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {topic.name}
                    </h3>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{topic.chapters?.length ?? 0} chapters</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-green-500 transition" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
