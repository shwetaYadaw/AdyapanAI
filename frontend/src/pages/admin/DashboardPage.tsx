import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Code2, FileText, TrendingUp, BarChart3, BookOpen, Brain, Shield, Settings, ChevronRight, Activity, Clock } from 'lucide-react';
import { api } from '../../core/services/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const greeting = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {greeting}, {user.firstName || 'Admin'} 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here's what's happening with your platform today.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800">
            <Clock size={14} />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          icon={<Users size={22} />}
          label="Total Students"
          value={stats?.totalStudents || 0}
          trend="+12% this month"
          color="blue"
          loading={loading}
        />
        <StatsCard
          icon={<Code2 size={22} />}
          label="Coding Problems"
          value={stats?.totalProblems || 0}
          trend="Active in arena"
          color="cyan"
          loading={loading}
        />
        <StatsCard
          icon={<FileText size={22} />}
          label="Total Submissions"
          value={stats?.totalSubmissions || 0}
          trend="All time"
          color="emerald"
          loading={loading}
        />
        <StatsCard
          icon={<TrendingUp size={22} />}
          label="Today's Submissions"
          value={stats?.submissionsToday || 0}
          trend="Last 24 hours"
          color="purple"
          loading={loading}
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          <QuickActionCard
            icon={<Code2 size={24} />}
            title="Manage Problems"
            description="Add and manage coding problems, placement prep & aptitude"
            color="indigo"
            onClick={() => navigate('/admin/problems')}
          />
          <QuickActionCard
            icon={<Users size={24} />}
            title="Manage Users"
            description="View student accounts, roles, and activity"
            color="blue"
            onClick={() => navigate('/admin/users')}
          />
          <QuickActionCard
            icon={<BarChart3 size={24} />}
            title="Analytics"
            description="View submission stats, progress reports & insights"
            color="emerald"
            onClick={() => navigate('/admin/analytics')}
          />
          <QuickActionCard
            icon={<BookOpen size={24} />}
            title="Placement Prep"
            description="Manage placement preparation questions"
            color="amber"
            onClick={() => navigate('/admin/problems')}
          />
          <QuickActionCard
            icon={<Shield size={24} />}
            title="Security"
            description="Manage security settings and access control"
            color="red"
            onClick={() => navigate('/admin/security')}
          />
          <QuickActionCard
            icon={<Settings size={24} />}
            title="Settings"
            description="Platform configuration and preferences"
            color="gray"
            onClick={() => navigate('/admin/settings')}
          />
        </div>
      </div>

      {/* Activity & Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { text: 'New student registered', time: '2 min ago', dot: 'bg-green-500' },
              { text: 'Problem submission accepted', time: '15 min ago', dot: 'bg-blue-500' },
              { text: 'New coding problem added', time: '1 hr ago', dot: 'bg-purple-500' },
              { text: 'Contest scheduled', time: '3 hrs ago', dot: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${item.dot} shrink-0`} />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.text}</span>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Overview */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain size={18} className="text-purple-500" />
              Platform Overview
            </h3>
          </div>
          <div className="space-y-4">
            <OverviewItem label="Coding Arena Problems" value={stats?.totalProblems || 0} color="blue" />
            <OverviewItem label="Placement Prep Qs" value={stats?.placementQuestions || 0} color="amber" />
            <OverviewItem label="Aptitude Questions" value={stats?.aptitudeQuestions || 0} color="emerald" />
            <OverviewItem label="Active Contests" value={stats?.activeContests || 0} color="purple" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ icon, label, value, trend, color, loading }: {
  icon: React.ReactNode; label: string; value: number; trend: string; color: string; loading: boolean;
}) {
  const colors: Record<string, { bg: string; icon: string; border: string }> = {
    blue:    { bg: 'bg-blue-50 dark:bg-blue-950/30', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900' },
    cyan:    { bg: 'bg-cyan-50 dark:bg-cyan-950/30', icon: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-100 dark:border-cyan-900' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900' },
    purple:  { bg: 'bg-purple-50 dark:bg-purple-950/30', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border ${c.border} hover:shadow-md transition-shadow`}>
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
        </div>
      ) : (
        <>
          <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
            <span className={c.icon}>{icon}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          <p className="text-xs text-gray-400 mt-1">{trend}</p>
        </>
      )}
    </div>
  );
}

// Quick Action Card
function QuickActionCard({ icon, title, description, color, onClick }: {
  icon: React.ReactNode; title: string; description: string; color: string; onClick: () => void;
}) {
  const colors: Record<string, string> = {
    indigo: 'group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400',
    blue:   'group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    emerald:'group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    amber:  'group-hover:bg-amber-50 dark:group-hover:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    red:    'group-hover:bg-red-50 dark:group-hover:bg-red-950/30 text-red-600 dark:text-red-400',
    gray:   'group-hover:bg-gray-100 dark:group-hover:bg-gray-800 text-gray-600 dark:text-gray-400',
  };

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all text-left w-full"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-gray-50 dark:bg-gray-800 ${colors[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{description}</p>
      </div>
      <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors shrink-0" />
    </button>
  );
}

// Overview Item
function OverviewItem({ label, value, color }: { label: string; value: number; color: string }) {
  const dotColors: Record<string, string> = {
    blue: 'bg-blue-500', amber: 'bg-amber-500', emerald: 'bg-emerald-500', purple: 'bg-purple-500',
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColors[color]}`} />
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
