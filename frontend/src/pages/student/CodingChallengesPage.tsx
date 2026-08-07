import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trophy, Code2, Flame, BrainCircuit, Target, ArrowRight } from 'lucide-react';
import { api } from '../../core/services/api';
import Card from '../../shared/components/Card/Card';

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

interface Topic {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export default function CodingChallengesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Convert topic name to key format (e.g., "Binary Search" → "binary-search")
  const topicNameToKey = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[&/]/g, '').replace('queue-deque', 'queue-deque');
  };

  // Get student's course to filter problems
  const { data: profileData } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => { const { data } = await api.get('/students/profile'); return data.data; },
    staleTime: 5 * 60 * 1000,
  });
  const studentCourseId = profileData?.course;

  // Fetch topics from public API - filtered by student's course
  const { data: topicsData, isLoading: topicsLoading, error: topicsError } = useQuery<Topic[]>({
    queryKey: ['codingTopics', studentCourseId],
    queryFn: async () => {
      const params: any = { system: 'coding-arena' };
      if (studentCourseId) {
        params.courseId = studentCourseId;
      } else {
        params.courseId = 'none'; // Only global DSA topics
      }
      const { data } = await api.get('/topics', { params });
      return data.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Transform API topics to display format - NO FALLBACK
  const topicGroups = (topicsData && topicsData.length > 0)
    ? topicsData
        .sort((a, b) => a.order - b.order)
        .map((topic, idx) => ({
          title: `${idx + 1}. ${topic.name}`,
          key: topicNameToKey(topic.name),
          description: topic.description || `${topic.name} problems for top MNC companies`,
          id: topic.id,
          totalCount: 0
        }))
    : [];

  // Fetch all problems from Problem table (Coding Arena) - filtered by student's course
  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ['codingArenaProblems', studentCourseId || 'none'],
    queryFn: async () => {
      const courseParam = studentCourseId || 'none';
      const { data } = await api.get(`/problems?limit=500&courseId=${courseParam}`);
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
      const { data } = await api.get('/problems/leaderboard');
      return data.data ?? [];
    },
  });

  // Fetch coding stats
  const { data: stats } = useQuery<{ solvedCount: number; totalQuestions: number }>({
    queryKey: ['codingStats'],
    queryFn: async () => {
      const { data } = await api.get('/problems/stats');
      return data.data ?? { solvedCount: 0, totalQuestions: 0 };
    },
  });

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-gray-950">

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
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-container pt-3">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-lg">
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
      </motion.div>

      <div className="page-container pb-16 pt-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { icon: Trophy, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-950/30', label: 'Total Solved', value: `${stats?.solvedCount ?? 0} / ${stats?.totalQuestions ?? 0}` },
            { icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/30', label: 'Current Streak', value: '5 Days' },
            { icon: BrainCircuit, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/30', label: 'Placement Score', value: '85 / 100' },
            { icon: Target, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950/30', label: 'Active Contests', value: '1 Live' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
              <Card padding="md" className="flex items-center gap-4 border border-gray-100 dark:border-gray-800">
                <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mt-0.5">{stat.value}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Split */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
        {/* Topic Grid — click to navigate */}
            <div className="space-y-3">
              {topicsLoading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400">Loading topics...</div>
                </div>
              ) : topicsError ? (
                <div className="text-center py-12">
                  <div className="text-red-500 text-sm">Error loading topics. Please refresh the page.</div>
                  <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                    Refresh Page
                  </button>
                </div>
              ) : topicGroups.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">No topics available. Topics will appear here once added by the admin.</div>
                </div>
              ) : (
                topicGroups.filter((g) =>
                  !search || g.title.toLowerCase().includes(search.toLowerCase())
                ).map((group, idx) => {
                  const topicCount = (questions ?? []).filter((q) =>
                    q.topics.some((t) => {
                      const tKey = t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      return tKey === group.key || t.toLowerCase() === group.key;
                    })
                  ).length;

                  return (
                    <motion.button
                      key={group.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.04 }}
                      whileHover={{ scale: 1.01, x: 4 }}
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
                    </motion.button>
                  );
                })
              )}
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
