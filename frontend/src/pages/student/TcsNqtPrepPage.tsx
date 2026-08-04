import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, BookOpen, ChevronRight, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import Card from '../../shared/components/Card/Card';
import Badge from '../../shared/components/Badge/Badge';
import Button from '../../shared/components/Button/Button';
import { api } from '../../core/services/api';

interface TCSQuestion {
  id?: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics?: string[];
}

export default function PlacementPrepPage() {
  type TabKey = 'arrays' | 'strings' | 'sorting' | 'hashing' | 'linked-list' | 'recursion' | 'numbers' | 'number-system';
  const [activeTab, setActiveTab] = useState<TabKey>('arrays');
  const [search, setSearch]       = useState('');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const { data: storedQuestions = [], isLoading, isError } = useQuery<TCSQuestion[]>({
    queryKey: ['placementPrepQuestions'],
    queryFn: async () => {
      const { data } = await api.get('/tcs-nqt?limit=500');
      return (data.data ?? []).map((q: any) => ({
        ...q,
        id: q.id ?? q._id,
        // topic is a single string — normalise to lowercase array
        topics: [String(q.topic ?? '').toLowerCase()].filter(Boolean),
      }));
    },
  });

  // topic key → db topic slug(s)
  const TAB_TOPICS: Record<TabKey, string[]> = {
    'arrays':         ['arrays'],
    'strings':        ['strings'],
    'sorting':        ['sorting'],
    'hashing':        ['hashing'],
    'linked-list':    ['linked-list'],
    'recursion':      ['recursion-backtracking'],
    'numbers':        ['numbers'],
    'number-system':  ['number-system'],
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'arrays',        label: 'Arrays' },
    { key: 'strings',       label: 'Strings' },
    { key: 'sorting',       label: 'Searching & Sorting' },
    { key: 'hashing',       label: 'Hashing' },
    { key: 'linked-list',   label: 'Linked List' },
    { key: 'recursion',     label: 'Recursion & Backtracking' },
    { key: 'numbers',       label: 'Numbers' },
    { key: 'number-system', label: 'Number System' },
  ];

  // per-tab counts (unfiltered by search/difficulty)
  const tabCounts = Object.fromEntries(
    TABS.map(t => [t.key, storedQuestions.filter(q =>
      TAB_TOPICS[t.key].some(k => q.topics?.includes(k))
    ).length])
  ) as Record<TabKey, number>;

  // questions for current tab + filters
  const filtered = storedQuestions
    .filter(q => TAB_TOPICS[activeTab].some(k => q.topics?.includes(k)))
    .filter(q => difficulty === 'all' || q.difficulty?.toLowerCase() === difficulty)
    .filter(q => !search || q.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      ({ easy: 1, medium: 2, hard: 3 }[a.difficulty?.toLowerCase() ?? 'medium'] ?? 2) -
      ({ easy: 1, medium: 2, hard: 3 }[b.difficulty?.toLowerCase() ?? 'medium'] ?? 2)
    );

  return (
    <div className="page-wrapper space-y-5">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
          <Code className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Placement Prep Track
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight">
            Placement Prep Questions
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Master the top coding challenges frequently asked in placement assessments by TCS, Infosys, Wipro, Accenture and more.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-white/70 pt-2 border-t border-white/20">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-white" /> {storedQuestions.length} Problems</span>
            <span className="flex items-center gap-1.5"><Code className="w-4 h-4 text-white" /> Multilanguage Editor</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-white" /> Company Specific Test Cases</span>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-max min-w-full">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(''); setDifficulty('all'); }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-60">
                ({isLoading ? '…' : tabCounts[tab.key]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search + Difficulty filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400"
          />
        </div>

        {/* Difficulty select */}
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value as any)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 cursor-pointer"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Result count */}
        {!isLoading && (
          <div className="flex items-center px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 text-sm font-semibold text-orange-700 dark:text-orange-400 whitespace-nowrap">
            {filtered.length} / {tabCounts[activeTab]} shown
          </div>
        )}
      </div>

      {/* Error / empty states */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          Unable to load questions. Make sure the backend is running on port 5000.
        </div>
      )}
      {!isError && !isLoading && filtered.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          {search || difficulty !== 'all'
            ? 'No questions match your filters. Try adjusting the search or difficulty.'
            : 'No questions found for this category yet.'}
        </div>
      )}

      {/* Question grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((q, idx) => (
          <motion.div
            key={q.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(idx * 0.015, 0.3) }}
          >
            <Card padding="md" className="hover:border-orange-400/40 transition-all group flex flex-col justify-between h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold font-mono text-orange-500/80">Q{idx + 1}.</span>
                  <Badge
                    variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'danger'}
                    className="capitalize"
                  >
                    {q.difficulty}
                  </Badge>
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors text-sm sm:text-base pr-4">
                  {q.title}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                <Link to={`/student/tcs-nqt/${q.slug}`}>
                  <Button size="sm" variant="primary" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Solve
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
