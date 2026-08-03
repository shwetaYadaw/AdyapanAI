import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Code2, Search, Filter, ChevronLeft, ChevronRight,
  Trash2, Edit2, Plus, RefreshCw, BookOpen, Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Problem {
  id: string; title: string; slug: string; difficulty: string;
  topics: string; companies: string; timeLimit: number;
  memoryLimit: number; createdAt: string;
  _count?: { testCases: number };
}

interface Question {
  id: string; title: string; slug: string; difficulty: string;
  topics: string[] | string; companies: string[] | string;
  timeLimit: number; memoryLimit: number; xpReward: number;
  createdAt: string;
}

interface Pagination {
  total: number; page: number; limit: number; pages: number;
}

type Tab = 'problems' | 'questions';
type Difficulty = '' | 'easy' | 'medium' | 'hard';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LIMIT = 50;

function difficultyBadge(d: string) {
  const map: Record<string, string> = {
    easy:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    medium: 'bg-amber-100   text-amber-700   dark:bg-amber-900/40   dark:text-amber-400',
    hard:   'bg-red-100     text-red-700     dark:bg-red-900/40     dark:text-red-400',
  };
  return map[d?.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
}

function topicList(topics: string | string[]): string[] {
  if (!topics) return [];
  if (Array.isArray(topics)) return topics.slice(0, 4);
  return topics.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 4);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProblemRow({
  item, onDelete,
}: {
  item: Problem | Question;
  onDelete: (id: string, title: string) => void;
}) {
  const topics = topicList((item as any).topics);
  const testCount = (item as Problem)._count?.testCases;

  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
      <div className="flex-1 min-w-0 space-y-1">
        {/* Title + difficulty */}
        <div className="flex items-center gap-3 flex-wrap">
          <Code2 className="w-4 h-4 text-primary-500 shrink-0" />
          <span className="font-semibold text-gray-900 dark:text-white truncate max-w-md">
            {item.title}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${difficultyBadge(item.difficulty)}`}>
            {item.difficulty}
          </span>
          {testCount !== undefined && (
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
              {testCount} tests
            </span>
          )}
          {(item as Question).xpReward && (
            <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs">
              +{(item as Question).xpReward} XP
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span><span className="font-medium">Slug:</span> {item.slug}</span>
          {item.timeLimit > 0   && <span><span className="font-medium">Time:</span> {item.timeLimit}ms</span>}
          {item.memoryLimit > 0 && <span><span className="font-medium">Memory:</span> {item.memoryLimit}MB</span>}
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onDelete(item.id, item.title)}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Pagination bar ──────────────────────────────────────────────────────────

function PaginationBar({
  pagination, page, onPage,
}: { pagination: Pagination; page: number; onPage: (p: number) => void }) {
  const { total, pages } = pagination;
  const start = (page - 1) * LIMIT + 1;
  const end   = Math.min(page * LIMIT, total);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{start}–{end}</span> of{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-300">{total}</span> results
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="p-1.5 rounded-lg disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {/* page numbers: show at most 7 */}
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
          let p = i + 1;
          if (pages > 7) {
            if (page <= 4)        p = i + 1;
            else if (page >= pages - 3) p = pages - 6 + i;
            else                  p = page - 3 + i;
          }
          return (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`w-7 h-7 text-xs rounded-lg transition-colors ${
                p === page
                  ? 'bg-primary-600 text-white font-semibold'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="p-1.5 rounded-lg disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminProblemsPage() {
  const qc = useQueryClient();

  // shared filter state
  const [tab,        setTab]        = useState<Tab>('problems');
  const [search,     setSearch]     = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('');
  const [page,       setPage]       = useState(1);

  // debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // reset to page 1 on any filter / tab change
  useEffect(() => { setPage(1); }, [tab, debouncedSearch, difficulty]);

  // ── Problems query ────────────────────────────────────────────────────────
  const problemsQuery = useQuery({
    queryKey: ['adminProblems', debouncedSearch, difficulty, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(LIMIT),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(difficulty       && { difficulty }),
      });
      const { data } = await api.get(`/problems?${params}`);
      return { items: (data.data ?? []) as Problem[], pagination: data.pagination as Pagination };
    },
    enabled: tab === 'problems',
    staleTime: 30_000,
  });

  // ── Questions query ───────────────────────────────────────────────────────
  const questionsQuery = useQuery({
    queryKey: ['adminQuestions', debouncedSearch, difficulty, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(LIMIT),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(difficulty       && { difficulty }),
      });
      const { data } = await api.get(`/challenges/questions?${params}`);
      return { items: (data.data ?? []) as Question[], pagination: data.pagination as Pagination };
    },
    enabled: tab === 'questions',
    staleTime: 30_000,
  });

  const active     = tab === 'problems' ? problemsQuery : questionsQuery;
  const items      = active.data?.items      ?? [];
  const pagination = active.data?.pagination ?? null;
  const isLoading  = active.isLoading;

  // ── Delete handlers ───────────────────────────────────────────────────────
  const handleDeleteProblem = useCallback(async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This also removes all submissions.`)) return;
    try {
      await api.delete(`/problems/${id}`);
      toast.success('Problem deleted');
      qc.invalidateQueries({ queryKey: ['adminProblems'] });
    } catch { toast.error('Failed to delete problem'); }
  }, [qc]);

  const handleDeleteQuestion = useCallback(async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/challenges/questions/${id}`);
      toast.success('Question deleted');
      qc.invalidateQueries({ queryKey: ['adminQuestions'] });
    } catch { toast.error('Failed to delete question'); }
  }, [qc]);

  const handleDelete = tab === 'problems' ? handleDeleteProblem : handleDeleteQuestion;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            Manage Problems
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            View and manage all DSA coding problems in the database
          </p>
        </div>
        <button
          onClick={() => active.refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {([
          { key: 'problems',  label: 'Coding Arena',  icon: Code2,     count: problemsQuery.data?.pagination?.total },
          { key: 'questions', label: 'Challenges / TCS NQT', icon: BookOpen, count: questionsQuery.data?.pagination?.total },
        ] as const).map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                tab === key ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search title, slug, topic…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Difficulty */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="pl-9 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
          >
            <option value="">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Stats summary */}
        {pagination && (
          <div className="flex items-center gap-2 ml-auto">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-200">{pagination.total}</span> total
            </span>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

        {/* Column header */}
        <div className="flex items-center gap-4 px-5 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <span className="flex-1">Problem</span>
          <span className="w-16 text-right">Actions</span>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-14" />
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-48 ml-7" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <Code2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No problems found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          items.map((item) => (
            <ProblemRow key={item.id} item={item} onDelete={handleDelete} />
          ))
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <PaginationBar pagination={pagination} page={page} onPage={setPage} />
        )}
      </div>

    </div>
  );
}
