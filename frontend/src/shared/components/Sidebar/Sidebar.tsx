import { useCallback, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  LayoutDashboard, BookOpen, Award, Users, 
  BarChart2, Settings, Code2, Trophy, X, Briefcase, Brain
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setMobileSidebar, setSidebarOpen } from '../../../features/ui/uiSlice';
import { selectUser } from '../../../features/auth/authSlice';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  color?: string;
}

const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard',      href: '/student/dashboard',      icon: LayoutDashboard, color: 'text-primary-400' },
  { label: 'DSA',            href: '/student/challenges',     icon: Code2, color: 'text-blue-400' },
  { label: 'Placement Prep', href: '/student/tcs-nqt',        icon: Trophy, color: 'text-amber-400' },
  { label: 'Aptitude',       href: '/student/aptitude',       icon: BookOpen, color: 'text-primary-400' },
  { label: 'Contests',       href: '/student/contests',       icon: Trophy, color: 'text-emerald-400' },
  { label: 'Certificates',   href: '/student/certificates',   icon: Award, color: 'text-pink-400' },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, color: 'text-primary-400' },
  { label: 'Users', href: '/admin/users', icon: Users, color: 'text-cyan-400' },
  { label: 'Courses', href: '/admin/courses', icon: Briefcase, color: 'text-blue-400' },
  { label: 'DSA', href: '/admin/problems', icon: Code2, color: 'text-violet-400' },
  { label: 'Aptitude', href: '/admin/aptitude', icon: Brain, color: 'text-primary-400' },
  { label: 'Contests', href: '/admin/contests', icon: Trophy, color: 'text-amber-400' },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2, color: 'text-emerald-400' },
  { label: 'Settings', href: '/admin/settings', icon: Settings, color: 'text-gray-400' },
];

export const NAV_MAP: Record<string, NavItem[]> = {
  student: STUDENT_NAV,
  admin: ADMIN_NAV,
};

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const mobileSidebarOpen = useAppSelector((s) => s.ui.mobileSidebarOpen);
  const user = useAppSelector(selectUser);
  const navItems = NAV_MAP[user?.role ?? 'student'] ?? STUDENT_NAV;
  
  const desktopSidebarRef = useRef<HTMLElement>(null);

  const closeMobileSidebar = useCallback(() => {
    dispatch(setMobileSidebar(false));
  }, [dispatch]);

  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname, closeMobileSidebar]);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileSidebar}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="md:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col h-full bg-white dark:bg-gray-900 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden border-r border-gray-200 dark:border-gray-800"
          >
            {/* Logo Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-brand">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-lg text-primary-400">ADYAPAN</span>
              </div>
              <button
                onClick={closeMobileSidebar}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={clsx('w-5 h-5 flex-shrink-0', isActive ? 'text-primary-400' : item.color || 'text-gray-500')} />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom branding */}
            <div className="px-5 py-3 border-t border-gray-800/50">
              <p className="text-[10px] text-gray-600 font-medium">Powered by Adyapan AI</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        ref={desktopSidebarRef}
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        className="hidden md:flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden flex-shrink-0 relative border-r border-gray-200 dark:border-gray-800"
      >
        {/* Logo area */}
        {sidebarOpen && (
          <div className="px-5 py-4 border-b border-gray-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-brand">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-base text-primary-400">ADYAPAN</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                )
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={clsx('w-5 h-5 flex-shrink-0 transition-colors', isActive ? 'text-primary-400' : item.color || 'text-gray-500')} />
                  {sidebarOpen && (
                    <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
                  )}
                  {item.badge && sidebarOpen && (
                    <span className="ml-auto text-xs bg-primary-600/30 text-primary-300 rounded-full px-1.5 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom accent line */}
        <div className="h-0.5 bg-gradient-to-r from-primary-600 via-primary-500 to-brand-amber" />
      </motion.aside>
    </>
  );
}


