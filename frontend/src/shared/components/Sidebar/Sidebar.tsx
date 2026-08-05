import { useCallback, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  LayoutDashboard, BookOpen, Award, Users, 
  BarChart2, Settings, Code2, Trophy, X
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
  { label: 'Dashboard',    href: '/student/dashboard',  icon: LayoutDashboard },
  { label: 'Certificates', href: '/student/certificates', icon: Award },
  { label: 'Coding Arena', href: '/student/challenges',  icon: Code2 },
  { label: 'Placement Prep', href: '/student/tcs-nqt',    icon: Trophy },
  { label: 'Aptitude Prep',href: '/student/aptitude',   icon: BookOpen },
  { label: 'Contests',     href: '/student/contests',   icon: Trophy },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Problems', href: '/admin/problems', icon: Code2 },
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
  
  const desktopSidebarRef = useRef<HTMLElement>(null);

  const closeMobileSidebar = useCallback(() => {
    dispatch(setMobileSidebar(false));
  }, [dispatch]);

  // Auto-close both drawers/sidebars when route changes
  useEffect(() => {
    closeMobileSidebar();
    dispatch(setSidebarOpen(false));
  }, [location.pathname, closeMobileSidebar, dispatch]);

  // Auto-close desktop sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Only process outside click on desktop
      if (window.innerWidth < 768) return;

      const target = e.target as Element;
      // If clicking outside the desktop sidebar AND not clicking the hamburger menu
      if (
        sidebarOpen &&
        desktopSidebarRef.current &&
        !desktopSidebarRef.current.contains(target as Node) &&
        !target.closest('#desktop-hamburger')
      ) {
        dispatch(setSidebarOpen(false));
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, dispatch]);

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
            className="md:hidden fixed inset-0 z-40 bg-black/50"
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
              className="md:hidden fixed inset-y-0 left-0 z-50 w-64 max-w-sm flex flex-col h-full bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
            >
              {/* Logo/Header for Mobile */}
              <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.svg" alt="ADYAPAN" className="w-8 h-8 rounded-full" />
                  <span className="font-bold text-lg dark:text-white">ADYAPAN</span>
                </div>
                <button
                  onClick={closeMobileSidebar}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav 
                className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin"
              >
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                      )
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full px-1.5 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
          ref={desktopSidebarRef}
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
                onClick={() => dispatch(setSidebarOpen(false))}
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
        </motion.aside>
    </>
  );
}
