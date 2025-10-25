import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const VerifyOTPPage = React.lazy(() => import('./pages/VerifyOTPPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const AdminLoginPage = React.lazy(() => import('./pages/AdminLoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const UserDashboard = React.lazy(() => import('./pages/user/UserDashboard'));
const UsersPage = React.lazy(() => import('./pages/admin/UsersPage'));
const RolesPage = React.lazy(() => import('./pages/admin/RolesPage'));
const GroupsPage = React.lazy(() => import('./pages/admin/GroupsPage'));
const TasksPage = React.lazy(() => import('./pages/TasksPage'));
const CreateTaskPage = React.lazy(() => import('./pages/CreateTaskPage'));
const TaskDetailPage = React.lazy(() => import('./pages/TaskDetailPage'));
const ReportsPage = React.lazy(() => import('./pages/admin/ReportsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const ActivityLogsPage = React.lazy(() => import('./pages/admin/ActivityLogsPage'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !['Super Admin', 'Admin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user) {
    // Redirect based on role
    if (['Super Admin', 'Admin'].includes(user.role)) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// App Component
function AppContent() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Set page title
    document.title = 'NexusFlow - Streamline Teams, Amplify Productivity';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'NexusFlow helps teams collaborate effectively with task management, role-based access control, and real-time notifications.');
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/verify-otp" 
              element={
                <PublicRoute>
                  <VerifyOTPPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/admin/login" 
              element={
                <PublicRoute>
                  <AdminLoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <PublicRoute>
                  <ResetPasswordPage />
                </PublicRoute>
              } 
            />

            {/* Protected Routes - Admin Only */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <UsersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/roles" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <RolesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/groups" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <GroupsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/activity-logs" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ActivityLogsPage />
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes - All Users */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks/create" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <CreateTaskPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks/:taskId" 
              element={
                <ProtectedRoute>
                  <TaskDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/chat" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />

            {/* Redirect based on user role */}
            <Route 
              path="/redirect" 
              element={
                user ? (
                  ['Super Admin', 'Admin'].includes(user.role) ? 
                    <Navigate to="/admin/dashboard" replace /> : 
                    <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;