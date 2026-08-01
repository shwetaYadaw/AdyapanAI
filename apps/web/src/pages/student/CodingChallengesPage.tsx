import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Trophy, Code2, Flame, BrainCircuit, Target, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Fetch all questions (used for per-topic counts + daily challenge)
  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ['codingQuestions', ''],
    queryFn: async () => {
      // Use /challenges/questions endpoint for all Coding Arena questions
      const { data } = await api.get('/challenges/questions');
      return (data.data ?? []).map((q: any) => ({
        ...q,
        _id: q._id ?? q.id,
        topics: Array.isArray(q.topics) ? q.topics : (typeof q.topics === 'string' ? q.topics.split(',').map((t: string) => t.trim()) : []),
        companies: Array.isArray(q.companies) ? q.companies : (typeof q.companies === 'string' ? q.companies.split(',').map((c: string) => c.trim()) : []),
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
  const { data: stats } = useQuery<{ solvedCount: number; totalQuestions: number }>({
    queryKey: ['codingStats'],
    queryFn: async () => {
      const { data } = await api.get('/challenges/stats');
      return data.data ?? { solvedCount: 0, totalQuestions: 0 };
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Search bar — above the hero */}
      <div className="page-container pt-6">
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 shadow-sm max-w-lg">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Hero */}
      <div className="page-container pt-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-lg">
          <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
            <Code2 className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 space-y-2 max-w-2xl">
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight">
              ADYAPAN Coding Arena
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Master your Data Structures &amp; Algorithms, crack placement coding rounds, and prepare for top product companies.
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
            {/* Topic Grid — click to navigate */}
            <div className="space-y-3">
              {TOPIC_GROUPS.filter((g) =>
                !search || g.title.toLowerCase().includes(search.toLowerCase())
              ).map((group, idx) => {
                const topicCount = (questions ?? []).filter((q) =>
                  q.topics.some((t) => t.toLowerCase() === group.key)
                ).length;

                return (
                  <button
                    key={group.key}
                    onClick={() => navigate(`/student/challenges/topic/${group.key}`)}
                    className="w-full text-left border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200 group overflow-hidden"
                  >
                    <div className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-base text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {group.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{group.description}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {isLoading ? '...' : topicCount} Problems
                        </span>
                        <div className="w-7 h-7 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/40 flex items-center justify-center transition-colors">
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Leaderboard Card */}
            <Card padding="md" className="border border-gray-100 dark:border-gray-800">
              <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-amber-500" />
                Leaderboard
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
                  <p className="text-xs text-gray-400 text-center py-4">No rankings yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
