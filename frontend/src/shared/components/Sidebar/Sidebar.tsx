import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  LayoutDashboard, BookOpen, Award, Users,
  BarChart2, Settings, Code2, Trophy, X, Briefcase, Menu, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setMobileSidebar, setSidebarOpen } from '../../../features/ui/uiSlice';
import { selectUser } from '../../../features/auth/authSlice';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'My Course', href: '/student/select-course', icon: Briefcase },
  { label: 'Certificates', href: '/student/certificates', icon: Award },
  { label: 'Coding Arena', href: '/student/challenges', icon: Code2 },
  { label: 'Placement Prep', href: '/student/tcs-nqt', icon: Trophy },
  { label: 'Aptitude Prep', href: '/student/aptitude', icon: BookOpen },
  { label: 'Contests', href: '/student/contests', icon: Trophy },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Problems', href: '/admin/problems', icon: Code2 },
  { label: 'Aptitude', href: '/admin/aptitude', icon: BookOpen },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
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

  const closeMobileSidebar = useCallback(() => {
    dispatch(setMobileSidebar(false));
  }, [dispatch]);

  // Auto-close mobile sidebar when route changes
  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname, closeMobileSidebar]);

  return (
    <>
      {/* Mobile Sidebar (Portal) */}
      {typeof window !== 'undefined' && createPortal(
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
                className="md:hidden fixed inset-0 z-[9998] bg-gray-900/40 backdrop-blur-sm"
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
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden fixed inset-y-0 left-0 z-[9999] w-72 flex flex-col h-full bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border-r border-gray-100 dark:border-gray-800"
              >
                {/* Logo/Header for Mobile */}
                <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-gray-800 shrink-0">
                  <div className="flex items-center gap-3">
                    <img src="/logo.svg" alt="ADYAPAN" className="w-8 h-8 rounded-xl shadow-sm" />
                    <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">ADYAPAN</span>
                  </div>
                  <button
                    onClick={closeMobileSidebar}
                    className="p-2 -mr-2 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-none">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm shadow-primary-100/50 dark:shadow-none'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                        )
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] font-bold bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full px-2 py-0.5">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </motion.aside>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}

      {/* Desktop Sidebar (Persistent, Collapsible) */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-shrink-0 relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
      >
        <div className={clsx("flex items-center h-[60px] border-b border-gray-100 dark:border-gray-800 flex-shrink-0 transition-all", sidebarOpen ? "px-4" : "justify-center")}>
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden flex-shrink-0">
            <img src="/logo.svg" alt="ADYAPAN" className="w-8 h-8 rounded-full shadow-sm object-cover shrink-0" />
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="font-display font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap">
                  ADYAPAN
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              title={!sidebarOpen ? item.label : undefined}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm shadow-primary-100/50 dark:shadow-none'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                )
              }
            >
              <item.icon className={clsx(
                "w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200",
                !sidebarOpen && "mx-auto"
              )} />

              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {item.badge && sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="ml-auto text-[10px] font-bold bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full px-2 py-0.5"
                >
                  {item.badge}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Floating Toggle Button */}
        <button
          onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
          className="absolute top-[60px] -translate-y-1/2 -right-3.5 flex items-center justify-center w-7 h-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 rounded-full shadow-md z-40 transition-colors focus:outline-none"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </motion.aside>
    </>
  );
}
