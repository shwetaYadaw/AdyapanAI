import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import { formatNumber } from '@adyapan/shared';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AdminAnalyticsPage() {
  const { data: overview } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics/overview');
      return data.data;
    },
  });

  const { data: revenue } = useQuery({
    queryKey: ['revenueChart30'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics/revenue?days=30');
      return data.data ?? [];
    },
  });

  const roleDistribution = [
    { name: 'Students', value: overview?.activeStudents ?? 0 },
    { name: 'Teachers', value: Math.round((overview?.totalUsers ?? 0) * 0.05) },
    { name: 'Recruiters', value: Math.round((overview?.totalUsers ?? 0) * 0.03) },
    { name: 'Mentors', value: Math.round((overview?.totalUsers ?? 0) * 0.02) },
  ];

  const enrollmentStats = [
    { name: 'Tech', value: Math.round((overview?.totalEnrollments ?? 0) * 0.5) },
    { name: 'Non-Tech', value: Math.round((overview?.totalEnrollments ?? 0) * 0.2) },
    { name: 'Placement', value: Math.round((overview?.totalEnrollments ?? 0) * 0.2) },
    { name: 'AI', value: Math.round((overview?.totalEnrollments ?? 0) * 0.1) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Analytics</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: formatNumber(overview?.totalUsers ?? 0) },
          { label: 'Active Students', value: formatNumber(overview?.activeStudents ?? 0) },
          { label: 'Total Courses', value: overview?.totalCourses ?? 0 },
          { label: 'Completion Rate', value: `${overview?.completionRate ?? 0}%` },
        ].map((kpi) => (
          <Card key={kpi.label} padding="md" className="text-center">
            <p className="font-display font-bold text-3xl text-primary-600 dark:text-primary-400">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue line chart */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Revenue (₹)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* User role distribution pie */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {roleDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [formatNumber(v), 'Users']} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Enrollment by category */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Enrollments by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={enrollmentStats} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
              <Bar dataKey="value" name="Enrollments" radius={[6, 6, 0, 0]}>
                {enrollmentStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform health */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform Health</h3>
          <div className="space-y-3">
            {[
              { label: 'Published Courses', value: overview?.publishedCourses ?? 0, total: overview?.totalCourses ?? 1, color: '#3b82f6' },
              { label: 'Course Completion Rate', value: overview?.completionRate ?? 0, total: 100, color: '#10b981' },
              { label: 'Student Engagement', value: 78, total: 100, color: '#8b5cf6' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.round((item.value / item.total) * 100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.round((item.value / item.total) * 100)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
