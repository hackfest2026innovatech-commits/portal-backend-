import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useNotifications } from './hooks/useNotifications';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoadingScreen from './components/LoadingScreen';
import { ROLES } from './utils/constants';

// =============================================
// Lazy-loaded page components
// =============================================

// Public pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Shared authenticated pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Profile = lazy(() => import('./pages/Profile'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const ManageTeams = lazy(() => import('./pages/admin/ManageTeams'));
const TeamDetail = lazy(() => import('./pages/admin/TeamDetail'));
const ManageForms = lazy(() => import('./pages/admin/ManageForms'));
const FormDetail = lazy(() => import('./pages/admin/FormDetail'));
const TimerControl = lazy(() => import('./pages/admin/TimerControl'));
const ManageNotifications = lazy(() => import('./pages/admin/ManageNotifications'));
const Leaderboard = lazy(() => import('./pages/admin/Leaderboard'));
const ExportData = lazy(() => import('./pages/admin/ExportData'));

// Student pages
const MyTeam = lazy(() => import('./pages/student/MyTeam'));
const MyForms = lazy(() => import('./pages/student/MyForms'));
const MyCommits = lazy(() => import('./pages/student/MyCommits'));

// Judge pages
const Assignments = lazy(() => import('./pages/judge/Assignments'));
const Evaluate = lazy(() => import('./pages/judge/Evaluate'));

/**
 * Suspense wrapper with a loading fallback.
 */
function SuspenseWrapper({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading page...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

/**
 * Redirect authenticated users away from public routes.
 */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}

/**
 * Connects AppLayout to auth, theme, and notification contexts.
 */
function ConnectedAppLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();

  return (
    <AppLayout
      role={user?.role || 'student'}
      user={user}
      unreadCount={unreadCount}
      darkMode={isDark}
      onToggleDarkMode={toggleTheme}
      onLogout={logout}
    />
  );
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SuspenseWrapper>
      <Routes>
        {/* ========================== */}
        {/* Public Routes              */}
        {/* ========================== */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* ========================== */}
        {/* Protected Routes with      */}
        {/* AppLayout (Sidebar+Topbar) */}
        {/* ========================== */}
        <Route
          element={
            <ProtectedRoute>
              <ConnectedAppLayout />
            </ProtectedRoute>
          }
        >
          {/* Shared authenticated pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin pages */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={ROLES.SUPERADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={ROLES.SUPERADMIN}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedRoute roles={[ROLES.SUPERADMIN, ROLES.JUDGE]}>
                <ManageTeams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams/:teamId"
            element={
              <ProtectedRoute roles={[ROLES.SUPERADMIN, ROLES.JUDGE]}>
                <TeamDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms"
            element={
              <ProtectedRoute roles={ROLES.SUPERADMIN}>
                <ManageForms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms/:formId"
            element={
              <ProtectedRoute roles={ROLES.SUPERADMIN}>
                <FormDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timer"
            element={
              <ProtectedRoute roles={ROLES.SUPERADMIN}>
                <TimerControl />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications/manage"
            element={
              <ProtectedRoute roles={ROLES.SUPERADMIN}>
                <ManageNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute roles={[ROLES.SUPERADMIN, ROLES.JUDGE]}>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/export"
            element={
              <ProtectedRoute roles={ROLES.SUPERADMIN}>
                <ExportData />
              </ProtectedRoute>
            }
          />

          {/* Student pages */}
          <Route
            path="/my-team"
            element={
              <ProtectedRoute roles={ROLES.STUDENT}>
                <MyTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-forms"
            element={
              <ProtectedRoute roles={ROLES.STUDENT}>
                <MyForms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-commits"
            element={
              <ProtectedRoute roles={ROLES.STUDENT}>
                <MyCommits />
              </ProtectedRoute>
            }
          />

          {/* Judge pages */}
          <Route
            path="/assignments"
            element={
              <ProtectedRoute roles={ROLES.JUDGE}>
                <Assignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluate/:teamId"
            element={
              <ProtectedRoute roles={ROLES.JUDGE}>
                <Evaluate />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ========================== */}
        {/* Catch-all / Default        */}
        {/* ========================== */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
              <div className="text-center animate-fade-in">
                <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
                <a
                  href="/dashboard"
                  className="mt-6 inline-block btn-primary"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </SuspenseWrapper>
  );
}
