import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '../../shared/hooks/hooks';
import { selectUserRole } from '../../features/auth/authSlice';
import DashboardLayout from '../../shared/components/DashboardLayout/DashboardLayout';

type UserRole = 'student' | 'teacher' | 'mentor' | 'recruiter' | 'admin' | 'superadmin';

interface RoleRouteProps {
  roles: UserRole[];
}

export default function RoleRoute({ roles }: RoleRouteProps) {
  const userRole = useAppSelector(selectUserRole) as UserRole | undefined;

  if (!userRole) return <Navigate to="/login" replace />;

  if (userRole === 'superadmin') {
    return <DashboardLayout><Outlet /></DashboardLayout>;
  }

  if (!roles.includes(userRole)) {
    const redirectMap: Record<UserRole, string> = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      mentor: '/mentor/dashboard',
      recruiter: '/recruiter/dashboard',
      admin: '/admin',
      superadmin: '/admin',
    };
    return <Navigate to={redirectMap[userRole] ?? '/'} replace />;
  }

  return <DashboardLayout><Outlet /></DashboardLayout>;
}
