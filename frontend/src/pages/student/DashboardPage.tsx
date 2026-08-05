import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen, Award, Flame, Zap, Code2, Trophy, Target,
  ArrowRight, CheckCircle2, Brain, BarChart2,
  TrendingUp, Activity, Star
} from 'lucide-react';
import { useAppSelector } from '../../shared/hooks/hooks';
import { selectUser } from '../../features/auth/authSlice';
import { api } from '../../core/services/api';
import Card from '../../shared/components/Card/Card';

const GOAL_KEY = 'dashboard_weekly_goal';
const GOAL_PROGRESS_KEY = 'dashboard_weekly_progress';

const STRENGTH_TOPICS = [
  { key: 'arrays', label: 'Arrays', color: 'bg-blue-500' },
  { key: 'strings', label: 'Strings', color: 'bg-purple-500' },
  { key: 'trees', label: 'Trees', color: 'bg-green-500' },
  { key: 'dynamic-programming', label: 'DP', color: 'bg-orange-500' },
  { key: 'graphs', label: 'Graphs', color: 'bg-rose-500' },
  { key: 'hashing', label: 'Hashing', color: 'bg-cyan-500' },
];

const QUICK_START = [
  { label: 'Coding Arena', desc: 'DSA problems & topics', icon: Code2, href: '/student/challenges', color: 'from-violet-500 to-purple-600' },
  { label: 'Placement Prep', desc: 'Reasoning & aptitude tests', icon: Trophy, href: '/student/placement', color: 'from-orange-500 to-amber-500' },
  { label: 'Placement Prep', desc: 'Mock tests & patterns', icon: Trophy, href: '/student/tcs-nqt', color: 'from-blue-500 to-cyan-500' },
  { label: 'Aptitude Prep', desc: 'Quant, verbal, logical', icon: Brain, href: '/student/aptitude', color: 'from-green-500 to-emerald-500' },
  { label: 'Contests', desc: 'Weekly & monthly events', icon: Target, href: '/student/contests', color: 'from-orange-500 to-amber-500' },
  { label: 'Certificates', desc: 'Your earned badges', icon: Award, href: '/student/certificates', color: 'from-pink-500 to-rose-500' },
  { label: 'My Profile', desc: 'Skills & resume', icon: Star, href: '/student/profile', color: 'from-gray-500 to-slate-600' },
];

