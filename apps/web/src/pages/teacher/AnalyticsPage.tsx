import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Table from '../../components/common/Table/Table';
import { Users, Star, BookOpen, Clock, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: courses } = useQuery({
    queryKey: ['teacherCourses'],
    queryFn: async () => {
      const { data } = await api.get('/courses?instructor=me');
      return data.data ?? [];
    },
  });

  const totalEnrollments = courses?.reduce((a: number, c: { enrollmentCount: number }) => a + (c.enrollmentCount ?? 0), 0) ?? 0;
  
  const columns: any[] = [
    { key: 'title', header: 'Course', render: (r: { title: string }) => <span className="font-medium text-sm">{r.title}</span> },
    { key: 'enrollmentCount', header: 'Total Students' },
    { key: 'rating', header: 'Avg Rating', render: (r: { rating: number }) => <span>⭐ {r.rating?.toFixed(1) || 'N/A'}</span> },
    { key: 'category', header: 'Category', render: (r: { category: string }) => <span className="capitalize">{r.category}</span> },
  ];

  return (
    <div className="page-wrapper space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Analytics Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Deep dive into student engagement, course performance, and learning metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Students</p>
              <p className="font-display font-bold text-xl text-gray-900 dark:text-white">{totalEnrollments}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-400 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Instructor Rating</p>
              <p className="font-display font-bold text-xl text-gray-900 dark:text-white">4.8 / 5.0</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Courses</p>
              <p className="font-display font-bold text-xl text-gray-900 dark:text-white">{courses?.length ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Hours Taught</p>
              <p className="font-display font-bold text-xl text-gray-900 dark:text-white">420 Hrs</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padding="md">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Course Performance</h2>
            <Table
              columns={columns}
              data={courses ?? []}
              keyExtractor={(r: { _id: string }) => r._id}
              emptyMessage="No course analytics available."
            />
          </Card>
        </div>

        <div>
          <Card padding="md">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Engagement Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">76%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Avg Watch Time</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">45 min / day</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Positive Feedback</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">92%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
