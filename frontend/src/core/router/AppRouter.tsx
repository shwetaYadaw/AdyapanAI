import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import PageLoader from '../../shared/components/Loader/PageLoader';

// Lazy-loaded pages
const LandingPage        = lazy(() => import('../../pages/Landing/LandingPage'));
const LoginPage          = lazy(() => import('../../pages/auth/LoginPage'));
const RegisterPage       = lazy(() => import('../../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('../../pages/auth/ResetPasswordPage'));
const VerifyEmailPage    = lazy(() => import('../../pages/auth/VerifyEmailPage'));

// Student - Only existing pages
const StudentDashboard   = lazy(() => import('../../pages/student/DashboardPage'));
const ProfilePage        = lazy(() => import('../../pages/student/ProfilePage'));
const CertificatesPage   = lazy(() => import('../../pages/student/CertificatesPage'));
const CodingChallengesPage = lazy(() => import('../../pages/student/CodingChallengesPage'));
const CodingPortalPage     = lazy(() => import('../../pages/student/CodingPortalPage'));
const ContestsPage         = lazy(() => import('../../pages/student/ContestsPage'));
const TcsNqtPrepPage       = lazy(() => import('../../pages/student/TcsNqtPrepPage'));
const TcsNqtCompilerPage   = lazy(() => import('../../pages/student/TcsNqtCompilerPage'));
const AptitudeStudentPage  = lazy(() => import('../../pages/student/AptitudeStudentPage'));
const AptitudePrepPage     = lazy(() => import('../../pages/student/AptitudePrepPage'));
const AptitudePracticePage = lazy(() => import('../../pages/student/AptitudePracticePage'));
const AptitudeQuizPage     = lazy(() => import('../../pages/student/AptitudeQuizPage'));
const TestAttemptPage      = lazy(() => import('../../pages/student/TestAttemptPage'));
const CodingTopicPage      = lazy(() => import('../../pages/student/CodingTopicPage'));
const CourseSelectionPage  = lazy(() => import('../../pages/student/CourseSelectionPage'));

// Admin
const AdminDashboard     = lazy(() => import('../../pages/admin/DashboardPage'));
const AdminUsersPage     = lazy(() => import('../../pages/admin/UsersPage'));
const AdminProblemsPage  = lazy(() => import('../../pages/admin/ProblemsPage'));
const AdminCoursesPage  = lazy(() => import('../../pages/admin/CoursesPage'));
const AdminContestsPage = lazy(() => import('../../pages/admin/ContestsPage'));
const AdminAnalyticsPage = lazy(() => import('../../pages/admin/AnalyticsPage'));
const AdminSecurityPage  = lazy(() => import('../../pages/admin/SecurityPage'));
const AdminSettingsPage  = lazy(() => import('../../pages/admin/SettingsPage'));
const DualAdminDashboard = lazy(() => import('../../features/admin/pages/AdminDashboard'));
const AptitudeManagementPage = lazy(() => import('../../features/admin/pages/AptitudeManagementPage'));
const AptitudeQuestionsPage  = lazy(() => import('../../pages/admin/AptitudeQuestionsPage'));
const AptitudeTopicPracticePage = lazy(() => import('../../pages/admin/AptitudeTopicPracticePage'));

// Public
const CertVerifyPage     = lazy(() => import('../../pages/public/CertificateVerifyPage'));
const NotFoundPage       = lazy(() => import('../../pages/public/NotFoundPage'));
const GetStartedPage     = lazy(() => import('../../pages/GetStartedPage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
           {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify/:certificateId" element={<CertVerifyPage />} />

          {/* Auth */}
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Student - Core Features Only */}
          <Route path="/student" element={<ProtectedRoute><RoleRoute roles={['student']} /></ProtectedRoute>}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="select-course" element={<CourseSelectionPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="certificates" element={<CertificatesPage />} />
            
            {/* Coding Arena */}
            <Route path="challenges" element={<CodingChallengesPage />} />
            <Route path="challenges/topic/:topicKey" element={<CodingTopicPage />} />
            <Route path="challenges/:slug" element={<CodingPortalPage />} />
            <Route path="contests" element={<ContestsPage />} />
            
            {/* Placement Prep */}
            <Route path="tcs-nqt" element={<TcsNqtPrepPage />} />
            <Route path="tcs-nqt/:slug" element={<TcsNqtCompilerPage />} />
            
            {/* Aptitude Preparation */}
            <Route path="aptitude" element={<AptitudePrepPage />} />
            <Route path="aptitude/topic/:topicId/practice" element={<AptitudePracticePage />} />
            <Route path="aptitude/practice/:module/:topicSlug" element={<AptitudePracticePage />} />
            <Route path="aptitude/:module/:topicSlug" element={<AptitudeQuizPage />} />
            <Route path="tests/:testId" element={<TestAttemptPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><RoleRoute roles={['admin']} /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="contests" element={<AdminContestsPage />} />
            <Route path="problems" element={<AdminProblemsPage />} />
            <Route path="aptitude" element={<AptitudeManagementPage />} />
            <Route path="aptitude/topics/:topicId/practice" element={<AptitudeTopicPracticePage />} />
            <Route path="aptitude/topics/:topicId/questions" element={<AptitudeQuestionsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="security" element={<AdminSecurityPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