export default function StudentDashboard() {
  const user = useAppSelector(selectUser);

  const { data: profile } = useQuery({ queryKey: ['studentProfile'], queryFn: async () => { const { data } = await api.get('/students/profile'); return data.data; } });
  const { data: codingStats } = useQuery({ queryKey: ['codingStats'], queryFn: async () => { const { data } = await api.get('/problems/stats'); return data.data; } });
  const { data: placementStats } = useQuery({ queryKey: ['placementStats'], queryFn: async () => { try { const { data } = await api.get('/tcs-nqt/stats'); return data.data; } catch { return null; } } });
  const { data: questions } = useQuery({
    queryKey: ['codingQuestions', ''],
    queryFn: async () => {
      const { data } = await api.get('/problems');
      return (data.data ?? []).map((q: any) => ({ ...q, topics: Array.isArray(q.topics) ? q.topics : (typeof q.topics === 'string' ? JSON.parse(q.topics) : []) }));
    },
  });
  const { data: submissions } = useQuery({ queryKey: ['recentSubmissions'], queryFn: async () => { const { data } = await api.get('/problem-submissions?limit=5'); return data.data ?? []; } });

  const [weeklyGoal, setWeeklyGoal] = useState(() => Number(localStorage.getItem(GOAL_KEY) || 5));
  const [weeklyProgress, setWeeklyProgress] = useState(() => Number(localStorage.getItem(GOAL_PROGRESS_KEY) || 0));
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(weeklyGoal);

  useEffect(() => {
    const lastReset = localStorage.getItem('goal_last_reset');
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    if (!lastReset || new Date(lastReset) < monday) {
      setWeeklyProgress(0);
      localStorage.setItem(GOAL_PROGRESS_KEY, '0');
      localStorage.setItem('goal_last_reset', now.toISOString());
    }
  }, []);

  const saveGoal = () => { setWeeklyGoal(goalInput); localStorage.setItem(GOAL_KEY, String(goalInput)); setEditingGoal(false); };

  const daily = (() => {
    if (!questions?.length) return null;
    return questions[Math.floor(Date.now() / 86400000) % questions.length];
  })();

  const topicStrength = STRENGTH_TOPICS.map(t => {
    const total = (questions ?? []).filter((q: any) => q.topics?.includes(t.key)).length;
    const solved = (submissions ?? []).filter((s: any) =>
      s.status === 'accepted' && (questions ?? []).find((q: any) => (q._id || q.id) === s.questionId)?.topics?.includes(t.key)
    ).length;
    return { ...t, pct: total ? Math.round((solved / total) * 100) : 0 };
  });

  const goalPct = Math.min(100, Math.round((weeklyProgress / weeklyGoal) * 100));

  return (
    <div className="page-wrapper space-y-6">

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">Welcome back, {user?.firstName}! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'XP Points', value: profile?.totalXP ?? profile?.xp ?? 0, icon: Zap, color: 'from-yellow-500 to-amber-400', href: '/student/profile' },
          { label: 'Problems Solved', value: (codingStats?.solvedCount ?? 0) + (placementStats?.solvedCount ?? 0), icon: Code2, color: 'from-purple-500 to-violet-400', href: '/student/challenges' },
          { label: 'Day Streak', value: profile?.streak ?? 0, icon: Flame, color: 'from-orange-500 to-red-400', href: '/student/profile' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link to={stat.href}>
              <Card hover padding="md">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}><stat.icon className="w-5 h-5 text-white" /></div>
                <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 3-column main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* COL 1 — Daily Challenge spans 2 rows */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:row-span-2">
          <Card padding="md" className="h-full bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600 border-none text-white overflow-hidden relative flex flex-col" style={{ minHeight: 300 }}>
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none"><Code2 className="w-48 h-48 -translate-y-8 translate-x-8" /></div>
            <div className="relative z-10 flex flex-col flex-1 gap-4">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/25 uppercase tracking-widest w-fit">🔥 Daily Challenge</span>
              {daily ? (
                <>
                  <h3 className="font-display font-extrabold text-2xl leading-snug">{daily.title}</h3>
                  <p className="text-sm text-white/80">Difficulty: <span className="capitalize font-semibold text-white">{daily.difficulty}</span> | Max {daily.xpReward || 15} XP</p>
                  <p className="text-sm text-white/75 leading-relaxed flex-1">Solve today's featured coding challenge: <span className="font-semibold text-white">{daily.title}!</span></p>
                  <Link to={`/student/challenges/${daily.slug}`} className="mt-auto">
                    <button className="w-full bg-white text-orange-600 font-bold text-sm py-3.5 rounded-2xl hover:bg-white/95 transition-all flex items-center justify-center gap-2 shadow-sm">
                      Solve Challenge <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </>
              ) : <p className="text-white/70 text-sm">Loading today's challenge...</p>}
            </div>
          </Card>
        </motion.div>

        {/* COL 2 TOP — Weekly Goal */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2"><Target className="w-4 h-4 text-primary-500" /> Weekly Goal</h3>
              <button onClick={() => setEditingGoal(e => !e)} className="text-xs text-primary-500 font-semibold">{editingGoal ? 'Cancel' : 'Edit'}</button>
            </div>
            {editingGoal ? (
              <div className="flex items-center gap-2 mb-3">
                <input type="number" min={1} max={50} value={goalInput} onChange={e => setGoalInput(Number(e.target.value))}
                  className="w-16 text-sm px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                <span className="text-xs text-gray-400">/ week</span>
                <button onClick={saveGoal} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-bold">Save</button>
              </div>
            ) : <p className="text-xs text-gray-400 mb-3">Target: <span className="font-bold text-gray-700 dark:text-gray-300">{weeklyGoal} problems</span></p>}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 26}`} strokeDashoffset={`${2 * Math.PI * 26 * (1 - goalPct / 100)}`}
                    strokeLinecap="round" className="text-primary-500 transition-all duration-700" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-bold text-gray-900 dark:text-white">{goalPct}%</span></div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xl font-display font-bold text-gray-900 dark:text-white">{weeklyProgress}<span className="text-xs font-normal text-gray-400"> / {weeklyGoal}</span></p>
                <p className="text-xs text-gray-400">solved this week</p>
                <button onClick={() => { const n = weeklyProgress + 1; setWeeklyProgress(n); localStorage.setItem(GOAL_PROGRESS_KEY, String(n)); }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-100 transition-all">+ Mark Solved</button>
              </div>
            </div>
            {goalPct >= 100 && <p className="mt-2 text-xs text-green-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Goal achieved! 🎉</p>}
          </Card>
        </motion.div>

        {/* COL 3 TOP — My Progress */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card padding="md">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-primary-500" /> My Progress</h3>
            <div className="space-y-3">
              {[
                { label: 'Coding Arena', solved: codingStats?.solvedCount ?? 0, total: codingStats?.totalQuestions ?? 0, color: 'bg-purple-500', href: '/student/challenges' },
                { label: 'Placement Prep', solved: placementStats?.solvedCount ?? 0, total: placementStats?.totalQuestions ?? 0, color: 'bg-blue-500', href: '/student/tcs-nqt' },
              ].map(item => {
                const pct = item.total ? Math.round((item.solved / item.total) * 100) : 0;
                return (
                  <Link key={item.label} to={item.href} className="block group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors">{item.label}</span>
                      <span className="text-xs text-gray-400">{item.solved} / {item.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${Math.max(pct, 2)}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* COL 2 BOTTOM — Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-col">
          <Card padding="md" className="h-full flex flex-col">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-3"><Activity className="w-4 h-4 text-primary-500" /> Recent Activity</h3>
            <div className="flex-1 flex flex-col justify-center">
            {(!submissions || submissions.length === 0) ? (
              <div className="text-center py-4">
                <Code2 className="w-7 h-7 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No activity yet</p>
                <Link to="/student/challenges" className="mt-1 inline-block text-xs text-primary-500 font-semibold">Go to Coding Arena →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {(submissions ?? []).slice(0, 4).map((s: any, i: number) => (
                  <div key={s._id || i} className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${s.status === 'accepted' ? 'bg-green-100 dark:bg-green-950/40' : 'bg-red-100 dark:bg-red-950/40'}`}>
                      {s.status === 'accepted' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Code2 className="w-3 h-3 text-red-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{s.question?.title || 'Problem'}</p>
                      <p className="text-[10px] text-gray-400">{s.language}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${s.status === 'accepted' ? 'bg-green-100 dark:bg-green-950/40 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                      {s.status === 'accepted' ? 'AC' : 'WA'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            </div>
          </Card>
        </motion.div>

        {/* COL 3 BOTTOM — Topic Strength */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col">
          <Card padding="md" className="h-full flex flex-col">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-3"><BarChart2 className="w-4 h-4 text-primary-500" /> Topic Strength</h3>
            <div className="flex-1 space-y-2">
              {topicStrength.map(t => (
                <div key={t.key}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{t.label}</span>
                    <span className="text-xs text-gray-400">{t.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className={`h-full ${t.color} rounded-full`} style={{ width: `${Math.max(t.pct, 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Link to="/student/challenges" className="mt-3 flex items-center gap-1 text-xs text-primary-500 font-semibold">Practice weak topics <ArrowRight className="w-3 h-3" /></Link>
          </Card>
        </motion.div>

      </div>

      {/* Quick Start — full width */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card padding="md">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-4">Quick Start</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_START.map(item => (
              <Link key={item.href} to={item.href}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="rounded-xl p-3 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm transition-all group cursor-pointer text-center">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition-colors leading-tight">{item.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{item.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>

    </div>
  );
}
