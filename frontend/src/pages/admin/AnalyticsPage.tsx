// ─── Analytics Dashboard ─────────────────────────────────────────────────
// Sections: Overall Progress | Individual Student | Comparative Overview
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users, Zap, Code2, Activity, Target, Trophy, TrendingUp, TrendingDown,
  Search, RefreshCw, BarChart2, User, Award, Zap as Lightning, Calendar,
  Clock, CheckCircle, XCircle, Filter, Download, Mail, MoreVertical,
  Eye, Edit2, Trash2, UserCheck, UserX, Shield
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { api } from '../../core/services/api';

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
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col gap-3 h-full hover:-translate-y-0.5 transition-all duration-300"
      style={{ boxShadow: `0 4px 20px ${color}25, 0 1px 3px rgba(0,0,0,0.05)` }}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, boxShadow: `0 4px 12px ${color}30` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-end">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 min-h-[16px]">{sub || '\u00A0'}</p>
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
  const [detailModal, setDetailModal] = useState<'students' | 'active' | 'problems' | 'submissions' | 'acceptance' | 'aptitude' | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

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

  const { data: studentsList = [] } = useQuery({
    queryKey: ['analytics-students-list'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/students-list'); return data.data ?? []; },
    enabled: detailModal === 'students',
  });

  const { data: activeStudentsList = [] } = useQuery({
    queryKey: ['analytics-active-students'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/active-students'); return data.data ?? []; },
    enabled: detailModal === 'active',
  });

  const { data: problemsBreakdown = [] } = useQuery({
    queryKey: ['analytics-problems-breakdown', selectedCourseId],
    queryFn: async () => { const { data } = await api.get(`/admin/analytics/problems-breakdown${selectedCourseId ? `?courseId=${selectedCourseId}` : ''}`); return data.data ?? []; },
    enabled: detailModal === 'problems',
  });

  const { data: coursesWithProblems = [] } = useQuery({
    queryKey: ['analytics-courses-with-problems'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/courses-with-problems'); return data.data ?? []; },
    enabled: detailModal === 'problems',
  });

  const { data: aptitudeBreakdown = [] } = useQuery({
    queryKey: ['analytics-aptitude-breakdown'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/aptitude-breakdown'); return data.data ?? []; },
  });

  const { data: allStudentsForDropdown = [] } = useQuery({
    queryKey: ['analytics-students-dropdown'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/students-list'); return data.data ?? []; },
    enabled: detailModal === 'submissions' || detailModal === 'acceptance',
  });

  const { data: studentSubStats } = useQuery({
    queryKey: ['analytics-student-submissions', selectedStudentId],
    queryFn: async () => { const { data } = await api.get(`/admin/analytics/student-submissions?userId=${selectedStudentId}`); return data.data; },
    enabled: (detailModal === 'submissions' || detailModal === 'acceptance') && !!selectedStudentId,
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
        <div className="cursor-pointer" onClick={() => setDetailModal('students')}>
          <StatCard icon={<Users size={18} />}    label="Total Students"    value={fmt(summary?.students?.total)}    color={C.blue}   trend={summary?.students?.newThisMonth > 0 ? 8 : 0} />
        </div>
        <div className="cursor-pointer" onClick={() => setDetailModal('active')}>
          <StatCard icon={<Zap size={18} />}      label="Active (7d)"       value={fmt(summary?.students?.active)}   color={C.indigo} />
        </div>
        <div className="cursor-pointer" onClick={() => setDetailModal('problems')}>
          <StatCard icon={<Code2 size={18} />}    label="Total Problems"    value={fmt(summary?.problems?.total)}    color={C.purple} sub={summary ? `${summary.problems.codingArena} Arena + ${summary.problems.challenges} Challenges` : undefined} />
        </div>
        <div className="cursor-pointer" onClick={() => setDetailModal('submissions')}>
          <StatCard icon={<Activity size={18} />} label="Total Submissions" value={fmt(summary?.submissions?.total)} color={C.teal}   sub={summary ? `${summary.submissions.thisWeek} this week` : undefined} />
        </div>
        <div className="cursor-pointer" onClick={() => setDetailModal('acceptance')}>
          <StatCard icon={<Target size={18} />}   label="Acceptance Rate"   value={`${summary?.submissions?.acceptanceRate ?? 0}%`} color={C.green} />
        </div>
        <div className="cursor-pointer" onClick={() => setDetailModal('aptitude')}>
          <StatCard icon={<Trophy size={18} />}   label="Aptitude Qs"       value={fmt(summary?.aptitude?.total)}    color={C.amber} />
        </div>
      </div>
      )}

      {/* Trend Chart + Difficulty Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-5">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeOpacity={0.5} />
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

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-5">
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

      {/* Topic Breakdown + Aptitude Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Topic Coverage</h3>
            <p className="text-xs text-gray-400">Problems per topic with difficulty breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topicChartData} barSize={18} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeOpacity={0.5} />
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

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Aptitude Questions</h3>
          <p className="text-xs text-gray-400 mb-4">Questions per topic</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={aptitudeBreakdown.slice(0, 6).map((t: any, i: number) => ({ name: t.topic, value: t.total }))} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {aptitudeBreakdown.slice(0, 6).map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number, name: string) => [v, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {aptitudeBreakdown.slice(0, 6).map((t: any, i: number) => (
              <div key={t.topic} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-gray-600 dark:text-gray-400 text-xs">{t.topic}</span>
                </span>
                <span className="font-semibold text-gray-900 dark:text-white text-xs">{t.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Overall Acceptance', value: summary?.submissions?.acceptanceRate ?? 0, color: C.green, sub: `${fmt(summary?.submissions?.accepted)} accepted / ${fmt(summary?.submissions?.total)} total` },
          { label: 'Active Student Rate', value: pct(summary?.students?.active ?? 0, summary?.students?.total ?? 1), color: C.blue, sub: `${fmt(summary?.students?.active)} active in last 7 days` },
          { label: 'Problems Solved Rate', value: topics.length > 0 ? pct(topics.reduce((s: number, t: any) => s + t.solved, 0), topics.reduce((s: number, t: any) => s + t.total, 0)) : 0, color: C.purple, sub: 'Across all topics' },
        ].map(m => (
          <div key={m.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{m.label}</p>
            <p className="text-3xl font-bold mb-1" style={{ color: m.color }}>{m.value}%</p>
            <ProgressBar value={m.value} color={m.color} className="mb-2" />
            <p className="text-xs text-gray-400">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => { setDetailModal(null); setSelectedStudentId(''); setSelectedCourseId(''); }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {detailModal === 'students' && 'All Students'}
                {detailModal === 'active' && 'Active Students (Last 7 Days)'}
                {detailModal === 'problems' && 'Problems Breakdown by Topic'}
                {detailModal === 'submissions' && 'Submissions Overview'}
                {detailModal === 'acceptance' && 'Acceptance Rate Details'}
                {detailModal === 'aptitude' && 'Aptitude Questions by Topic'}
              </h3>
              <button onClick={() => { setDetailModal(null); setSelectedStudentId(''); setSelectedCourseId(''); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <XCircle size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto p-5" style={{ maxHeight: '60vh' }}>
              {detailModal === 'students' && (
                <div className="space-y-2">
                  {studentsList.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">Loading...</p> : studentsList.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.firstName} {s.lastName}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {detailModal === 'active' && (
                <div className="space-y-2">
                  {activeStudentsList.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">No active students in last 7 days</p> : activeStudentsList.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.firstName} {s.lastName}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{s.lastLogin ? new Date(s.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</span>
                    </div>
                  ))}
                </div>
              )}
              {detailModal === 'submissions' && (
                <div className="space-y-4">
                  <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Students (Overall)</option>
                    {allStudentsForDropdown.map((s: any) => (<option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.email})</option>))}
                  </select>
                  {!selectedStudentId && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-teal-700">{fmt(summary?.submissions?.total)}</p><p className="text-xs text-gray-500 mt-1">Total</p></div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-green-700">{fmt(summary?.submissions?.accepted)}</p><p className="text-xs text-gray-500 mt-1">Accepted</p></div>
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-red-700">{fmt((summary?.submissions?.total || 0) - (summary?.submissions?.accepted || 0))}</p><p className="text-xs text-gray-500 mt-1">Rejected</p></div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-blue-700">{fmt(summary?.submissions?.thisWeek)}</p><p className="text-xs text-gray-500 mt-1">This Week</p></div>
                    </div>
                  )}
                  {selectedStudentId && studentSubStats && (
                    <><p className="text-xs font-semibold text-gray-400 uppercase">{studentSubStats.student.firstName} {studentSubStats.student.lastName}'s Performance</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-teal-700">{studentSubStats.total}</p><p className="text-xs text-gray-500 mt-1">Total</p></div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-green-700">{studentSubStats.accepted}</p><p className="text-xs text-gray-500 mt-1">Accepted</p></div>
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-red-700">{studentSubStats.rejected}</p><p className="text-xs text-gray-500 mt-1">Rejected</p></div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center"><p className="text-2xl font-bold text-purple-700">{studentSubStats.acceptanceRate}%</p><p className="text-xs text-gray-500 mt-1">Accuracy</p></div>
                    </div></>
                  )}
                  {selectedStudentId && !studentSubStats && <p className="text-sm text-gray-400 text-center py-3">Loading...</p>}
                </div>
              )}
              {detailModal === 'acceptance' && (
                <div className="space-y-4">
                  <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Students (Overall)</option>
                    {allStudentsForDropdown.map((s: any) => (<option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.email})</option>))}
                  </select>
                  {!selectedStudentId && (
                    <><div className="text-center py-4"><p className="text-5xl font-bold text-green-600">{summary?.submissions?.acceptanceRate ?? 0}%</p><p className="text-sm text-gray-500 mt-2">Overall Acceptance Rate</p></div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"><span className="text-sm text-gray-600">Total Submissions</span><span className="text-sm font-bold">{fmt(summary?.submissions?.total)}</span></div>
                      <div className="flex items-center justify-between px-4 py-3 bg-green-50 rounded-xl"><span className="text-sm text-green-700">Accepted</span><span className="text-sm font-bold text-green-700">{fmt(summary?.submissions?.accepted)}</span></div>
                      <div className="flex items-center justify-between px-4 py-3 bg-red-50 rounded-xl"><span className="text-sm text-red-700">Rejected</span><span className="text-sm font-bold text-red-700">{fmt((summary?.submissions?.total || 0) - (summary?.submissions?.accepted || 0))}</span></div>
                    </div></>
                  )}
                  {selectedStudentId && studentSubStats && (
                    <><div className="text-center py-4"><p className="text-5xl font-bold text-green-600">{studentSubStats.acceptanceRate}%</p><p className="text-sm text-gray-500 mt-2">{studentSubStats.student.firstName}'s Acceptance Rate</p></div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl"><span className="text-sm text-gray-600">Total</span><span className="text-sm font-bold">{studentSubStats.total}</span></div>
                      <div className="flex items-center justify-between px-4 py-3 bg-green-50 rounded-xl"><span className="text-sm text-green-700">Accepted</span><span className="text-sm font-bold text-green-700">{studentSubStats.accepted}</span></div>
                      <div className="flex items-center justify-between px-4 py-3 bg-red-50 rounded-xl"><span className="text-sm text-red-700">Rejected</span><span className="text-sm font-bold text-red-700">{studentSubStats.rejected}</span></div>
                    </div></>
                  )}
                  {selectedStudentId && !studentSubStats && <p className="text-sm text-gray-400 text-center py-3">Loading...</p>}
                </div>
              )}
              {detailModal === 'problems' && (
                <div className="space-y-3">
                  <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Courses</option>
                    {coursesWithProblems.map((c: any) => (<option key={c.courseId} value={c.courseId}>{c.label} ({c.count})</option>))}
                  </select>
                  <div className="space-y-2">
                  {problemsBreakdown.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">Loading...</p> : problemsBreakdown.map((t: any) => (
                    <div key={t.topic} className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t.topic}</p><p className="text-xs text-gray-400"><span className="text-green-600">{t.easy} easy</span> · <span className="text-amber-600">{t.medium} medium</span> · <span className="text-red-600">{t.hard} hard</span></p></div>
                      <span className="text-sm font-bold text-purple-600">{t.total}</span>
                    </div>
                  ))}
                  </div>
                </div>
              )}
              {detailModal === 'aptitude' && (
                <div className="space-y-2">
                  {aptitudeBreakdown.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">Loading...</p> : aptitudeBreakdown.map((t: any) => (
                    <div key={t.topic} className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between"><p className="text-sm font-semibold text-gray-900 dark:text-white">{t.topic}</p><span className="text-sm font-bold text-amber-600">{t.total}</span></div>
                      {t.chapters && t.chapters.length > 0 && (<div className="mt-2 space-y-1">{t.chapters.filter((ch: any) => ch.count > 0).map((ch: any) => (<div key={ch.name} className="flex items-center justify-between pl-3"><span className="text-xs text-gray-500">{ch.name}</span><span className="text-xs font-medium text-gray-600">{ch.count}</span></div>))}</div>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section 2: Individual Student Progress (Real Data) ──────────────────
function IndividualSection() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');

  const { data: studentsData } = useQuery({
    queryKey: ['analytics-students-individual', search],
    queryFn: async () => { const { data } = await api.get(`/admin/analytics/students?limit=50&search=${search}`); return data.data ?? []; },
  });

  const { data: studentDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['analytics-student-detail', selectedId],
    queryFn: async () => { const { data } = await api.get(`/admin/analytics/students/${selectedId}`); return data.data; },
    enabled: !!selectedId,
    retry: 1,
  });

  const students = studentsData ?? [];

  // Auto-select first student when data loads
  useEffect(() => {
    if (students.length > 0 && !selectedId) {
      setSelectedId(students[0].id);
    }
  }, [students]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left: Student List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email..." className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-400" />
          </div>
          <p className="text-xs text-gray-400 mt-2">{students.length} students</p>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-0.5" style={{ maxHeight: 620 }}>
          {students.map((s: any, i: number) => (
            <button key={s.id} onClick={() => setSelectedId(s.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${selectedId === s.id ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 border border-transparent'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {s.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.name}</p>
                <p className="text-xs text-gray-400 truncate">{s.email}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-purple-600">#{i + 1}</p>
                <p className="text-xs font-semibold text-amber-500">{fmt(s.xp)} XP</p>
                <p className="text-xs text-gray-400">Lv.{s.level}</p>
              </div>
            </button>
          ))}
          {students.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No students found</p>}
        </div>
      </div>

      {/* Right: Student Detail */}
      <div className="lg:col-span-2 space-y-4">
        {detailLoading && selectedId ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center">
            <p className="text-gray-400">Loading student data...</p>
          </div>
        ) : !studentDetail ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center">
            <p className="text-gray-400">Select a student to view their progress</p>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {studentDetail.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">{studentDetail.name}</h3>
                  <p className="text-sm text-gray-500">{studentDetail.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${studentDetail.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {studentDetail.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {studentDetail.joinedAt && <span className="text-gray-400">Joined {new Date(studentDetail.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Problems Solved', value: studentDetail.stats?.problemsSolved ?? 0, color: C.purple },
                { label: 'XP Earned', value: `${fmt(studentDetail.profile?.xp ?? 0)}`, color: C.amber },
                { label: 'Accuracy', value: `${studentDetail.stats?.accuracy ?? 0}%`, color: C.green },
                { label: 'Streak', value: `${studentDetail.profile?.streak ?? 0} days`, color: C.orange },
              ].map(c => (
                <div key={c.label} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
                  <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">{c.label}</p>
                </div>
              ))}
            </div>

            {/* Topic-wise Progress */}
            {studentDetail.topicStats && studentDetail.topicStats.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Topic-wise Progress</p>
                <div className="space-y-3">
                  {studentDetail.topicStats.map((t: any) => {
                    const max = studentDetail.topicStats[0]?.solved || 1;
                    const pctW = Math.round((t.solved / max) * 100);
                    const ratio = t.solved / max;
                    const color = ratio >= 0.65 ? C.green : ratio >= 0.35 ? C.amber : C.red;
                    const label = ratio >= 0.65 ? 'Strong' : ratio >= 0.35 ? 'Developing' : 'Needs work';
                    return (
                      <div key={t.topic} className="flex items-center gap-3">
                        <span className="w-28 text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0 truncate">{t.topic}</span>
                        <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pctW}%`, backgroundColor: color }} />
                        </div>
                        <span className="w-8 text-sm font-bold text-right shrink-0" style={{ color }}>{t.solved}</span>
                        <span className={`w-20 text-xs font-semibold shrink-0 ${ratio >= 0.65 ? 'text-emerald-600' : ratio >= 0.35 ? 'text-amber-600' : 'text-red-600'}`}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 30-Day Activity */}
            {studentDetail.activityTimeline && studentDetail.activityTimeline.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">30-Day Activity</p>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={studentDetail.activityTimeline.map((d: any) => ({ ...d, date: dateLabel(d.date) }))} barSize={6} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={6} />
                    <YAxis tick={{ fontSize: 8, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" name="Total" fill={C.blue} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="accepted" name="Accepted" fill={C.green} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Language Distribution */}
            {studentDetail.languageDistribution && studentDetail.languageDistribution.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Language Usage</p>
                <div className="space-y-3">
                  {studentDetail.languageDistribution.map((l: any, i: number) => {
                    const total = studentDetail.languageDistribution.reduce((s: number, x: any) => s + x.count, 0);
                    const pctVal = pct(l.count, total);
                    const color = PIE_COLORS[i % PIE_COLORS.length];
                    return (
                      <div key={l.lang} className="flex items-center gap-3">
                        <span className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize shrink-0">{l.lang}</span>
                        <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pctVal}%`, backgroundColor: color }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 w-10 text-right shrink-0">{pctVal}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Section 3: Comparative Performance (Real Data) ───────────────────────
function ComparativeSection() {
  const [sortBy, setSortBy] = useState<'xp' | 'accuracy' | 'totalSubmissions'>('xp');

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['analytics-leaderboard'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/leaderboard?limit=50'); return data.data ?? []; },
  });

  const sorted = [...leaderboard].sort((a: any, b: any) => {
    if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
    if (sortBy === 'totalSubmissions') return b.totalSubmissions - a.totalSubmissions;
    return b.xp - a.xp;
  });

  const top = sorted[0];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sort by:</span>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {([
            { k: 'xp', label: 'Highest XP' },
            { k: 'accuracy', label: 'Best Accuracy' },
            { k: 'totalSubmissions', label: 'Most Submissions' },
          ] as const).map(({ k, label }) => (
            <button key={k} onClick={() => setSortBy(k as any)} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${sortBy === k ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{sorted.length} students</span>
      </div>

      {/* Hero Cards */}
      {top && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '🏆', label: 'Highest XP', val: `${fmt(top.xp)} XP`, sub: top.name, bg: 'bg-amber-50 dark:bg-amber-900/20', txt: 'text-amber-700 dark:text-amber-300' },
            { emoji: '🎯', label: 'Best Accuracy', val: `${sorted.reduce((a: any, b: any) => a.accuracy > b.accuracy ? a : b, sorted[0])?.accuracy ?? 0}%`, sub: sorted.reduce((a: any, b: any) => a.accuracy > b.accuracy ? a : b, sorted[0])?.name, bg: 'bg-green-50 dark:bg-green-900/20', txt: 'text-green-700 dark:text-green-300' },
            { emoji: '📚', label: 'Most Submissions', val: `${sorted.reduce((a: any, b: any) => a.totalSubmissions > b.totalSubmissions ? a : b, sorted[0])?.totalSubmissions ?? 0}`, sub: sorted.reduce((a: any, b: any) => a.totalSubmissions > b.totalSubmissions ? a : b, sorted[0])?.name, bg: 'bg-blue-50 dark:bg-blue-900/20', txt: 'text-blue-700 dark:text-blue-300' },
            { emoji: '🔥', label: 'Top Streak', val: `${sorted.reduce((a: any, b: any) => a.streak > b.streak ? a : b, sorted[0])?.streak ?? 0} days`, sub: sorted.reduce((a: any, b: any) => a.streak > b.streak ? a : b, sorted[0])?.name, bg: 'bg-orange-50 dark:bg-orange-900/20', txt: 'text-orange-700 dark:text-orange-300' },
          ].map(c => (
            <div key={c.label} className={`rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 ${c.bg}`}>
              <p className="text-2xl mb-1">{c.emoji}</p>
              <p className={`text-xl font-bold ${c.txt}`}>{c.val}</p>
              <p className="text-xs font-semibold text-gray-500">{c.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{c.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h4 className="font-bold text-gray-900 dark:text-white">Performance Comparison Table</h4>
          <p className="text-xs text-gray-400 mt-0.5">All students · XP · Accuracy · Submissions · Streak</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/60">
                <th className="py-2.5 pl-4 text-left font-medium w-8">#</th>
                <th className="py-2.5 text-left font-medium">Student</th>
                <th className="py-2.5 text-right pr-4 font-medium text-amber-500">XP</th>
                <th className="py-2.5 text-right pr-4 font-medium text-green-500">Accuracy</th>
                <th className="py-2.5 text-right pr-4 font-medium text-purple-500">Submissions</th>
                <th className="py-2.5 text-right pr-4 font-medium text-teal-500">Accepted</th>
                <th className="py-2.5 text-right pr-4 font-medium text-orange-500">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {sorted.map((s: any, i: number) => (
                <tr key={s.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${i === 0 ? 'bg-amber-50/40 dark:bg-amber-900/10' : ''}`}>
                  <td className="py-2.5 pl-4">
                    <span className={`text-sm font-bold ${i < 3 ? 'text-amber-500' : 'text-gray-400'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {s.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white leading-tight">{s.name}</p>
                        <p className="text-xs text-gray-400">Lv.{s.level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-right pr-4 font-bold text-amber-600">{fmt(s.xp)}</td>
                  <td className="py-2.5 text-right pr-4 font-semibold text-green-600">{s.accuracy}%</td>
                  <td className="py-2.5 text-right pr-4 font-semibold text-purple-600">{s.totalSubmissions}</td>
                  <td className="py-2.5 text-right pr-4 font-semibold text-teal-600">{s.acceptedSubmissions}</td>
                  <td className="py-2.5 text-right pr-4 text-orange-500">{s.streak}🔥</td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">No student data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
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
  blue:   { active: 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900',   inactive: 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30' },
  purple: { active: 'bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900', inactive: 'text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30' },
  amber:  { active: 'bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900',  inactive: 'text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30' },
};

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overall');

  return (
    <div className="page-wrapper pb-12 space-y-5 bg-brand-cream dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-brand-amber px-6 sm:px-8 py-6 rounded-2xl shadow-brand">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <BarChart2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white leading-tight">Analytics</h1>
            <p className="text-sm text-white/70">Enterprise Insights</p>
          </div>
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

      {/* Active section content */}
      <div>
        {activeTab === 'overall'     && <OverallSection />}
        {activeTab === 'individual'  && <IndividualSection />}
        {activeTab === 'comparative' && <ComparativeSection />}
      </div>
    </div>
  );
}

