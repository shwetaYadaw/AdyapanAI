import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, DollarSign, Award, BarChart2, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import { formatNumber, formatPrice } from '@adyapan/shared';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: overview } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/overview'); return data.data; },
  });

  const { data: revenue } = useQuery({
    queryKey: ['adminRevenue'],
    queryFn: async () => { const { data } = await api.get('/admin/analytics/revenue?days=30'); return data.data; },
  });

  const stats = [
    { label: 'Total Users', value: overview?.totalUsers ?? 0, icon: Users, color: 'from-primary-500 to-blue-400', change: '+12%' },
    { label: 'Active Students', value: overview?.activeStudents ?? 0, icon: BookOpen, color: 'from-green-500 to-emerald-400', change: '+8%' },
    { label: 'Total Revenue', value: `₹${formatNumber(overview?.totalRevenue ?? 0)}`, icon: DollarSign, color: 'from-purple-500 to-violet-400', change: '+23%' },
    { label: 'Courses', value: overview?.publishedCourses ?? 0, icon: BarChart2, color: 'from-orange-500 to-amber-400', change: '+5%' },
    { label: 'Enrollments', value: formatNumber(overview?.totalEnrollments ?? 0), icon: TrendingUp, color: 'from-cyan-500 to-teal-400', change: '+18%' },
    { label: 'Completion Rate', value: `${overview?.completionRate ?? 0}%`, icon: Award, color: 'from-pink-500 to-rose-400', change: '+2%' },
  ];

  return (
    <div className="page-wrapper space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Platform overview and analytics</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          System Healthy
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change} this month</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue (Last 30 days)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenue ?? []}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#colorRevenue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
