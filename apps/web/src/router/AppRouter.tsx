import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import PageLoader from '../components/common/Loader/PageLoader';

// Lazy-loaded pages
const LandingPage        = lazy(() => import('../pages/Landing/LandingPage'));
const LoginPage          = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage       = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('../pages/auth/ResetPasswordPage'));
const VerifyEmailPage    = lazy(() => import('../pages/auth/VerifyEmailPage'));

// Student
const StudentDashboard   = lazy(() => import('../pages/student/DashboardPage'));
const CourseCatalogPage  = lazy(() => import('../pages/student/CoursesPage'));
const CourseDetailPage   = lazy(() => import('../pages/student/CourseDetailPage'));
const LearningPage       = lazy(() => import('../pages/student/LearningPage'));
const PlacementPage      = lazy(() => import('../pages/student/PlacementPage'));
const ResumeBuilderPage  = lazy(() => import('../pages/student/ResumeBuilderPage'));
const JobsPage           = lazy(() => import('../pages/student/JobsPage'));
const CertificatesPage   = lazy(() => import('../pages/student/CertificatesPage'));
const MentorsPage        = lazy(() => import('../pages/student/MentorsPage'));
const CommunityPage      = lazy(() => import('../pages/student/CommunityPage'));
const AIFeaturesPage     = lazy(() => import('../pages/student/AIFeaturesPage'));
const ProfilePage        = lazy(() => import('../pages/student/ProfilePage'));
const CodingChallengesPage = lazy(() => import('../pages/student/CodingChallengesPage'));
const CodingPortalPage     = lazy(() => import('../pages/student/CodingPortalPage'));
const ContestsPage         = lazy(() => import('../pages/student/ContestsPage'));
const TcsNqtPrepPage       = lazy(() => import('../pages/student/TcsNqtPrepPage'));
const TcsNqtCompilerPage   = lazy(() => import('../pages/student/TcsNqtCompilerPage'));
const AptitudePage         = lazy(() => import('../pages/student/AptitudePage'));
const AptitudeQuizPage     = lazy(() => import('../pages/student/AptitudeQuizPage'));
const TestAttemptPage      = lazy(() => import('../pages/student/TestAttemptPage'));
const CodingTopicPage      = lazy(() => import('../pages/student/CodingTopicPage'));

// Admin
const AdminDashboard     = lazy(() => import('../pages/admin/DashboardPage'));
const AdminUsersPage     = lazy(() => import('../pages/admin/UsersPage'));
const AdminProblemsPage  = lazy(() => import('../pages/admin/ProblemsPage'));
const AdminAptitudePage  = lazy(() => import('../pages/admin/AptitudePage'));
const AdminContestsPage  = lazy(() => import('../pages/admin/ContestsPage'));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AnalyticsPage'));
const AdminSecurityPage  = lazy(() => import('../pages/admin/SecurityPage'));
const AdminSettingsPage  = lazy(() => import('../pages/admin/SettingsPage'));
const AdminCertificatesPage = lazy(() => import('../pages/admin/CertificatesPage'));

// Public
const CertVerifyPage     = lazy(() => import('../pages/public/CertificateVerifyPage'));
const NotFoundPage       = lazy(() => import('../pages/public/NotFoundPage'));
const GetStartedPage     = lazy(() => import('../pages/GetStartedPage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
           {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/courses/:slug" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/verify/:certificateId" element={<CertVerifyPage />} />

          {/* Auth */}
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Student */}
          <Route path="/student" element={<ProtectedRoute><RoleRoute roles={['student']} /></ProtectedRoute>}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="learn/:courseId" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="placement" element={<PlacementPage />} />
            <Route path="resume" element={<ResumeBuilderPage />} />
            <Route path="jobs" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="mentors" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="community" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="ai" element={<AIFeaturesPage />} />
            <Route path="challenges" element={<CodingChallengesPage />} />
            <Route path="challenges/topic/:topicKey" element={<CodingTopicPage />} />
            <Route path="challenges/:slug" element={<CodingPortalPage />} />
            <Route path="contests" element={<ContestsPage />} />
            <Route path="tcs-nqt" element={<TcsNqtPrepPage />} />
            <Route path="tcs-nqt/:slug" element={<TcsNqtCompilerPage />} />
            <Route path="aptitude" element={<AptitudePage />} />
            <Route path="aptitude/:module/:topicSlug" element={<AptitudeQuizPage />} />
            <Route path="tests/:testId" element={<TestAttemptPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><RoleRoute roles={['admin']} /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="problems" element={<AdminProblemsPage />} />
            <Route path="aptitude" element={<AdminAptitudePage />} />
            <Route path="contests" element={<AdminContestsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="certificates" element={<AdminCertificatesPage />} />
            <Route path="security" element={<AdminSecurityPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
