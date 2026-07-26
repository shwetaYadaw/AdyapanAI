import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, Star, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Avatar from '../../components/common/Avatar/Avatar';
import { formatRelativeTime } from '@adyapan/shared';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/authSlice';

export default function MentorDashboard() {
  const user = useAppSelector(selectUser);
  const { data: sessions } = useQuery({
    queryKey: ['mentorSessions'],
    queryFn: async () => { const { data } = await api.get('/mentors/sessions/my-sessions'); return data.data; },
  });

  const upcoming = (sessions ?? []).filter((s: { status: string }) => s.status === 'scheduled');
  const completed = (sessions ?? []).filter((s: { status: string }) => s.status === 'completed');

  const stats = [
    { label: 'Upcoming Sessions', value: upcoming.length, icon: Calendar, color: 'from-primary-500 to-blue-400' },
    { label: 'Total Sessions', value: (sessions ?? []).length, icon: Users, color: 'from-green-500 to-emerald-400' },
    { label: 'Avg Rating', value: '4.9', icon: Star, color: 'from-yellow-500 to-amber-400' },
    { label: 'This Month Earnings', value: '₹0', icon: TrendingUp, color: 'from-purple-500 to-violet-400' },
  ];

  return (
    <div className="page-wrapper space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Mentor Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome, {user?.firstName}</p>
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
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Upcoming Sessions</h2>
        {upcoming.length === 0 ? <p className="text-gray-400 text-sm">No upcoming sessions</p> : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map((s: { _id: string; studentId: { firstName: string; lastName: string; avatar: string }; topic: string; scheduledAt: string; duration: number }) => (
              <div key={s._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Avatar src={s.studentId?.avatar} firstName={s.studentId?.firstName} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{s.studentId?.firstName} {s.studentId?.lastName}</p>
                  <p className="text-xs text-gray-500">{s.topic} • {s.duration} min</p>
                </div>
                <Badge variant="primary">{formatRelativeTime(s.scheduledAt)}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
