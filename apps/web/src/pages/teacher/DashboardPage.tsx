import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, TrendingUp, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/authSlice';

export default function TeacherDashboard() {
  const user = useAppSelector(selectUser);
  const { data: courses } = useQuery({
    queryKey: ['teacherCourses'],
    queryFn: async () => { const { data } = await api.get('/courses?instructor=me'); return data.data; },
  });

  const stats = [
    { label: 'My Courses', value: courses?.length ?? 0, icon: BookOpen, color: 'from-primary-500 to-blue-400' },
    { label: 'Total Students', value: courses?.reduce((a: number, c: { enrollmentCount: number }) => a + (c.enrollmentCount ?? 0), 0) ?? 0, icon: Users, color: 'from-green-500 to-emerald-400' },
    { label: 'Avg Rating', value: '4.8', icon: Star, color: 'from-yellow-500 to-amber-400' },
    { label: 'Monthly Earnings', value: '₹12,400', icon: TrendingUp, color: 'from-purple-500 to-violet-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Teacher Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome, {user?.firstName}</p>
        </div>
        <Link to="/teacher/courses/new"><Button leftIcon={<Plus className="w-4 h-4" />}>New Course</Button></Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} padding="md">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5 text-white" /></div>
            <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>
      <Card padding="md">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">My Courses</h2>
        {(courses ?? []).length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">You haven't created any courses yet</p>
            <Link to="/teacher/courses/new"><Button>Create Your First Course</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {(courses ?? []).slice(0, 5).map((c: { _id: string; title: string; enrollmentCount: number; rating: number; isPublished: boolean; isApproved: boolean }) => (
              <div key={c._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.enrollmentCount} students • ⭐ {c.rating?.toFixed(1)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {c.isApproved ? 'Published' : 'Pending'}
                  </span>
                  <Link to={`/teacher/courses/${c._id}/edit`} className="text-xs text-primary-600 hover:underline">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
