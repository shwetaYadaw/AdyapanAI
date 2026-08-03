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

const TOPIC_GROUPS = [
  { title: '1. Arrays', key: 'arrays', description: "Kadane's, Two Pointer, Sliding Window, Prefix Sum, and other Array essentials." },
  { title: '2. Strings', key: 'strings', description: 'Anagrams, Palindromes, Group Anagrams, and other String algorithms.' },
  { title: '3. 2D Arrays', key: '2d-arrays', description: 'Matrix operations, Zigzag traversals, Set zeroes, Spiral and Rotate matrix.' },
  { title: '4. Hashing', key: 'hashing', description: 'Hashing concepts, Two Sum, Top K elements, Majority Element, Consecutive sequences.' },
  { title: '5. Two Pointers', key: 'two-pointers', description: 'Sorted array operations, 3Sum, Container with most water, and Trapping water.' },
  { title: '6. Sliding Window', key: 'sliding-window', description: 'Maximum sum subarray, character replacement, permutation matching.' },
  { title: '7. Binary Search', key: 'binary-search', description: 'Rotated arrays search, insert positions, peak elements, and search bounds.' },
  { title: '8. Searching & Sorting', key: 'searching-sorting', description: 'Counting sort, merge sorted arrays, inversion counts, aggressive cows, and page allocation.' },
  { title: '9. Linked List', key: 'linked-list', description: 'Reversing lists, cycle detection, middle node, LRU Cache.' },
  { title: '10. Stack', key: 'stack', description: 'Valid Parentheses, Min Stack, Next Greater Element, and Histogram problems.' },
  { title: '11. Queue & Deque', key: 'queue-deque', description: 'Queues using stacks, circular queues, sliding window maximums, and rotten oranges.' },
  { title: '12. Recursion & Backtracking', key: 'recursion-backtracking', description: 'Generate Parentheses, subsets, permutations, combination sums, N-Queens.' },
  { title: '13. Trees', key: 'trees', description: 'Binary trees depth, LCA, level order traversals, inversion, serialization.' },
  { title: '14. Binary Search Tree', key: 'binary-search-tree', description: 'BST validation, Lowest Common Ancestor, recovering BST, BST Iterator.' },
  { title: '15. Heap / Priority Queue', key: 'heap-priority-queue', description: 'Kth largest element, top K frequent, merging K sorted lists, median streaming.' },
  { title: '16. Graphs', key: 'graphs', description: 'Number of islands, course scheduling, clone graph, network delay time.' },
  { title: '17. DFS/BFS', key: 'dfs-bfs', description: 'Flood fill, provinces count, surrounded regions, shortest paths in binary matrices.' },
  { title: '18. Dynamic Programming', key: 'dynamic-programming', description: 'Climbing Stairs, House Robber, Coin Change, LIS, LCS, Edit Distance.' },
  { title: '19. Greedy', key: 'greedy', description: 'Jump Game I & II, Gas Station, Cookies assignment, Non-overlapping intervals.' },
  { title: '20. Bit Manipulation', key: 'bit-manipulation', description: 'Single Number, counting bits, missing number, power of two checks.' },
  { title: '21. Trie', key: 'trie', description: 'Implement Trie, replace words, map sum pairs, maximum XOR of two numbers.' },
  { title: '22. Segment Tree / Fenwick Tree', key: 'segment-tree-fenwick', description: 'Range sum queries, mutable range queries, lazy propagation.' },
];

export default function CodingTopicPage() {
  const { topicKey } = useParams<{ topicKey: string }>();
  const [search, setSearch] = useState('');

  const group = TOPIC_GROUPS.find((g) => g.key === topicKey);

  const { data: questions, isLoading, isError } = useQuery<Question[]>({
    queryKey: ['codingArenaProblems', search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      // Removed onlyUpdated filter to show all problems
      // Use /problems endpoint for Coding Arena (Problem table)
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
    q.topics.some((t: string) => t.toLowerCase() === topicKey)
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
