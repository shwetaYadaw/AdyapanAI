import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Code2, FileText, TrendingUp, BarChart3, BookOpen, Brain, Shield, Settings, ChevronRight, Activity, Clock, Zap, Trophy } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 dark:bg-gray-950 p-5 lg:p-8">
      {/* Welcome Header with Gradient */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-brand-amber rounded-2xl p-6 lg:p-8 shadow-brand-lg">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-white/5 rounded-full translate-y-24" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {greeting}, {user.firstName || 'Admin'} 👋
              </h1>
              <p className="text-orange-100 mt-1 text-sm lg:text-base">
                Here's what's happening with your platform today.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-white/80 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <Clock size={14} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards - Colorful with gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: <Users size={22} />, label: 'Total Students', value: stats?.totalStudents || 0, trend: '+12% this month', gradient: 'from-primary-500 to-primary-600', shadow: 'shadow-brand', bg: '' },
          { icon: <Code2 size={22} />, label: 'Coding Problems', value: stats?.totalProblems || 0, trend: 'Active in arena', gradient: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/20', bg: '' },
          { icon: <FileText size={22} />, label: 'Total Submissions', value: stats?.totalSubmissions || 0, trend: 'All time', gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20', bg: '' },
          { icon: <TrendingUp size={22} />, label: "Today's Submissions", value: stats?.submissionsToday || 0, trend: 'Last 24 hours', gradient: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/20', bg: '' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
            <div className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl ${stat.shadow} transition-all duration-300 hover:-translate-y-1`}>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
              ) : (
                <>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg ${stat.shadow}`}>
                    <span className="text-white">{stat.icon}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions - Colorful cards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-orange-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            icon={<Code2 size={22} />}
            title="Manage Problems"
            description="Add and manage coding problems, DSA questions"
            gradient="from-primary-500 to-primary-600"
            shadow="shadow-brand"
            onClick={() => navigate('/admin/problems')}
          />
          <QuickActionCard
            icon={<Users size={22} />}
            title="Manage Users"
            description="View student accounts, roles, and activity"
            gradient="from-blue-500 to-indigo-500"
            shadow="shadow-blue-500/20"
            onClick={() => navigate('/admin/users')}
          />
          <QuickActionCard
            icon={<BarChart3 size={22} />}
            title="Analytics"
            description="Submission stats, progress reports & insights"
            gradient="from-emerald-500 to-teal-500"
            shadow="shadow-emerald-500/20"
            onClick={() => navigate('/admin/analytics')}
          />
          <QuickActionCard
            icon={<Brain size={22} />}
            title="Aptitude"
            description="Manage aptitude topics, chapters & questions"
            gradient="from-primary-500 to-brand-amber"
            shadow="shadow-brand"
            onClick={() => navigate('/admin/aptitude')}
          />
          <QuickActionCard
            icon={<Trophy size={22} />}
            title="Contests"
            description="Create and manage coding contests"
            gradient="from-violet-500 to-purple-500"
            shadow="shadow-violet-500/20"
            onClick={() => navigate('/admin/contests')}
          />
          <QuickActionCard
            icon={<Settings size={22} />}
            title="Settings"
            description="Platform configuration and preferences"
            gradient="from-gray-600 to-gray-700"
            shadow="shadow-gray-500/20"
            onClick={() => navigate('/admin/settings')}
          />
        </div>
      </motion.div>

      {/* Activity & Overview Row */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-brand">
                <Activity size={14} className="text-white" />
              </div>
              Recent Activity
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { text: 'New student registered', time: '2 min ago', gradient: 'from-green-400 to-emerald-500' },
              { text: 'Problem submission accepted', time: '15 min ago', gradient: 'from-blue-400 to-indigo-500' },
              { text: 'New coding problem added', time: '1 hr ago', gradient: 'from-purple-400 to-violet-500' },
              { text: 'Contest scheduled', time: '3 hrs ago', gradient: 'from-amber-400 to-orange-500' },
              { text: 'Aptitude questions seeded', time: '5 hrs ago', gradient: 'from-pink-400 to-rose-500' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.gradient} shrink-0 shadow-sm`} />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.text}</span>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Platform Overview */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-brand-amber flex items-center justify-center shadow-brand">
                <Brain size={14} className="text-white" />
              </div>
              Platform Overview
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Coding Arena Problems', value: stats?.totalProblems || 0, gradient: 'from-primary-500 to-primary-600', percent: 85 },
              { label: 'Placement Prep Questions', value: stats?.placementQuestions || 0, gradient: 'from-blue-500 to-indigo-500', percent: 60 },
              { label: 'Aptitude Questions', value: stats?.aptitudeQuestions || 0, gradient: 'from-emerald-500 to-teal-500', percent: 70 },
              { label: 'Active Contests', value: stats?.activeContests || 0, gradient: 'from-violet-500 to-purple-500', percent: 30 },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Quick Action Card - Colorful with gradient icon
function QuickActionCard({ icon, title, description, gradient, shadow, onClick }: {
  icon: React.ReactNode; title: string; description: string; gradient: string; shadow: string; onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl ${shadow} transition-all duration-300 text-left w-full`}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow} group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-white">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{description}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all shrink-0" />
    </motion.button>
  );
}
