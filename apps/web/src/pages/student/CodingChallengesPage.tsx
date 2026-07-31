import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trophy, Code2, Flame, BrainCircuit, Target, ArrowRight, Sparkles } from 'lucide-react';
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
      // Use /problems endpoint for DSA Coding Arena (not /challenges/questions which is for TCS NQT)
      const { data } = await api.get('/problems');
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
    <div className="page-wrapper space-y-6">

      {/* Search bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 shadow-sm max-w-lg">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics..."
          className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 outline-none"
        />
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 p-8 sm:p-10 text-white shadow-brand"
      >
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12 scale-150">
          <Code2 className="w-96 h-96 text-white" />
        </div>
        <div className="absolute left-1/3 bottom-0 opacity-5 pointer-events-none">
          <Sparkles className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 space-y-2 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight"
          >
            ADYAPAN Coding Arena
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-white/90 text-sm sm:text-base leading-relaxed"
          >
            Master your Data Structures &amp; Algorithms, crack placement coding rounds, and prepare for top product companies.
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Solved', value: `${stats?.solvedCount ?? 0} / ${stats?.totalQuestions ?? 0}`, icon: Trophy, color: 'from-amber-500 to-yellow-400' },
          { label: 'Current Streak', value: '5 Days', icon: Flame, color: 'from-orange-500 to-red-400' },
          { label: 'Placement Score', value: '85 / 100', icon: BrainCircuit, color: 'from-blue-500 to-cyan-400' },
          { label: 'Active Contests', value: '1 Live', icon: Target, color: 'from-purple-500 to-violet-400' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
            <Card padding="md" className="flex items-center gap-4 border border-gray-100 dark:border-gray-800">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{stat.label}</p>
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mt-0.5">{stat.value}</h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-2 space-y-3">
          {/* Topic Grid */}
          {TOPIC_GROUPS.filter((g) =>
            !search || g.title.toLowerCase().includes(search.toLowerCase())
          ).map((group, idx) => {
            const topicCount = (questions ?? []).filter((q) =>
              q.topics.some((t) => t.toLowerCase() === group.key)
            ).length;

            return (
              <motion.button
                key={group.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.02 }}
                onClick={() => navigate(`/student/challenges/topic/${group.key}`)}
                className="w-full text-left border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 hover:shadow-card-hover hover:border-primary-200 dark:hover:border-primary-800 hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden"
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
                    <div className="w-7 h-7 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/40 flex items-center justify-center transition-all group-hover:translate-x-0.5">
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-6">
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
  );
}
