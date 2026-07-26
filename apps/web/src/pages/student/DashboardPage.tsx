import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen, Target, Award, TrendingUp, Brain, Briefcase,
  ArrowRight, Flame, Zap, Clock
} from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/authSlice';
import { api } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import ProgressBar from '../../components/common/ProgressBar/ProgressBar';
import Avatar from '../../components/common/Avatar/Avatar';
import { formatRelativeTime, formatCourseDuration } from '@adyapan/shared';

export default function StudentDashboard() {
  const user = useAppSelector(selectUser);

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const { data } = await api.get('/enrollments/my-courses');
      return data.data;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => {
      const { data } = await api.get('/students/profile');
      return data.data;
    },
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications?unread=true');
      return data;
    },
  });

  const stats = [
    { label: 'Courses Enrolled', value: enrollments?.length ?? 0, icon: BookOpen, color: 'from-primary-500 to-blue-400', href: '/courses' },
    { label: 'XP Points', value: profile?.totalXP ?? 0, icon: Zap, color: 'from-yellow-500 to-amber-400', href: '/student/profile' },
    { label: 'Certificates', value: 0, icon: Award, color: 'from-purple-500 to-violet-400', href: '/student/certificates' },
    { label: 'Day Streak', value: profile?.streak ?? 0, icon: Flame, color: 'from-orange-500 to-red-400', href: '/student/profile' },
  ];

  const QUICK_LINKS = [
    { label: 'Mock Interview', icon: Target, href: '/student/placement', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { label: 'Resume Builder', icon: BookOpen, href: '/student/resume', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'AI Tutor', icon: Brain, href: '/student/ai', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
    { label: 'Browse Jobs', icon: Briefcase, href: '/student/jobs', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  ];

  const inProgress = enrollments?.filter((e: { progress: number; isCompleted: boolean }) => e.progress > 0 && !e.isCompleted) ?? [];

  return (
    <div className="page-wrapper">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Avatar src={user?.avatar} firstName={user?.firstName} lastName={user?.lastName} size="lg" ring />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link to={stat.href}>
              <Card hover padding="md">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Continue Learning</h2>
            <Link to="/courses" className="text-sm text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {inProgress.length === 0 ? (
            <Card padding="lg" className="text-center">
              <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">No courses in progress</p>
              <Link to="/courses" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                Browse courses →
              </Link>
            </Card>
          ) : (
            inProgress.slice(0, 3).map((enrollment: { courseId: { _id: string; title: string; thumbnail: string; totalDuration: number }; progress: number; lastAccessedAt: string }) => (
              <Card key={enrollment.courseId._id} hover padding="md">
                <div className="flex gap-4">
                  <img
                    src={enrollment.courseId.thumbnail}
                    alt={enrollment.courseId.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {enrollment.courseId.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {formatCourseDuration(enrollment.courseId.totalDuration)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        Updated {formatRelativeTime(enrollment.lastAccessedAt)}
                      </span>
                    </div>
                    <ProgressBar value={enrollment.progress} showPercent size="xs" />
                  </div>
                  <Link
                    to={`/student/learn/${enrollment.courseId._id}`}
                    className="btn-primary !py-1.5 !px-3 !text-xs self-center flex-shrink-0"
                  >
                    Resume
                  </Link>
                </div>
              </Card>
            ))
          )}

          {/* Quick Links */}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_LINKS.map((ql) => (
                <Link key={ql.label} to={ql.href}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`${ql.bg} rounded-2xl p-4 text-center cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all`}
                  >
                    <ql.icon className={`w-6 h-6 ${ql.color} mx-auto mb-2`} />
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{ql.label}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Placement status */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Placement Status</h3>
              <Badge variant={
                profile?.placementStatus === 'placed' ? 'success' :
                profile?.placementStatus === 'in_progress' ? 'warning' : 'gray'
              } dot>
                {profile?.placementStatus?.replace('_', ' ') ?? 'Not started'}
              </Badge>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Resume Ready', done: !!profile?.resumeUrl },
                { label: 'ATS Score >70', done: (profile?.atsScore ?? 0) > 70 },
                { label: 'Profile Complete', done: !!(profile?.headline && profile?.skills?.length > 0) },
                { label: 'Mock Interview Done', done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {item.done && <span className="text-white text-xs">✓</span>}
                  </span>
                  <span className={item.done ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/student/placement" className="btn-primary w-full text-center mt-4 !text-xs !py-2">
              Continue Prep
            </Link>
          </Card>

          {/* Notifications */}
          <Card padding="md">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
              Notifications
              {notifications?.unreadCount > 0 && (
                <Badge variant="danger" className="ml-2">{notifications.unreadCount}</Badge>
              )}
            </h3>
            {notifications?.data?.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">All caught up!</p>
            ) : (
              <div className="space-y-2">
                {notifications?.data?.slice(0, 4).map((n: { _id: string; title: string; message: string; isRead: boolean; createdAt: string }) => (
                  <div key={n._id} className={`p-2.5 rounded-xl ${!n.isRead ? 'bg-primary-50 dark:bg-primary-950/30' : ''}`}>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
