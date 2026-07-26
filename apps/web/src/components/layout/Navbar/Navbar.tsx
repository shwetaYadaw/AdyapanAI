import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Bell, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser, selectIsAuthenticated, logoutThunk } from '../../../features/auth/authSlice';
import { toggleDarkMode } from '../../../features/ui/uiSlice';
import Avatar from '../../common/Avatar/Avatar';
import Badge from '../../common/Badge/Badge';
import toast from 'react-hot-toast';

const ORANGE = '#E85D04';
const AMBER  = '#F48C06';

const STUDENT_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/student/dashboard' },
  { label: 'Resume Builder', href: '/student/resume-builder' },
  { label: 'AI Features', href: '/student/ai-features' },
  { label: 'Certificates', href: '/student/certificates' },
  { label: 'Coding Arena', href: '/student/coding-arena' },
  { label: 'TCS NQT Prep', href: '/student/tcs-nqt-prep' },
  { label: 'Aptitude Prep', href: '/student/aptitude-prep' },
  { label: 'Contests', href: '/student/contests' },
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
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const dashboardPath = user ? (DASHBOARD_LINKS[user.role] ?? '/') : '/';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-display font-bold text-sm leading-none">ady.</span>
            </div>
            <span className="font-display font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
              ADYAPAN
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {STUDENT_NAV_LINKS.map((link) => {
              // Show Home link only if NOT authenticated
              if (link.label === 'Home') {
                return isAuthenticated ? null : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all"
                  >
                    {link.label}
                  </Link>
                );
              }
              // Show other links only if authenticated
              if (isAuthenticated) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all"
                  >
                    {link.label}
                  </Link>
                );
              }
              return null;
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Dark Mode */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Avatar src={user.avatar} firstName={user.firstName} lastName={user.lastName} size="sm" />
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.firstName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
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
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !py-2 !px-4 !text-sm"
                >
                  Get Started Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
            <div className="px-4 py-4 space-y-1">
              {STUDENT_NAV_LINKS.map((link) => {
                // Show Home link only if NOT authenticated
                if (link.label === 'Home') {
                  return isAuthenticated ? null : (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {link.label}
                    </Link>
                  );
                }
                // Show other links only if authenticated
                if (isAuthenticated) {
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {link.label}
                    </Link>
                  );
                }
                return null;
              })}
              {!isAuthenticated && (
                <div className="pt-2 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full text-center">
                    Sign in
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center">
                    Get Started Free
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
