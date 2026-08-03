import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../core/services/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
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

  return (
    <div className="page-wrapper space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Welcome to Adyapan Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { 
            label: 'Total Users', 
            value: stats?.totalStudents || 0, 
            color: 'from-orange-500 to-orange-600',
            icon: '👥'
          },
          { 
            label: 'Coding Problems', 
            value: stats?.totalProblems || 0, 
            color: 'from-blue-500 to-blue-600',
            icon: '💻'
          },
          { 
            label: 'Total Submissions', 
            value: stats?.totalSubmissions || 0, 
            color: 'from-green-500 to-green-600',
            icon: '📝'
          },
          { 
            label: 'Submissions Today', 
            value: stats?.submissionsToday || 0, 
            color: 'from-purple-500 to-purple-600',
            icon: '📊'
          },
        ].map((stat) => (
          <div 
            key={stat.label}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{stat.icon}</span>
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {stat.value}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </h3>
          </div>
        ))}
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-gray-500 dark:text-gray-400">
            Activity feed coming soon...
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <button
          onClick={() => navigate('/admin/users')}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all hover:border-primary-500 dark:hover:border-primary-500 text-left group"
        >
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            Manage Users
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage student accounts
          </p>
        </button>

        <button
          onClick={() => navigate('/admin/analytics')}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all hover:border-primary-500 dark:hover:border-primary-500 text-left group"
        >
          <div className="text-3xl mb-3">💻</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            Coding Problems
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage DSA problems and test cases
          </p>
        </button>

        <button
          onClick={() => navigate('/admin/analytics')}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all hover:border-primary-500 dark:hover:border-primary-500 text-left group"
        >
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            Submissions & Analytics
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View submission stats and user progress
          </p>
        </button>
      </div>
    </div>
  );
}
