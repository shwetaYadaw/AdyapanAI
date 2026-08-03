// ─── Analytics Dashboard ─────────────────────────────────────────────────
// Sections: Overall Progress | Individual Student | Comparative Overview
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users, Code2, Trophy, TrendingUp, TrendingDown, Zap,
  Search, Star, Activity,
  Target, Award, BarChart2, BookOpen, RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';

// ─── Palette ───────────────────────────────────────────────────────────────
const C = {
  blue:   '#3b82f6',
  indigo: '#6366f1',
  purple: '#8b5cf6',
  teal:   '#14b8a6',
  green:  '#10b981',
  amber:  '#f59e0b',
  red:    '#ef4444',
  pink:   '#ec4899',
  sky:    '#0ea5e9',
  orange: '#f97316',
};
const PIE_COLORS = [C.blue, C.indigo, C.purple, C.teal, C.green, C.amber];
const DIFF_COLORS: Record<string, string> = { easy: C.green, medium: C.amber, hard: C.red };

// ─── Small helpers ─────────────────────────────────────────────────────────
function fmt(n: number | undefined) {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function pct(a: number, b: number) {
  return b > 0 ? Math.round((a / b) * 100) : 0;
}

function dateLabel(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

// ─── Reusable UI atoms ─────────────────────────────────────────────────────
function StatCard({
  icon, label, value, sub, color = C.blue, trend,
}: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; color?: string; trend?: number;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}


function ProgressBar({ value, color = C.blue, className = '' }: { value: number; color?: string; className?: string }) {
  return (
    <div className={`h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, value)}%`, backgroundColor: color }}
      />
    </div>
  );
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold ml-0.5">{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Section 1: Overall Progress ──────────────────────────────────────────
function OverallSection() {
  const [trendDays, setTrendDays] = useState(30);

  const { data: summary, isLoading: sumLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/summary'); return data.data; },
    staleTime: 60000,
  });

  const { data: trends = [], isLoading: trendsLoading } = useQuery({
    queryKey: ['analytics-trends', trendDays],
    queryFn: async () => {
      const { data } = await api.get(`/admin/analytics/submission-trends?days=${trendDays}`);
      return (data.data ?? []).map((d: any) => ({ ...d, date: dateLabel(d.date) }));
    },
    staleTime: 60000,
  });

  const { data: topics = [] } = useQuery({
    queryKey: ['analytics-topics'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/topic-breakdown'); return data.data ?? []; },
    staleTime: 120000,
  });

  const { data: diffDist } = useQuery({
    queryKey: ['analytics-diff'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/difficulty-distribution'); return data.data; },
    staleTime: 120000,
  });

  const diffData = [
    { name: 'Easy',   value: (diffDist?.codingArena?.find((d: any) => d.difficulty === 'easy')?.count ?? 0) + (diffDist?.challenges?.find((d: any) => d.difficulty === 'easy')?.count ?? 0), color: C.green },
    { name: 'Medium', value: (diffDist?.codingArena?.find((d: any) => d.difficulty === 'medium')?.count ?? 0) + (diffDist?.challenges?.find((d: any) => d.difficulty === 'medium')?.count ?? 0), color: C.amber },
    { name: 'Hard',   value: (diffDist?.codingArena?.find((d: any) => d.difficulty === 'hard')?.count ?? 0) + (diffDist?.challenges?.find((d: any) => d.difficulty === 'hard')?.count ?? 0), color: C.red },
  ];

  const topicChartData = topics.slice(0, 12).map((t: any) => ({
    topic: t.topic.length > 10 ? t.topic.slice(0, 10) + '…' : t.topic,
    total: t.total, solved: t.solved,
    easy: t.easy, medium: t.medium, hard: t.hard,
  }));

  return (
    <div className="space-y-6">
      {/* Loading overlay for initial fetch */}
      {sumLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3"/>
              <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"/>
              <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded"/>
            </div>
          ))}
        </div>
      )}
      {/* KPI Row */}
      {!sumLoading && (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={<Users size={18} />}    label="Total Students"    value={fmt(summary?.students?.total)}    color={C.blue}   trend={summary?.students?.newThisMonth > 0 ? 8 : 0} />
        <StatCard icon={<Zap size={18} />}      label="Active (7d)"       value={fmt(summary?.students?.active)}   color={C.indigo} />
        <StatCard icon={<Code2 size={18} />}    label="Total Problems"    value={fmt(summary?.problems?.total)}    color={C.purple} sub={summary ? `${summary.problems.codingArena} Arena + ${summary.problems.challenges} Challenges` : undefined} />
        <StatCard icon={<Activity size={18} />} label="Total Submissions" value={fmt(summary?.submissions?.total)} color={C.teal}   sub={summary ? `${summary.submissions.thisWeek} this week` : undefined} />
        <StatCard icon={<Target size={18} />}   label="Acceptance Rate"   value={`${summary?.submissions?.acceptanceRate ?? 0}%`} color={C.green} />
        <StatCard icon={<Trophy size={18} />}   label="Aptitude Qs"       value={fmt(summary?.aptitude?.total)}    color={C.amber} />
      </div>
      )}

      {/* Trend Chart + Difficulty Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Submission Trends</h3>
              <p className="text-xs text-gray-400">Total vs Accepted submissions per day</p>
            </div>
            <div className="flex gap-1">
              {[7, 14, 30].map(d => (
                <button key={d}
                  onClick={() => setTrendDays(d)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${trendDays === d ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {d}d
                </button>
              ))}
            </div>
          </div>
          {trendsLoading ? (
            <div className="h-56 flex items-center justify-center">
              <RefreshCw size={20} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={224}>
              <AreaChart data={trends} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.blue} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.green} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" strokeOpacity={0.6} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="total"    name="Total"    stroke={C.blue}  fill="url(#totalGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="accepted" name="Accepted" stroke={C.green} fill="url(#accGrad)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="failed"   name="Failed"   stroke={C.red}   fill="none"           strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Difficulty Split</h3>
          <p className="text-xs text-gray-400 mb-4">All problems (Arena + Challenges)</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={diffData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {diffData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [fmt(v), 'Problems']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {diffData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Topic Coverage</h3>
          <p className="text-xs text-gray-400">Problems per topic with difficulty breakdown</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topicChartData} barSize={18} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" strokeOpacity={0.6} />
            <XAxis dataKey="topic" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="easy"   name="Easy"   stackId="a" fill={C.green} radius={[0,0,0,0]} />
            <Bar dataKey="medium" name="Medium" stackId="a" fill={C.amber} />
            <Bar dataKey="hard"   name="Hard"   stackId="a" fill={C.red}   radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Overall Acceptance', value: summary?.submissions?.acceptanceRate ?? 0, color: C.green, sub: `${fmt(summary?.submissions?.accepted)} accepted / ${fmt(summary?.submissions?.total)} total` },
          { label: 'Active Student Rate', value: pct(summary?.students?.active ?? 0, summary?.students?.total ?? 1), color: C.blue, sub: `${fmt(summary?.students?.active)} active in last 7 days` },
          { label: 'Problems Solved Rate', value: topics.length > 0 ? pct(topics.reduce((s: number, t: any) => s + t.solved, 0), topics.reduce((s: number, t: any) => s + t.total, 0)) : 0, color: C.purple, sub: 'Across all topics' },
        ].map(m => (
          <div key={m.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{m.label}</p>
            <p className="text-3xl font-bold mb-1" style={{ color: m.color }}>{m.value}%</p>
            <ProgressBar value={m.value} color={m.color} className="mb-2" />
            <p className="text-xs text-gray-400">{m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Demo data ────────────────────────────────────────────────────────────
const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Anya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Varun',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Divya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nikhil',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
];

function makeDays(base: number, variance: number) {
  return Array.from({ length: 30 }, (_, i) => {
    const total    = Math.max(0, base + Math.round((Math.random() - 0.5) * variance));
    const accepted = Math.round(total * (0.55 + Math.random() * 0.3));
    const d = new Date(Date.now() - (29 - i) * 86400000);
    return { date: `${d.getDate()}/${d.getMonth()+1}`, count: total, accepted };
  });
}

const DEMO_STUDENTS = [
  { id:'s1', name:'Anya Sharma',    studentId:'ADY-2026-001', batch:'Batch 2026-A', course:'Full Stack + DSA', xp:4850, rank:1,  level:12, streak:18, accuracy:94, totalSubs:312, accepted:293, solved:87,  status:'online',  lastActive:'2 min ago',  avatar:AVATARS[0],  email:'anya.sharma@gmail.com',  joinedAt:'Jan 15, 2026', topicStats:[{topic:'Arrays',solved:18},{topic:'DP',solved:14},{topic:'Graphs',solved:12},{topic:'Trees',solved:10},{topic:'Strings',solved:9},{topic:'Binary Search',solved:8}], langDist:[{lang:'Python',count:148},{lang:'JavaScript',count:110},{lang:'C++',count:54}], activity: makeDays(9, 6) },
  { id:'s2', name:'Rahul Verma',    studentId:'ADY-2026-002', batch:'Batch 2026-A', course:'DSA Mastery',      xp:4210, rank:2,  level:11, streak:12, accuracy:88, totalSubs:278, accepted:245, solved:74,  status:'online',  lastActive:'5 min ago',  avatar:AVATARS[1],  email:'rahul.verma@gmail.com',  joinedAt:'Jan 20, 2026', topicStats:[{topic:'Arrays',solved:15},{topic:'Strings',solved:13},{topic:'DP',solved:10},{topic:'Graphs',solved:8},{topic:'Hashing',solved:7},{topic:'Sorting',solved:6}], langDist:[{lang:'JavaScript',count:130},{lang:'Python',count:95},{lang:'Java',count:53}], activity: makeDays(8, 5) },
  { id:'s3', name:'Priya Singh',    studentId:'ADY-2026-003', batch:'Batch 2026-B', course:'Full Stack + DSA', xp:3780, rank:3,  level:10, streak:9,  accuracy:91, totalSubs:244, accepted:222, solved:68,  status:'offline', lastActive:'1 hr ago',   avatar:AVATARS[2],  email:'priya.singh@gmail.com',  joinedAt:'Feb 3, 2026',  topicStats:[{topic:'Trees',solved:16},{topic:'Arrays',solved:12},{topic:'DP',solved:9},{topic:'Linked List',solved:8},{topic:'Stack',solved:7},{topic:'Graphs',solved:5}], langDist:[{lang:'Python',count:140},{lang:'C++',count:62},{lang:'JavaScript',count:42}], activity: makeDays(7, 4) },
  { id:'s4', name:'Karan Mehta',    studentId:'ADY-2026-004', batch:'Batch 2026-A', course:'Backend Dev',      xp:3450, rank:4,  level:9,  streak:6,  accuracy:82, totalSubs:210, accepted:172, solved:59,  status:'online',  lastActive:'Just now',   avatar:AVATARS[3],  email:'karan.mehta@gmail.com',  joinedAt:'Jan 28, 2026', topicStats:[{topic:'Arrays',solved:14},{topic:'Hashing',solved:11},{topic:'Binary Search',solved:9},{topic:'Strings',solved:7},{topic:'DP',solved:6},{topic:'Greedy',solved:5}], langDist:[{lang:'Java',count:120},{lang:'Python',count:55},{lang:'C++',count:35}], activity: makeDays(6, 5) },
  { id:'s5', name:'Sneha Patel',    studentId:'ADY-2026-005', batch:'Batch 2026-B', course:'DSA Mastery',      xp:3120, rank:5,  level:9,  streak:14, accuracy:87, totalSubs:195, accepted:170, solved:55,  status:'online',  lastActive:'10 min ago', avatar:AVATARS[4],  email:'sneha.patel@gmail.com',  joinedAt:'Feb 10, 2026', topicStats:[{topic:'Graphs',solved:13},{topic:'Trees',solved:11},{topic:'DP',solved:9},{topic:'Arrays',solved:8},{topic:'Heap',solved:6},{topic:'Two Pointers',solved:5}], langDist:[{lang:'Python',count:115},{lang:'JavaScript',count:60},{lang:'C++',count:20}], activity: makeDays(5, 4) },
  { id:'s6', name:'Arjun Nair',     studentId:'ADY-2026-006', batch:'Batch 2026-C', course:'Full Stack + DSA', xp:2870, rank:6,  level:8,  streak:7,  accuracy:79, totalSubs:180, accepted:142, solved:48,  status:'offline', lastActive:'3 hr ago',   avatar:AVATARS[5],  email:'arjun.nair@gmail.com',   joinedAt:'Mar 1, 2026',  topicStats:[{topic:'Arrays',solved:12},{topic:'Strings',solved:9},{topic:'Sorting',solved:7},{topic:'Trees',solved:5},{topic:'DP',solved:4},{topic:'Hashing',solved:4}], langDist:[{lang:'C++',count:95},{lang:'Python',count:55},{lang:'JavaScript',count:30}], activity: makeDays(5, 3) },
  { id:'s7', name:'Meera Joshi',    studentId:'ADY-2026-007', batch:'Batch 2026-B', course:'Backend Dev',      xp:2530, rank:7,  level:7,  streak:4,  accuracy:75, totalSubs:155, accepted:116, solved:42,  status:'online',  lastActive:'15 min ago', avatar:AVATARS[6],  email:'meera.joshi@gmail.com',  joinedAt:'Feb 18, 2026', topicStats:[{topic:'Linked List',solved:10},{topic:'Stack',solved:8},{topic:'Arrays',solved:7},{topic:'Queue',solved:6},{topic:'Trees',solved:4},{topic:'Hashing',solved:3}], langDist:[{lang:'JavaScript',count:80},{lang:'Python',count:50},{lang:'Java',count:25}], activity: makeDays(4, 3) },
  { id:'s8', name:'Varun Gupta',    studentId:'ADY-2026-008', batch:'Batch 2026-C', course:'DSA Mastery',      xp:2180, rank:8,  level:7,  streak:3,  accuracy:71, totalSubs:138, accepted:98,  solved:36,  status:'offline', lastActive:'Yesterday',  avatar:AVATARS[7],  email:'varun.gupta@gmail.com',  joinedAt:'Mar 8, 2026',  topicStats:[{topic:'Arrays',solved:11},{topic:'Binary Search',solved:7},{topic:'Strings',solved:6},{topic:'DP',solved:4},{topic:'Greedy',solved:3},{topic:'Sorting',solved:3}], langDist:[{lang:'Python',count:75},{lang:'C++',count:40},{lang:'Java',count:23}], activity: makeDays(3, 4) },
  { id:'s9', name:'Divya Reddy',    studentId:'ADY-2026-009', batch:'Batch 2026-A', course:'Full Stack + DSA', xp:1920, rank:9,  level:6,  streak:5,  accuracy:83, totalSubs:120, accepted:100, solved:31,  status:'online',  lastActive:'30 min ago', avatar:AVATARS[8],  email:'divya.reddy@gmail.com',  joinedAt:'Jan 25, 2026', topicStats:[{topic:'Trees',solved:9},{topic:'Arrays',solved:7},{topic:'Hashing',solved:5},{topic:'DP',solved:4},{topic:'Strings',solved:3},{topic:'Graphs',solved:2}], langDist:[{lang:'Python',count:65},{lang:'JavaScript',count:38},{lang:'C++',count:17}], activity: makeDays(3, 3) },
  { id:'s10',name:'Nikhil Desai',   studentId:'ADY-2026-010', batch:'Batch 2026-C', course:'Backend Dev',      xp:1640, rank:10, level:5,  streak:2,  accuracy:68, totalSubs:105, accepted:71,  solved:26,  status:'offline', lastActive:'2 days ago', avatar:AVATARS[9],  email:'nikhil.desai@gmail.com', joinedAt:'Mar 15, 2026', topicStats:[{topic:'Arrays',solved:8},{topic:'Sorting',solved:5},{topic:'Strings',solved:4},{topic:'Binary Search',solved:3},{topic:'Stack',solved:3},{topic:'Two Pointers',solved:2}], langDist:[{lang:'Java',count:60},{lang:'Python',count:30},{lang:'C++',count:15}], activity: makeDays(2, 3) },
  { id:'s11',name:'Pooja Iyer',     studentId:'ADY-2026-011', batch:'Batch 2026-B', course:'DSA Mastery',      xp:1380, rank:11, level:5,  streak:1,  accuracy:62, totalSubs:88,  accepted:55,  solved:22,  status:'online',  lastActive:'45 min ago', avatar:AVATARS[10], email:'pooja.iyer@gmail.com',   joinedAt:'Feb 22, 2026', topicStats:[{topic:'Arrays',solved:7},{topic:'Linked List',solved:5},{topic:'Stack',solved:4},{topic:'Strings',solved:3},{topic:'Queue',solved:2},{topic:'Sorting',solved:1}], langDist:[{lang:'Python',count:48},{lang:'JavaScript',count:25},{lang:'Java',count:15}], activity: makeDays(2, 2) },
  { id:'s12',name:'Rohan Kapoor',   studentId:'ADY-2026-012', batch:'Batch 2026-C', course:'Full Stack + DSA', xp:980,  rank:12, level:4,  streak:0,  accuracy:55, totalSubs:65,  accepted:36,  solved:15,  status:'offline', lastActive:'4 days ago', avatar:AVATARS[11], email:'rohan.kapoor@gmail.com', joinedAt:'Mar 20, 2026', topicStats:[{topic:'Arrays',solved:6},{topic:'Strings',solved:3},{topic:'Sorting',solved:3},{topic:'Binary Search',solved:2},{topic:'Stack',solved:1},{topic:'Hashing',solved:0}], langDist:[{lang:'C++',count:35},{lang:'Python',count:20},{lang:'JavaScript',count:10}], activity: makeDays(1, 2) },
];

// ─── Section 2: Individual Student Progress ───────────────────────────────
function IndividualSection() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>('s1');

  const filtered = DEMO_STUDENTS.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.batch.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  const sd = DEMO_STUDENTS.find(s => s.id === selectedId) ?? DEMO_STUDENTS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* ── Left: Student List ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, batch, course…"
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{filtered.length} of {DEMO_STUDENTS.length} students</p>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-2 space-y-0.5" style={{ maxHeight: 620 }}>
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                selectedId === s.id
                  ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 shadow-sm'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 border border-transparent'
              }`}
            >
              {/* Avatar + online dot */}
              <div className="relative shrink-0">
                <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${s.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">{s.name}</p>
                <p className="text-xs text-gray-400 truncate">{s.batch} · {s.course}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.lastActive}</p>
              </div>

              {/* XP + Rank */}
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400">#{s.rank}</p>
                <p className="text-xs font-semibold text-amber-500">{fmt(s.xp)} XP</p>
                <p className="text-xs text-gray-400">Lv.{s.level}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Student Detail ── */}
      <div className="lg:col-span-2 space-y-4">

        {/* ── Profile Header ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="relative shrink-0">
              <img src={sd.avatar} alt={sd.name} className="w-16 h-16 rounded-2xl object-cover bg-gray-100" />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${sd.status==='online'?'bg-emerald-500':'bg-gray-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{sd.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${sd.status==='online'?'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400':'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                  {sd.status==='online'?'● Online':'○ Offline'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{sd.email}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-lg font-medium">{sd.studentId}</span>
                <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg font-medium">{sd.batch}</span>
                <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-lg font-medium">{sd.course}</span>
                <span className="text-gray-400">Joined {sd.joinedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 1. Performance Summary Cards ── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Performance Summary</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label:'Problems Solved', value: sd.solved,           icon:'💡', color: C.purple, bg:'bg-purple-50 dark:bg-purple-900/20', txt:'text-purple-700 dark:text-purple-300' },
              { label:'XP Earned',       value: `${fmt(sd.xp)} XP`,  icon:'⚡', color: C.amber,  bg:'bg-amber-50  dark:bg-amber-900/20',  txt:'text-amber-700  dark:text-amber-300'  },
              { label:'Global Rank',     value: `#${sd.rank}`,       icon:'🏆', color: C.indigo, bg:'bg-indigo-50 dark:bg-indigo-900/20', txt:'text-indigo-700 dark:text-indigo-300' },
              { label:'Accuracy',        value: `${sd.accuracy}%`,   icon:'🎯', color: C.green,  bg:'bg-green-50  dark:bg-green-900/20',  txt:'text-green-700  dark:text-green-300'  },
              { label:'Streak',          value: `${sd.streak} days`, icon:'🔥', color: C.orange, bg:'bg-orange-50 dark:bg-orange-900/20', txt:'text-orange-700 dark:text-orange-300' },
            ].map(c=>(
              <div key={c.label} className={`rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-2 ${c.bg}`}>
                <span className="text-2xl">{c.icon}</span>
                <p className={`text-xl font-bold ${c.txt}`}>{c.value}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. Topic-wise Progress Bars ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Topic-wise Progress</p>
          <div className="space-y-3">
            {sd.topicStats.map((t,i)=>{
              const max   = sd.topicStats[0]?.solved || 1;
              const pctW  = Math.round((t.solved/max)*100);
              const ratio = t.solved/max;
              const color = ratio>=0.65 ? C.green : ratio>=0.35 ? C.amber : C.red;
              const label = ratio>=0.65 ? 'Strong' : ratio>=0.35 ? 'Developing' : 'Needs work';
              return (
                <div key={t.topic} className="flex items-center gap-3">
                  {/* Topic name */}
                  <span className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0 truncate">{t.topic}</span>
                  {/* Bar */}
                  <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${pctW}%`, backgroundColor: color }}
                    />
                  </div>
                  {/* Score + label */}
                  <span className="w-8 text-sm font-bold text-right shrink-0" style={{color}}>{t.solved}</span>
                  <span className={`w-20 text-xs font-semibold shrink-0 ${
                    ratio>=0.65?'text-emerald-600 dark:text-emerald-400':ratio>=0.35?'text-amber-600 dark:text-amber-400':'text-red-600 dark:text-red-400'
                  }`}>{label}</span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
            {[['bg-emerald-500','Strong (≥65%)'],['bg-amber-400','Developing (35-64%)'],['bg-red-500','Needs work (<35%)']].map(([dot,lbl])=>(
              <span key={lbl} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${dot}`}/>{lbl}</span>
            ))}
          </div>
        </div>

        {/* ── 3. Strengths & Needs Improvement ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-base">💪</span>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Strengths</p>
                <p className="text-xs text-gray-400">Topics performing well</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {sd.topicStats.filter(t=>t.solved/(sd.topicStats[0]?.solved||1)>=0.65).length===0
                ? <p className="text-sm text-gray-400 italic">No strong topics yet — keep going!</p>
                : sd.topicStats.filter(t=>t.solved/(sd.topicStats[0]?.solved||1)>=0.65).map(t=>(
                  <div key={t.topic} className="flex items-center justify-between px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"/>
                      <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{t.topic}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-lg">{t.solved} solved ✓</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Needs Improvement */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/40 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-base">📈</span>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Needs Improvement</p>
                <p className="text-xs text-gray-400">Focus areas to level up</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {sd.topicStats.filter(t=>t.solved/(sd.topicStats[0]?.solved||1)<0.35).length===0
                ? <p className="text-sm text-gray-400 italic">Great job — no weak spots!</p>
                : sd.topicStats.filter(t=>t.solved/(sd.topicStats[0]?.solved||1)<0.35).map(t=>(
                  <div key={t.topic} className="flex items-center justify-between px-3 py-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"/>
                      <span className="text-sm font-semibold text-red-800 dark:text-red-300">{t.topic}</span>
                    </div>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-lg">{t.solved} solved →</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ── 4. 30-Day Activity + Language Usage ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Activity chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">30-Day Activity</p>
            <p className="text-xs text-gray-400 mb-3">Daily submissions vs accepted</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={sd.activity} barSize={6} margin={{top:0,right:0,left:-30,bottom:0}}>
                <XAxis dataKey="date" tick={{fontSize:8,fill:'#9ca3af'}} tickLine={false} axisLine={false} interval={6}/>
                <YAxis tick={{fontSize:8,fill:'#9ca3af'}} tickLine={false} axisLine={false}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Bar dataKey="count"    name="Total"    fill={C.blue}  radius={[2,2,0,0]}/>
                <Bar dataKey="accepted" name="Accepted" fill={C.green} radius={[2,2,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Language usage */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Language Usage</p>
            <div className="space-y-3">
              {sd.langDist.map((l,i)=>{
                const total = sd.langDist.reduce((s,x)=>s+x.count,0);
                const pctVal = pct(l.count,total);
                const color  = PIE_COLORS[i%PIE_COLORS.length];
                return (
                  <div key={l.lang} className="flex items-center gap-3">
                    <span className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize shrink-0">{l.lang}</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{width:`${pctVal}%`,backgroundColor:color}}/>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 w-10 text-right shrink-0">{pctVal}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Comparative demo data ─────────────────────────────────────────────────

// ─── Comparative demo data & helpers ──────────────────────────────────────
const TOPICS_LIST = ['Arrays','Strings','DP','Trees','Graphs','Linked List','Binary Search','Hashing'];
const DEMO_APTITUDE: Record<string,number> = {s1:92,s2:85,s3:88,s4:78,s5:83,s6:70,s7:74,s8:65,s9:80,s10:60,s11:55,s12:48};
const DEMO_STUDY:   Record<string,number>  = {s1:38,s2:32,s3:30,s4:27,s5:29,s6:24,s7:22,s8:18,s9:20,s10:15,s11:12,s12:8};

const WEEKS = ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6'];
const LINE_COLORS = [C.blue,C.purple,C.green,C.amber,C.teal];

const RANK_SERIES = DEMO_STUDENTS.slice(0,5).map((s,i)=>({
  name:s.name.split(' ')[0], color:LINE_COLORS[i],
  data:Array.from({length:6},(_,j)=>Math.max(1,s.rank+Math.round((Math.random()-0.6)*(3-j)))),
}));
const XP_SERIES = DEMO_STUDENTS.slice(0,5).map((s,i)=>({
  name:s.name.split(' ')[0], color:LINE_COLORS[i],
  data:Array.from({length:6},(_,j)=>Math.round(s.xp*(0.4+j*0.13+Math.random()*0.05))),
}));
function toChartRows(series:{name:string;data:number[]}[]) {
  return WEEKS.map((w,i)=>{ const r:any={week:w}; series.forEach(s=>{r[s.name]=s.data[i];}); return r; });
}

// ─── Section 3 ─────────────────────────────────────────────────────────────
function ComparativeSection() {
  const [filter,      setFilter]      = useState<'xp'|'accuracy'|'solved'|'improved'>('xp');
  const [batchFilter, setBatchFilter] = useState('all');
  const [courseFilter,setCourseFilter]= useState('all');

  const visible = DEMO_STUDENTS.filter(s=>
    (batchFilter==='all'  || s.batch===batchFilter) &&
    (courseFilter==='all' || s.course===courseFilter)
  );
  const sorted = [...visible].sort((a,b)=>
    filter==='accuracy'?b.accuracy-a.accuracy:
    filter==='solved'  ?b.solved  -a.solved  :
    filter==='improved'?(b.xp-b.solved*45)-(a.xp-a.solved*45):
    b.xp-a.xp
  );
  const top    = sorted[0];
  const bottom = sorted[sorted.length-1];

  const batchStats = ['Batch 2026-A','Batch 2026-B','Batch 2026-C'].map(b=>{
    const mb=DEMO_STUDENTS.filter(s=>s.batch===b);
    return {batch:b.replace('Batch ',''),
      avgXP :Math.round(mb.reduce((a,s)=>a+s.xp,0)/mb.length),
      avgAcc:Math.round(mb.reduce((a,s)=>a+s.accuracy,0)/mb.length),
      avgSol:Math.round(mb.reduce((a,s)=>a+s.solved,0)/mb.length),
      n:mb.length};
  });

  const topicAvg = TOPICS_LIST.map(t=>{
    const vals=DEMO_STUDENTS.map(s=>s.topicStats.find(x=>x.topic===t)?.solved??0);
    const avg=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
    return {topic:t,avg,pct:Math.round((avg/18)*100)};
  }).sort((a,b)=>b.avg-a.avg);

  const strongTopics = topicAvg.filter(t=>t.pct>=50).slice(0,4);
  const weakTopics   = topicAvg.filter(t=>t.pct<35).slice(0,4);

  const aiLines=[
    `🏆 <b>${top?.name}</b> leads — <b>${fmt(top?.xp)} XP</b>, <b>${top?.accuracy}% accuracy</b>, <b>${top?.solved} problems</b> solved.`,
    `📉 <b>${bottom?.name}</b> needs support — <b>${bottom?.solved} problems</b> solved at <b>${bottom?.accuracy}% accuracy</b>.`,
    `📊 Best batch: <b>${batchStats.reduce((a,b)=>a.avgAcc>b.avgAcc?a:b).batch}</b> (avg accuracy ${batchStats.reduce((a,b)=>a.avgAcc>b.avgAcc?a:b).avgAcc}%).`,
    `🟢 Strongest platform topic: <b>${topicAvg[0]?.topic}</b> (avg ${topicAvg[0]?.avg} solved per student).`,
    `🔴 Weakest topic: <b>${topicAvg[topicAvg.length-1]?.topic}</b> — avg only ${topicAvg[topicAvg.length-1]?.avg} solved. Add more practice sets.`,
    `🔥 ${visible.filter(s=>s.streak>=10).length} of ${visible.length} students have 10+ day streaks — strong engagement.`,
  ];

  const perfCols = [
    {label:'XP',        key:'xp',        color:C.amber,  suffix:'',  fmt:(s:any)=>fmt(s.xp)        },
    {label:'Accuracy',  key:'accuracy',  color:C.green,  suffix:'%', fmt:(s:any)=>`${s.accuracy}%` },
    {label:'Solved',    key:'solved',    color:C.purple, suffix:'',  fmt:(s:any)=>String(s.solved)  },
    {label:'Aptitude',  key:'apt',       color:C.indigo, suffix:'',  fmt:(s:any)=>String(DEMO_APTITUDE[s.id]??'-')},
    {label:'Study hrs', key:'study',     color:C.teal,   suffix:'h', fmt:(s:any)=>`${DEMO_STUDY[s.id]??0}h`},
    {label:'Streak',    key:'streak',    color:C.orange, suffix:'d', fmt:(s:any)=>`${s.streak}d`   },
  ];

  return (
    <div className="space-y-6 pb-6">

      {/* ── FILTERS ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Filters:</span>
        {/* Quick filter buttons */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {([
            {k:'xp',       label:'🏆 Highest XP'       },
            {k:'accuracy', label:'🎯 Best Accuracy'     },
            {k:'solved',   label:'📚 Most Solved'       },
            {k:'improved', label:'🚀 Most Improved'     },
          ] as const).map(({k,label})=>(
            <button key={k} onClick={()=>setFilter(k as any)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap
                ${filter===k?'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm':'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>
        {/* Batch */}
        <select value={batchFilter} onChange={e=>setBatchFilter(e.target.value)}
          className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {['all','Batch 2026-A','Batch 2026-B','Batch 2026-C'].map(b=>(
            <option key={b} value={b}>{b==='all'?'All Batches':b}</option>
          ))}
        </select>
        {/* Course */}
        <select value={courseFilter} onChange={e=>setCourseFilter(e.target.value)}
          className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {['all','Full Stack + DSA','DSA Mastery','Backend Dev'].map(c=>(
            <option key={c} value={c}>{c==='all'?'All Courses':c}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 ml-auto">{visible.length} students shown</span>
      </div>

      {/* ── HERO CARDS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {emoji:'🏆',label:'Highest XP',    val:`${fmt(DEMO_STUDENTS[0].xp)} XP`,   sub:DEMO_STUDENTS[0].name,                                                 bg:'bg-amber-50  dark:bg-amber-900/20',  txt:'text-amber-700  dark:text-amber-300' },
          {emoji:'🎯',label:'Best Accuracy', val:`${Math.max(...visible.map(s=>s.accuracy))}%`,  sub:visible.reduce((a,b)=>a.accuracy>b.accuracy?a:b,visible[0])?.name, bg:'bg-green-50  dark:bg-green-900/20',  txt:'text-green-700  dark:text-green-300' },
          {emoji:'📚',label:'Most Solved',   val:`${Math.max(...visible.map(s=>s.solved))} probs`,sub:visible.reduce((a,b)=>a.solved>b.solved?a:b,visible[0])?.name,     bg:'bg-blue-50   dark:bg-blue-900/20',   txt:'text-blue-700   dark:text-blue-300'  },
          {emoji:'🚀',label:'Top Streak',    val:`${Math.max(...visible.map(s=>s.streak))} days`,sub:visible.reduce((a,b)=>a.streak>b.streak?a:b,visible[0])?.name,     bg:'bg-orange-50 dark:bg-orange-900/20', txt:'text-orange-700 dark:text-orange-300'},
        ].map(c=>(
          <div key={c.label} className={`rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 ${c.bg}`}>
            <p className="text-2xl mb-1">{c.emoji}</p>
            <p className={`text-xl font-bold ${c.txt}`}>{c.val}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ── PERFORMANCE COMPARISON TABLE ─────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h4 className="font-bold text-gray-900 dark:text-white">Performance Comparison Table</h4>
          <p className="text-xs text-gray-400 mt-0.5">All students · XP · Accuracy · Problems Solved · Aptitude · Study Hours · Streak</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/60">
                <th className="py-2.5 pl-4 text-left font-medium w-8">#</th>
                <th className="py-2.5 text-left font-medium">Student</th>
                <th className="py-2.5 text-left font-medium hidden sm:table-cell">Batch</th>
                {perfCols.map(c=>(
                  <th key={c.key} className="py-2.5 text-right pr-4 font-medium" style={{color:c.color}}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {sorted.map((s,i)=>(
                <tr key={s.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${i===0?'bg-amber-50/40 dark:bg-amber-900/10':''}`}>
                  <td className="py-2.5 pl-4">
                    <span className={`text-sm font-bold ${i<3?'text-amber-500':'text-gray-400'}`}>
                      {i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="relative shrink-0">
                        <img src={s.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 ${s.status==='online'?'bg-emerald-500':'bg-gray-400'}`}/>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white leading-tight">{s.name}</p>
                        <p className="text-xs text-gray-400">Lv.{s.level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 hidden sm:table-cell">
                    <span className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">{s.batch.replace('Batch ','')}</span>
                  </td>
                  {perfCols.map(c=>(
                    <td key={c.key} className="py-2.5 text-right pr-4">
                      <span className="font-semibold text-sm" style={{color:c.color}}>{c.fmt(s)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TOPIC PERFORMANCE (progress bars) ────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Topic Performance</h4>
        <p className="text-xs text-gray-400 mb-5">Platform-wide average problems solved per topic</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
          {topicAvg.map(t=>{
            const color = t.pct>=50?C.green:t.pct>=30?C.amber:C.red;
            const label = t.pct>=50?'Strong':t.pct>=30?'Developing':'Weak';
            return (
              <div key={t.topic} className="flex items-center gap-3">
                <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0 truncate">{t.topic}</span>
                <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{width:`${t.pct}%`,backgroundColor:color}}/>
                </div>
                <span className="text-xs font-bold w-6 text-right shrink-0" style={{color}}>{t.avg}</span>
                <span className={`text-xs font-semibold w-20 shrink-0 ${t.pct>=50?'text-emerald-600 dark:text-emerald-400':t.pct>=30?'text-amber-600 dark:text-amber-400':'text-red-600 dark:text-red-400'}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RANK GROWTH + XP GROWTH charts ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Rank Growth */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <h4 className="font-bold text-gray-900 dark:text-white mb-1">Rank Growth</h4>
          <p className="text-xs text-gray-400 mb-4">Top 5 students — weekly rank (lower = better)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={toChartRows(RANK_SERIES)} margin={{top:5,right:10,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" strokeOpacity={0.6}/>
              <XAxis dataKey="week" tick={{fontSize:10,fill:'#9ca3af'}} tickLine={false} axisLine={false}/>
              <YAxis reversed tick={{fontSize:10,fill:'#9ca3af'}} tickLine={false} axisLine={false}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Legend iconType="circle" iconSize={7} wrapperStyle={{fontSize:10}}/>
              {RANK_SERIES.map(s=>(
                <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* XP Growth */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <h4 className="font-bold text-gray-900 dark:text-white mb-1">XP Growth</h4>
          <p className="text-xs text-gray-400 mb-4">Top 5 students — cumulative XP week by week</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={toChartRows(XP_SERIES)} margin={{top:5,right:10,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" strokeOpacity={0.6}/>
              <XAxis dataKey="week" tick={{fontSize:10,fill:'#9ca3af'}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:10,fill:'#9ca3af'}} tickLine={false} axisLine={false}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Legend iconType="circle" iconSize={7} wrapperStyle={{fontSize:10}}/>
              {XP_SERIES.map(s=>(
                <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── STRENGTHS | NEEDS IMPROVEMENT ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-lg">💪</span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Strengths</p>
              <p className="text-xs text-gray-400">Topics where students excel</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {strongTopics.map(t=>(
              <div key={t.topic} className="flex items-center justify-between px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"/>
                  <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{t.topic}</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-lg">avg {t.avg} solved ✓</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/40 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-lg">📈</span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Needs Improvement</p>
              <p className="text-xs text-gray-400">Topics requiring more practice</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {weakTopics.map(t=>(
              <div key={t.topic} className="flex items-center justify-between px-3 py-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"/>
                  <span className="text-sm font-semibold text-red-800 dark:text-red-300">{t.topic}</span>
                </div>
                <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-lg">avg {t.avg} solved →</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI INSIGHTS ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">AI Insights</p>
            <p className="text-xs text-gray-400">Auto-generated observations based on current data</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiLines.map((line,i)=>(
            <div key={i} className="flex items-start gap-3 bg-white/70 dark:bg-gray-900/50 rounded-xl px-4 py-3 border border-indigo-100/50 dark:border-indigo-800/30">
              <span className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{__html:line}}/>
            </div>
          ))}
        </div>
      </div>

      {/* ── LEADERBOARD ──────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Leaderboard</h4>
            <p className="text-xs text-gray-400">Top students ranked by XP · Batch comparison</p>
          </div>
          <div className="flex gap-3">
            {batchStats.map((b,i)=>{
              const colors=['bg-blue-100 text-blue-700','bg-purple-100 text-purple-700','bg-teal-100 text-teal-700'];
              return (
                <div key={b.batch} className={`text-center px-3 py-1.5 rounded-xl text-xs font-medium ${colors[i]}`}>
                  <p className="font-bold">{b.batch}</p>
                  <p>{b.avgAcc}% acc · {b.avgSol} sol</p>
                </div>
              );
            })}
          </div>
        </div>
        {/* Podium top 3 */}
        {sorted.length>=3 && (
          <div className="grid grid-cols-3 gap-3 p-5 pb-3">
            {[sorted[1],sorted[0],sorted[2]].map((s,i)=>{
              const pos=[2,1,3][i];
              const h=['h-24','h-32','h-20'][i];
              const clr=[C.indigo,C.amber,C.purple][i];
              const medal=['🥈','🥇','🥉'][i];
              return (
                <div key={s.id} className={`flex flex-col items-center justify-end pb-3 rounded-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden ${h}`} style={{background:`${clr}08`}}>
                  <div className="absolute inset-0 opacity-5" style={{background:clr}}/>
                  <span className="text-xl mb-1">{medal}</span>
                  <img src={s.avatar} className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-900" alt=""/>
                  <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">{s.name.split(' ')[0]}</p>
                  <p className="text-[10px] font-bold" style={{color:clr}}>{fmt(s.xp)} XP</p>
                  <span className="absolute top-2 right-2 text-[10px] font-bold text-gray-400">#{pos}</span>
                </div>
              );
            })}
          </div>
        )}
        {/* Full table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/50">
              <th className="py-2 pl-5 text-left font-medium">#</th>
              <th className="py-2 text-left font-medium">Student</th>
              <th className="py-2 text-right font-medium">XP</th>
              <th className="py-2 text-right font-medium">Accuracy</th>
              <th className="py-2 text-right font-medium">Solved</th>
              <th className="py-2 pr-5 text-right font-medium">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {sorted.map((s,i)=>(
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="py-2.5 pl-5">
                  <span className={`text-sm font-bold ${i<3?'text-amber-500':'text-gray-400'}`}>
                    {i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
                  </span>
                </td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <img src={s.avatar} className="w-7 h-7 rounded-full object-cover" alt=""/>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm leading-tight">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.batch.replace('Batch ','')}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-right font-bold text-amber-600 dark:text-amber-400">{fmt(s.xp)}</td>
                <td className="py-2.5 text-right font-semibold text-green-600 dark:text-green-400">{s.accuracy}%</td>
                <td className="py-2.5 text-right font-semibold text-purple-600 dark:text-purple-400">{s.solved}</td>
                <td className="py-2.5 pr-5 text-right text-orange-500">{s.streak}🔥</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
const TABS = [
  { key: 'overall',     label: 'Overall Progress',               icon: TrendingUp, color: 'blue'   },
  { key: 'individual',  label: 'Individual Student Progress',     icon: Users,      color: 'purple' },
  { key: 'comparative', label: 'Comparative Performance Overview', icon: Trophy,     color: 'amber'  },
] as const;

type TabKey = typeof TABS[number]['key'];

const TAB_STYLES: Record<string, { active: string; inactive: string }> = {
  blue:   { active: 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900',   inactive: 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30' },
  purple: { active: 'bg-purple-600 text-white shadow-sm shadow-purple-200 dark:shadow-purple-900', inactive: 'text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30' },
  amber:  { active: 'bg-amber-500 text-white shadow-sm shadow-amber-200 dark:shadow-amber-900',  inactive: 'text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30' },
};

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overall');

  return (
    <div className="page-wrapper pb-12 space-y-5">
      {/* Header + Tab row in one line */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <BarChart2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white leading-tight">Analytics</h1>
            <p className="text-xs text-gray-400">Enterprise insights</p>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl flex-1 sm:flex-initial overflow-x-auto scrollbar-hide">
          {TABS.map(({ key, label, icon: Icon, color }) => {
            const isActive = activeTab === key;
            const styles = TAB_STYLES[color];
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 ${isActive ? styles.active : styles.inactive}`}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active section content */}
      <div>
        {activeTab === 'overall'     && <OverallSection />}
        {activeTab === 'individual'  && <IndividualSection />}
        {activeTab === 'comparative' && <ComparativeSection />}
      </div>
    </div>
  );
}
