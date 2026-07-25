import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Bell, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser, selectIsAuthenticated, logoutThunk } from '../../../features/auth/authSlice';
import { toggleDarkMode } from '../../../features/ui/uiSlice';
import { api } from '../../../services/api';
import Avatar from '../../common/Avatar/Avatar';
import Badge from '../../common/Badge/Badge';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { label: 'Placement', href: '/student/placement' },
];

const DASHBOARD_LINKS: Record<string, string> = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  mentor: '/mentor/dashboard',
  recruiter: '/recruiter/dashboard',
  admin: '/admin/dashboard',
  superadmin: '/admin/dashboard',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const navigate = useNavigate();

  // Fetch notifications
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications?unread=true');
      return data.data ?? data;
    },
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const dashboardPath = user ? (DASHBOARD_LINKS[user.role] ?? '/') : '/';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
      <div className="px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-14 xs:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 xs:gap-2 flex-shrink-0">
            <div className="w-8 xs:w-9 h-8 xs:h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-display font-bold text-xs xs:text-sm leading-none">ady.</span>
            </div>
            <span className="font-display font-bold text-base xs:text-lg text-gray-900 dark:text-white hidden xs:block">
              ADYAPAN
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 md:gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-2.5 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1 xs:gap-1.5">
            {/* Dark Mode */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-1.5 xs:p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-1.5 xs:p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications?.unreadCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-2 xs:w-2.5 h-2 xs:h-2.5 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{Math.min(notifications.unreadCount, 9)}</span>
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-50"
                      >
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                            Notifications {notifications?.unreadCount > 0 && <Badge variant="danger" className="ml-2 text-xs">{notifications.unreadCount}</Badge>}
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {notifications?.data?.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-4 px-4">No notifications</p>
                          ) : (
                            notifications?.data?.slice(0, 8).map((n: { _id: string; title: string; message?: string; isRead: boolean; createdAt: string }) => (
                              <div key={n._id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${!n.isRead ? 'bg-primary-50 dark:bg-primary-950/30' : ''}`}>
                                <div className="flex items-start gap-2">
                                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1" />}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{n.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message || 'New notification'}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1 xs:gap-2 p-1 pr-1.5 xs:pr-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Avatar src={user.avatar} firstName={user.firstName} lastName={user.lastName} size="sm" ring={false} />
                    <span className="hidden sm:block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                      {user.firstName}
                    </span>
                    <ChevronDown className="w-3 h-3 xs:w-3.5 text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 xs:w-52 md:w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 z-50"
                      >
                        <div className="px-3 py-2 mb-1">
                          <p className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          <Badge variant="primary" className="mt-1 capitalize text-xs">{user.role}</Badge>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                          <Link
                            to={dashboardPath}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 flex-shrink-0" /> Dashboard
                          </Link>
                          <Link
                            to="/student/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4 flex-shrink-0" /> My Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs md:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4 flex-shrink-0" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden xs:flex items-center gap-1 xs:gap-2 md:gap-3">
                <Link
                  to="/login"
                  className="px-2.5 xs:px-3 md:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !py-1.5 xs:!py-2 !px-2.5 xs:!px-3 md:!px-4 !text-xs xs:!text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 xs:p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
          >
            <div className="px-2 xs:px-3 sm:px-4 py-3 xs:py-4 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-2 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full text-center !text-xs md:!text-sm">
                    Sign in
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center !text-xs md:!text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
