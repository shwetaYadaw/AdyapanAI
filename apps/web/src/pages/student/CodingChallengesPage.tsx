import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Trophy, Code2, Flame, BrainCircuit, Target, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../services/api';
import Navbar from '../../components/layout/Navbar/Navbar';
import Badge from '../../components/common/Badge/Badge';
import Card from '../../components/common/Card/Card';
import Table from '../../components/common/Table/Table';

interface Question {
  _id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  companies: string[];
  xpReward: number;
}

interface LeaderboardUser {
  userId: { _id: string; firstName: string; lastName: string; avatar?: string };
  totalXP: number;
}

const TOPIC_GROUPS = [
  { title: '1. Arrays', key: 'arrays', description: 'Kadane\'s, Two Pointer, Sliding Window, Prefix Sum, and other Array essentials.', totalCount: 7 },
  { title: '2. Strings', key: 'strings', description: 'Anagrams, Palindromes, Group Anagrams, and other String algorithms.', totalCount: 7 },
  { title: '3. 2D Arrays', key: '2d-arrays', description: 'Matrix operations, Zigzag traversals, Set zeroes, Spiral and Rotate matrix.', totalCount: 7 },
  { title: '4. Hashing', key: 'hashing', description: 'Hashing concepts, Two Sum, Top K elements, Majority Element, Consecutive sequences.', totalCount: 7 },
  { title: '5. Two Pointers', key: 'two-pointers', description: 'Sorted array operations, 3Sum, Container with most water, and Trapping water.', totalCount: 7 },
  { title: '6. Sliding Window', key: 'sliding-window', description: 'Maximum sum subarray, character replacement, permutation matching.', totalCount: 7 },
  { title: '7. Binary Search', key: 'binary-search', description: 'Rotated arrays search, insert positions, peak elements, and search bounds.', totalCount: 7 },
  { title: '8. Searching & Sorting', key: 'searching-sorting', description: 'Counting sort, merge sorted arrays, inversion counts, aggressive cows, and page allocation.', totalCount: 7 },
  { title: '9. Linked List', key: 'linked-list', description: 'Reversing lists, cycle detection, middle node, LRU Cache.', totalCount: 7 },
  { title: '10. Stack', key: 'stack', description: 'Valid Parentheses, Min Stack, Next Greater Element, and Histogram problems.', totalCount: 7 },
  { title: '11. Queue & Deque', key: 'queue-deque', description: 'Queues using stacks, circular queues, sliding window maximums, and rotten oranges.', totalCount: 7 },
  { title: '12. Recursion & Backtracking', key: 'recursion-backtracking', description: 'Generate Parentheses, subsets, permutations, combination sums, N-Queens.', totalCount: 7 },
  { title: '13. Trees', key: 'trees', description: 'Binary trees depth, LCA, level order traversals, inversion, serialization.', totalCount: 7 },
  { title: '14. Binary Search Tree', key: 'binary-search-tree', description: 'BST validation, Lowest Common Ancestor, recovering BST, BST Iterator.', totalCount: 7 },
  { title: '15. Heap / Priority Queue', key: 'heap-priority-queue', description: 'Kth largest element, top K frequent, merging K sorted lists, median streaming.', totalCount: 7 },
  { title: '16. Graphs', key: 'graphs', description: 'Number of islands, course scheduling, clone graph, network delay time.', totalCount: 7 },
  { title: '17. DFS/BFS', key: 'dfs-bfs', description: 'Flood fill, provinces count, surrounded regions, shortest paths in binary matrices.', totalCount: 7 },
  { title: '18. Dynamic Programming', key: 'dynamic-programming', description: 'Climbing Stairs, House Robber, Coin Change, LIS, LCS, Edit Distance.', totalCount: 7 },
  { title: '19. Greedy', key: 'greedy', description: 'Jump Game I & II, Gas Station, Cookies assignment, Non-overlapping intervals.', totalCount: 7 },
  { title: '20. Bit Manipulation', key: 'bit-manipulation', description: 'Single Number, counting bits, missing number, power of two checks.', totalCount: 7 },
  { title: '21. Trie', key: 'trie', description: 'Implement Trie, replace words, map sum pairs, maximum XOR of two numbers.', totalCount: 7 },
  { title: '22. Segment Tree / Fenwick Tree', key: 'segment-tree-fenwick', description: 'Range sum queries, mutable range queries, lazy propagation.', totalCount: 7 }
];

