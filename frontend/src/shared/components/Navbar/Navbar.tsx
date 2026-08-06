import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Bell, LogOut, User, LayoutDashboard, CheckCheck, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { selectUser, selectIsAuthenticated, logoutThunk } from '../../../features/auth/authSlice';
import { toggleDarkMode, toggleSidebar, setMobileSidebar } from '../../../features/ui/uiSlice';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../core/services/api';
import Avatar from '../Avatar/Avatar';
import Badge from '../Badge/Badge';
import toast from 'react-hot-toast';

const PUBLIC_NAV_LINKS: { label: string; href: string }[] = [];

const AUTH_NAV_LINKS: { label: string; href: string }[] = [];

const DASHBOARD_LINKS: Record<string, string> = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  mentor: '/mentor/dashboard',
  recruiter: '/recruiter/dashboard',
  admin: '/admin',
  superadmin: '/admin',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const mobileSidebarOpen = useAppSelector((s) => s.ui.mobileSidebarOpen);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch unread notifications
  const { data: notifData } = useQuery({
    queryKey: ['navNotifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications?unread=true&limit=8');
      return data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // refresh every 30s
  });

  const notifications: any[] = notifData?.data ?? [];
  const unreadCount: number = notifData?.unreadCount ?? 0;

  // Close notif dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      queryClient.invalidateQueries({ queryKey: ['navNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      // silent fail
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    toast.success('Logged out successfully', {
      position: 'top-center',
      style: {
        padding: '16px 24px',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
      },
    });
    navigate('/');
  };

  const dashboardPath = user ? (DASHBOARD_LINKS[user.role] ?? '/') : '/';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-[60px]">

          {/* Left Side: Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle */}
            <button
              id="desktop-hamburger"
              onClick={() => {
                if (window.innerWidth >= 768 && isAuthenticated) {
                  dispatch(toggleSidebar());
                } else if (isAuthenticated) {
                  dispatch(setMobileSidebar(!mobileSidebarOpen));
                } else {
                  setMobileOpen(!mobileOpen);
                }
              }}
              className="md:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {(!isAuthenticated && mobileOpen) ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img
                src="/logo.svg"
                alt="ADYAPAN"
                className="w-9 h-9 rounded-full shadow-sm object-cover"
              />
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
                ADYAPAN
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {(isAuthenticated ? AUTH_NAV_LINKS : PUBLIC_NAV_LINKS).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Dark Mode */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && user ? (
              <>
                <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(o => !o)}
                    className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white dark:border-gray-950" />
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              className="flex items-center gap-1 text-[10px] text-primary-500 hover:text-primary-600 font-semibold transition-colors"
                            >
                              <CheckCheck className="w-3 h-3" /> Mark all read
                            </button>
                          )}
                        </div>

                        {/* List */}
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <Bell className="w-8 h-8 text-gray-200 dark:text-gray-700 mb-2" />
                              <p className="text-xs text-gray-400">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map((n: any) => (
                              <div
                                key={n._id}
                                className={`px-4 py-3 border-b border-gray-50 dark:border-gray-800/60 last:border-none transition-colors ${
                                  !n.isRead ? 'bg-primary-50/60 dark:bg-primary-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />}
                                  <div className={`flex-1 min-w-0 ${n.isRead ? 'pl-4' : ''}`}>
                                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug">{n.title}</p>
                                    {n.message && <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>}
                                    <p className="text-[10px] text-gray-400 mt-1">
                                      {new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800">
                            <Link
                              to="/student/dashboard"
                              onClick={() => setNotifOpen(false)}
                              className="text-xs text-primary-500 hover:text-primary-600 font-semibold"
                            >
                              View all notifications →
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center p-1 rounded-2xl hover:ring-2 hover:ring-gray-200 dark:hover:ring-gray-700 transition-all focus:outline-none"
                  >
                    <Avatar 
                      src={user.avatar} 
                      firstName={user.firstName} 
                      lastName={user.lastName} 
                      size="sm" 
                      className="!rounded-xl" 
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 z-50"
                      >
                        <div className="px-3 py-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          <Badge variant="primary" className="mt-1 capitalize">{user.role}</Badge>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                          <Link
                            to={dashboardPath}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link
                            to="/student/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4" /> My Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/get-started"
                  className="btn-primary !py-2 !px-4 !text-sm"
                >
                  Get Started Free
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Menu (Public Only) */}
      <AnimatePresence>
        {mobileOpen && !isAuthenticated && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {PUBLIC_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full text-center">
                  Log in
                </Link>
                <Link to="/get-started" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center">
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
