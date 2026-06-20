import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageWrapper from './components/layout/PageWrapper';

// Pages
import LoginPage from './pages/auth/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminProjectsPage from './pages/admin/ProjectsPage';

// PM Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerProjectsPage from './pages/manager/ProjectsPage';
import ManagerCalendarPage from './pages/manager/CalendarPage';

// Collaborator Pages
import CollabDashboard from './pages/collaborator/CollabDashboard';
import CollabProjectsPage from './pages/collaborator/MyProjectsPage';
import CollabCalendarPage from './pages/collaborator/CalendarPage';

// Shared Pages
import ProfilePage from './pages/shared/ProfilePage';
import SettingsPage from './pages/shared/SettingsPage';
import NotificationsPage from './pages/shared/NotificationsPage';

import { Shield } from 'lucide-react';

function DashboardRouter() {
  const { user } = useAuth();
  const role = user?.role || 'Collaborator';

  if (role === 'Admin') {
    return <AdminDashboard />;
  } else if (role === 'Project Manager') {
    return <ManagerDashboard />;
  } else {
    return <CollabDashboard />;
  }
}

function ProjectsRouter() {
  const { user } = useAuth();
  const role = user?.role || 'Collaborator';

  if (role === 'Admin') {
    return <AdminProjectsPage />;
  } else if (role === 'Project Manager') {
    return <ManagerProjectsPage />;
  } else {
    return <CollabProjectsPage />;
  }
}

function CalendarRouter() {
  const { user } = useAuth();
  const role = user?.role || 'Collaborator';

  if (role === 'Project Manager') {
    return <ManagerCalendarPage />;
  } else if (role === 'Collaborator') {
    return <CollabCalendarPage />;
  } else {
    // Admin doesn't have a calendar listed in sidebar nav, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
}

// Development helper: floating role switcher overlay widget
function DevRoleSwitcher() {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      fontFamily: 'var(--font-body)'
    }}>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          padding: '10px 18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '700',
          fontSize: '0.8rem',
          boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Shield size={14} /> Dev Switcher
      </button>

      {/* Switch Panel Drawer */}
      {isOpen && (
        <Card style={{
          position: 'absolute',
          bottom: '50px',
          right: 0,
          width: '220px',
          padding: '16px',
          background: '#0D1F3C',
          border: '1px solid var(--card-border)',
          boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.04em' }}>
            Current Role: {user.role}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Button 
              variant={user.role === 'Admin' ? 'primary' : 'secondary'}
              onClick={() => { switchRole('Admin'); setIsOpen(false); }}
              style={{ padding: '8px 12px', fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              👑 Admin Mode
            </Button>
            <Button 
              variant={user.role === 'Project Manager' ? 'primary' : 'secondary'}
              onClick={() => { switchRole('Project Manager'); setIsOpen(false); }}
              style={{ padding: '8px 12px', fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              💼 Manager Mode
            </Button>
            <Button 
              variant={user.role === 'Collaborator' ? 'primary' : 'secondary'}
              onClick={() => { switchRole('Collaborator'); setIsOpen(false); }}
              style={{ padding: '8px 12px', fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              ⚡ Collaborator Mode
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function AuthenticatedRoutes() {
  return (
    <PageWrapper>
      <Routes>
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/projects" element={<ProjectsRouter />} />
        <Route path="/calendar" element={<CalendarRouter />} />
        <Route path="/users" element={
          <ProtectedRoute roles={['Admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </PageWrapper>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={
            <ProtectedRoute><ResetPasswordPage /></ProtectedRoute>
          } />

          {/* Core App Shell */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AuthenticatedRoutes />
            </ProtectedRoute>
          } />
        </Routes>
        
        {/* Development Helper Widget */}
        <DevRoleSwitcher />

        {/* Global Styled Toasts */}
        <ToastContainer position="top-right" autoClose={5000} />
      </BrowserRouter>
    </AuthProvider>
  );
}
