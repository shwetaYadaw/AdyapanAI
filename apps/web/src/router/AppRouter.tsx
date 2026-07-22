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
const AptitudePage         = lazy(() => import('../pages/student/AptitudePage'));

// Teacher
const TeacherDashboard   = lazy(() => import('../pages/teacher/DashboardPage'));
const CourseManagerPage  = lazy(() => import('../pages/teacher/CourseManagerPage'));
const CourseEditorPage   = lazy(() => import('../pages/teacher/CourseEditorPage'));
const StudentsPage       = lazy(() => import('../pages/teacher/StudentsPage'));
const EarningsPage       = lazy(() => import('../pages/teacher/EarningsPage'));
const AnalyticsPage      = lazy(() => import('../pages/teacher/AnalyticsPage'));



// Recruiter
const RecruiterDashboard = lazy(() => import('../pages/recruiter/DashboardPage'));
const RecruiterJobsPage  = lazy(() => import('../pages/recruiter/JobsPage'));
const CandidatesPage     = lazy(() => import('../pages/recruiter/CandidatesPage'));
const ApplicationsPage   = lazy(() => import('../pages/recruiter/ApplicationsPage'));

// Mentor
const MentorDashboard    = lazy(() => import('../pages/mentor/DashboardPage'));

// Admin
const AdminDashboard     = lazy(() => import('../pages/admin/DashboardPage'));
const AdminUsersPage     = lazy(() => import('../pages/admin/UsersPage'));
const AdminCoursesPage   = lazy(() => import('../pages/admin/CoursesPage'));
const AdminPaymentsPage  = lazy(() => import('../pages/admin/PaymentsPage'));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AnalyticsPage'));
const AdminSecurityPage  = lazy(() => import('../pages/admin/SecurityPage'));
const AdminSettingsPage  = lazy(() => import('../pages/admin/SettingsPage'));
const AdminCertificatesPage = lazy(() => import('../pages/admin/CertificatesPage'));

// Public
const CertVerifyPage     = lazy(() => import('../pages/public/CertificateVerifyPage'));
const NotFoundPage       = lazy(() => import('../pages/public/NotFoundPage'));

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
            <Route path="placement" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="resume" element={<ResumeBuilderPage />} />
            <Route path="jobs" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="mentors" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="community" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="ai" element={<AIFeaturesPage />} />
            <Route path="challenges" element={<CodingChallengesPage />} />
            <Route path="challenges/:slug" element={<CodingPortalPage />} />
            <Route path="contests" element={<ContestsPage />} />
            <Route path="tcs-nqt" element={<TcsNqtPrepPage />} />
            <Route path="aptitude" element={<AptitudePage />} />
          </Route>

          {/* Teacher */}
          <Route path="/teacher" element={<ProtectedRoute><RoleRoute roles={['teacher', 'admin', 'superadmin']} /></ProtectedRoute>}>
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="courses" element={<CourseManagerPage />} />
            <Route path="courses/new" element={<CourseEditorPage />} />
            <Route path="courses/:id/edit" element={<CourseEditorPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="earnings" element={<EarningsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>



          {/* Recruiter */}
          <Route path="/recruiter" element={<ProtectedRoute><RoleRoute roles={['recruiter', 'admin', 'superadmin']} /></ProtectedRoute>}>
            <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="jobs" element={<RecruiterJobsPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
          </Route>

          {/* Mentor */}
          <Route path="/mentor" element={<ProtectedRoute><RoleRoute roles={['mentor', 'admin', 'superadmin']} /></ProtectedRoute>}>
            <Route index element={<Navigate to="/mentor/dashboard" replace />} />
            <Route path="dashboard" element={<MentorDashboard />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><RoleRoute roles={['admin', 'superadmin']} /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
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
