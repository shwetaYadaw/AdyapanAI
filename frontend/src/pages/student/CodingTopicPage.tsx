import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Code2, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../core/services/api';
import Badge from '../../shared/components/Badge/Badge';
import Table from '../../shared/components/Table/Table';

interface Question {
  _id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  companies: string[];
  xpReward: number;
}

interface Topic {
  id: string;
  name: string;
  description?: string;
  order: number;
}

// Helper to convert topic name to key format
const topicNameToKey = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[&/]/g, '').replace('queue-deque', 'queue-deque');
};

export default function CodingTopicPage() {
  const { topicKey } = useParams<{ topicKey: string }>();
  const [search, setSearch] = useState('');

  // Fetch all topics dynamically
  const { data: allTopics } = useQuery<Topic[]>({
    queryKey: ['codingTopics'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/topics', {
          params: { system: 'coding-arena' }
        });
        return data.data ?? [];
      } catch (error) {
        console.error('Failed to fetch topics:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Find the current topic by matching the key
  const currentTopic = allTopics?.find(t => topicNameToKey(t.name) === topicKey);
  
  // Build group object for display
  const group = currentTopic ? {
    title: currentTopic.name,
    key: topicKey!,
    description: currentTopic.description || `${currentTopic.name} problems for top MNC companies`
  } : null;

  const { data: questions, isLoading, isError } = useQuery<Question[]>({
    queryKey: ['codingArenaProblems', topicKey, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (topicKey) params.set('topic', topicKey);
      params.set('limit', '200');
      const { data } = await api.get(`/problems?${params}`);
      return (data.data ?? []).map((q: any) => ({
        ...q,
        _id: q._id ?? q.id,
        topics: Array.isArray(q.topics) ? q.topics
          : (typeof q.topics === 'string' ? q.topics.split(',').map((t: string) => t.trim()) : []),
        companies: Array.isArray(q.companies) ? q.companies
          : (typeof q.companies === 'string' ? q.companies.split(',').map((c: string) => c.trim()) : []),
      }));
    },
  });

  const topicQuestions = (questions ?? []).filter((q) =>
    q.topics.some((t: string) => {
      const tKey = t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return tKey === topicKey || t.toLowerCase() === topicKey;
    })
  );

  const columns = [
    {
      key: 'title',
      header: 'Problem Name',
      render: (r: Question) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            <Link to={`/student/challenges/${r.slug}`} className="hover:text-primary-600 transition-colors">
              {r.title}
            </Link>
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {r.topics.slice(0, 3).map((t: string) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 capitalize">
                {t}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (r: Question) => {
        const colors: Record<string, string> = { easy: 'success', medium: 'warning', hard: 'danger' };
        return <Badge variant={colors[r.difficulty] as any} className="capitalize">{r.difficulty}</Badge>;
      },
    },
    {
      key: 'companies',
      header: 'Target Companies',
      render: (r: Question) => (
        <div className="flex flex-wrap gap-1">
          {r.companies.slice(0, 3).map((c: string) => (
            <span key={c} className="text-xs px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 capitalize font-medium">
              {c}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'xp',
      header: 'XP',
      render: (r: Question) => (
        <span className="text-sm font-semibold text-amber-500">+{r.xpReward} XP</span>
      ),
    },
    {
      key: 'action',
      header: '',
      render: (r: Question) => (
        <Link to={`/student/challenges/${r.slug}`}>
          <button className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 dark:bg-primary-950/40 px-3 py-1.5 rounded-xl transition-all">
            Solve <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      ),
    },
  ];

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Code2 className="w-12 h-12 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 font-medium">Topic not found.</p>
        <Link to="/student/challenges" className="text-primary-600 text-sm underline">
          ← Back to Coding Arena
        </Link>
      </div>
    );
  }

  return (
    /* Escape the DashboardLayout's padding by using negative margins */
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">

      {/* Hero — full width, flush to top */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-500 px-6 sm:px-10 pt-8 pb-10 text-white">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-8 -translate-y-8 scale-150">
          <Code2 className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-4xl">
          {/* Back link inside hero */}
          <Link
            to="/student/challenges"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Coding Arena
          </Link>
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
            ADYAPAN Coding Arena
          </p>
          <h1 className="font-display font-black text-3xl sm:text-4xl mb-2">{group.title}</h1>
          <p className="text-white/80 text-sm max-w-2xl mb-4">{group.description}</p>
          <Badge variant="primary" className="bg-white/20 text-white border-white/30 text-xs">
            {isLoading ? '...' : topicQuestions.length} Problems
          </Badge>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 px-6 sm:px-10 py-6 space-y-4">

        {/* Search */}
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 shadow-sm max-w-xl">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${group.title} problems...`}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
          />
        </div>

        {/* Error / empty states */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Unable to load problems. Please make sure the backend is running.
          </div>
        )}
        {!isError && !isLoading && topicQuestions.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
            No problems found for this topic yet. Check back soon!
          </div>
        )}

        {/* Table */}
        {!isError && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <Table
              columns={columns}
              data={topicQuestions}
              keyExtractor={(r: Question) => r._id}
              loading={isLoading}
              emptyMessage="No problems in this topic yet."
            />
          </div>
        )}

      </div>
    </div>
  );
}
