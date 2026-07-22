import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  LayoutDashboard, BookOpen, Briefcase, Award, Users, Brain, Target,
  FileText, MessageSquare, GraduationCap, BarChart2, Settings, ChevronLeft,
  UserCheck, Building2, ClipboardList, TrendingUp, CreditCard, ShieldCheck, Code2, Trophy
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleSidebar } from '../../../features/ui/uiSlice';
import { selectUser } from '../../../features/auth/authSlice';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Resume Builder', href: '/student/resume', icon: FileText },
  { label: 'AI Features', href: '/student/ai', icon: Brain },
  { label: 'Certificates', href: '/student/certificates', icon: Award },
  { label: 'Coding Arena', href: '/student/challenges', icon: Code2 },
  { label: 'TCS NQT Prep', href: '/student/tcs-nqt', icon: Trophy },
  { label: 'Aptitude Prep', href: '/student/aptitude', icon: BookOpen },
  { label: 'Contests', href: '/student/contests', icon: Trophy },
  { label: 'My Profile', href: '/student/profile', icon: Users },
];

const TEACHER_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/teacher/courses', icon: BookOpen },
  { label: 'Students', href: '/teacher/students', icon: GraduationCap },
  { label: 'Earnings', href: '/teacher/earnings', icon: TrendingUp },
  { label: 'Analytics', href: '/teacher/analytics', icon: BarChart2 },
];

const RECRUITER_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/recruiter/dashboard', icon: LayoutDashboard },
  { label: 'Post Jobs', href: '/recruiter/jobs', icon: Briefcase },
  { label: 'Candidates', href: '/recruiter/candidates', icon: Users },
  { label: 'Applications', href: '/recruiter/applications', icon: ClipboardList },
  { label: 'Company Profile', href: '/recruiter/company', icon: Building2 },
];

const MENTOR_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/mentor/dashboard', icon: LayoutDashboard },
  { label: 'Sessions', href: '/mentor/sessions', icon: UserCheck },
  { label: 'Mentees', href: '/mentor/mentees', icon: Users },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Security', href: '/admin/security', icon: ShieldCheck },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const NAV_MAP: Record<string, NavItem[]> = {
  student: STUDENT_NAV,
  teacher: TEACHER_NAV,
  recruiter: RECRUITER_NAV,
  mentor: MENTOR_NAV,
  admin: ADMIN_NAV,
  superadmin: ADMIN_NAV,
};

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const user = useAppSelector(selectUser);
  const navItems = NAV_MAP[user?.role ?? 'student'] ?? STUDENT_NAV;

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        className="hidden md:flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 overflow-hidden flex-shrink-0 relative"
      >


        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-thin">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                )
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
              )}
              {item.badge && sidebarOpen && (
                <span className="ml-auto text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full px-1.5 py-0.5">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <motion.span animate={{ rotate: sidebarOpen ? 0 : 180 }}>
            <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
          </motion.span>
        </button>
      </motion.aside>
    </AnimatePresence>
  );
}