export default function CodingChallengesPage() {
  const [search, setSearch] = useState('');
  const [expandedTopic, setExpandedTopic] = useState<string | null>('arrays');

  // Fetch coding questions
  const { data: questions, isLoading, isError } = useQuery<Question[]>({
    queryKey: ['codingQuestions', search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const { data } = await api.get(`/challenges/questions?${params}`);
      // Normalize Prisma/MySQL response: map `id` -> `_id`, parse JSON string fields
      return (data.data ?? []).map((q: any) => ({
        ...q,
        _id: q._id ?? q.id,
        topics: Array.isArray(q.topics) ? q.topics : (typeof q.topics === 'string' ? JSON.parse(q.topics) : []),
        companies: Array.isArray(q.companies) ? q.companies : (typeof q.companies === 'string' ? JSON.parse(q.companies) : []),
      }));
    },
  });

  // Fetch leaderboard
  const { data: leaderboard, isLoading: loadingLeaderboard } = useQuery<LeaderboardUser[]>({
    queryKey: ['codingLeaderboard'],
    queryFn: async () => {
      const { data } = await api.get('/challenges/leaderboard');
      return data.data ?? [];
    },
  });

  // Fetch coding stats
  const { data: stats } = useQuery<{
    solvedCount: number;
    totalQuestions: number;
    topicStats?: Record<string, { total: number; solved: number }>;
  }>({
    queryKey: ['codingStats'],
    queryFn: async () => {
      const { data } = await api.get('/challenges/stats');
      return data.data ?? { solvedCount: 0, totalQuestions: 0, topicStats: {} };
    },
  });

  const getDailyChallenge = () => {
    if (!questions || questions.length === 0) return null;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % questions.length;
    return questions[index];
  };

  const dailyChallenge = getDailyChallenge();

  const columns = [
    {
      key: 'title',
      header: 'Problem Name',
      render: (r: Question) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors text-sm">
            <Link to={`/student/challenges/${r.slug}`}>{r.title}</Link>
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {r.topics.slice(0, 3).map((t) => (
              <span key={t} className="text-xxs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 capitalize">
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
        const colors = { easy: 'success', medium: 'warning', hard: 'danger' };
        return <Badge variant={colors[r.difficulty] as any} className="capitalize">{r.difficulty}</Badge>;
      },
    },
    {
      key: 'companies',
      header: 'Target Companies',
      render: (r: Question) => (
        <div className="flex flex-wrap gap-1">
          {r.companies.slice(0, 3).map((c) => (
            <span key={c} className="text-xxs px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 capitalize font-medium">
              {c}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'xp',
      header: 'XP Reward',
      render: (r: Question) => <span className="text-sm font-semibold text-amber-500">+{r.xpReward} XP</span>,
    },
    {
      key: 'actions',
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

  const handleToggleTopic = (topicKey: string) => {
    setExpandedTopic(expandedTopic === topicKey ? null : topicKey);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Hero */}
      <div className="page-container pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-lg">
          <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
            <Code2 className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight flex items-center gap-2">
              ADYAPAN Coding Arena
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Master your Data Structures & Algorithms, crack placement coding rounds, and prepare for top product companies.
            </p>
          </div>
        </div>
      </div>

      <div className="page-container pb-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card padding="md" className="flex items-center gap-4 border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Solved</p>
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mt-0.5">
                {stats?.solvedCount ?? 0} / {stats?.totalQuestions ?? 0}
              </h3>
            </div>
          </Card>
          
          <Card padding="md" className="flex items-center gap-4 border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Current Streak</p>
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mt-0.5">5 Days</h3>
            </div>
          </Card>

          <Card padding="md" className="flex items-center gap-4 border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-500">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Placement Score</p>
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mt-0.5">85 / 100</h3>
            </div>
          </Card>

          <Card padding="md" className="flex items-center gap-4 border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-500">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Active Contests</p>
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mt-0.5">1 Live</h3>
            </div>
          </Card>
        </div>

        {/* Main Content Split */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <Card padding="sm" className="flex items-center gap-3 border border-gray-100 dark:border-gray-800">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search problem name..."
                  className="w-full py-2 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                />
              </div>
            </Card>

            {/* Topic Groups Accordions */}
            {isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Unable to load coding questions from MySQL. Please make sure the backend and database are running.
              </div>
            )}
            {!isError && !isLoading && (questions?.length ?? 0) === 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                No Coding Arena questions are currently stored in MySQL.
              </div>
            )}
            <div className="space-y-4">
              {TOPIC_GROUPS.map((group) => {
                const topicQuestions = (questions ?? []).filter((q) =>
                  q.topics.some((t) => t.toLowerCase() === group.key)
                );
                const isExpanded = expandedTopic === group.key;

                return (
                  <div key={group.key} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm transition-all duration-200">
                    {/* Collapsible Header */}
                    <button
                      onClick={() => handleToggleTopic(group.key)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <h3 className="font-display font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                          {group.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">{group.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Progress Bar */}
                        <div className="hidden sm:flex items-center gap-3">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {topicQuestions.length} Questions
                          </span>
                          <div className="w-24 bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-orange-500 h-full transition-all duration-300"
                              style={{
                                width: `${
                                  topicQuestions.length > 0
                                    ? Math.min(
                                        100,
                                        Math.round(
                                          ((stats?.topicStats?.[group.key]?.solved ?? 0) /
                                            topicQuestions.length) *
                                            100
                                        )
                                      )
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-gray-850 p-6 bg-gray-50/50 dark:bg-gray-950/20">
                        <Table
                          columns={columns}
                          data={topicQuestions}
                          keyExtractor={(r: Question) => r._id}
                          loading={isLoading}
                          emptyMessage="No coding challenges found in this topic."
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Challenge Card */}
            {dailyChallenge ? (
              <Card padding="md" className="bg-gradient-to-br from-primary-600 to-purple-600 text-white relative overflow-hidden shadow-xl border-none">
                <div className="relative z-10 space-y-4">
                  <div>
                    <span className="text-xxs px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider">Daily Challenge</span>
                    <h3 className="font-display font-extrabold text-xl mt-1">{dailyChallenge.title}</h3>
                    <p className="text-xs text-white/80 mt-1">Difficulty: <span className="capitalize">{dailyChallenge.difficulty}</span> | Max {dailyChallenge.xpReward || 15} XP</p>
                  </div>
                  <p className="text-xs text-white/85 line-clamp-2">
                    Solve today's featured coding challenge in the coding arena: {dailyChallenge.title}!
                  </p>
                  <Link to={`/student/challenges/${dailyChallenge.slug}`} className="block">
                    <button className="w-full bg-white text-primary-600 font-bold text-xs py-2.5 rounded-xl hover:bg-white/95 transition-all flex items-center justify-center gap-1 shadow-sm">
                      Solve Challenge <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </Card>
            ) : (
              <Card padding="md" className="bg-gradient-to-br from-primary-600 to-purple-600 text-white relative overflow-hidden shadow-xl border-none">
                <div className="relative z-10 space-y-4">
                  <div>
                    <span className="text-xxs px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider">Daily Challenge</span>
                    <h3 className="font-display font-extrabold text-xl mt-1">Maximum Subarray</h3>
                    <p className="text-xs text-white/80 mt-1">Difficulty: Medium | Max 15 XP</p>
                  </div>
                  <p className="text-xs text-white/85 line-clamp-2">
                    {"Find the contiguous subarray (containing at least one number) which has the largest sum."}
                  </p>
                  <Link to="/student/challenges/maximum-subarray" className="block">
                    <button className="w-full bg-white text-primary-600 font-bold text-xs py-2.5 rounded-xl hover:bg-white/95 transition-all flex items-center justify-center gap-1 shadow-sm">
                      Solve Challenge <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Leaderboard Card */}
            <Card padding="md" className="border border-gray-100 dark:border-gray-800">
              <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-amber-500" />
                Global Coding Leaderboard
              </h3>

              <div className="space-y-3">
                {loadingLeaderboard ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="skeleton w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <div className="skeleton h-3 w-1/2 rounded" />
                        <div className="skeleton h-2 w-1/3 rounded" />
                      </div>
                    </div>
                  ))
                ) : (leaderboard ?? []).length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No rankings yet</p>
                ) : (
                  (leaderboard ?? []).map((l, i) => (
                    <div key={l.userId?._id || i} className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800/40 pb-2 last:border-none last:pb-0">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs font-bold w-5 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : 'text-gray-500'}`}>
                          #{i + 1}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs uppercase text-primary-700">
                          {l.userId?.firstName?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {l.userId?.firstName} {l.userId?.lastName}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-amber-500">{l.totalXP} XP</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
