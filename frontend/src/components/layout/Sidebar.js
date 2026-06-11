import { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import useWebSocket from '../../hooks/useWebSocket';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unread, setUnread] = useState(0);

  // Load notifications on mount
  useState(() => {
    api.get('/api/notifications').then(({ data }) => {
      setNotifications(data.notifications);
      setUnread(data.notifications.filter(n => !n.isRead).length);
    }).catch(() => {});
  });

  const handleWsMessage = useCallback((msg) => {
    if (msg.notification) {
      setNotifications(prev => [msg.notification, ...prev]);
      setUnread(prev => prev + 1);
      toast.info(msg.notification.message);
    }
  }, []);

  useWebSocket(handleWsMessage);

  const markAllRead = async () => {
    await api.put('/api/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: '📊 Dashboard', roles: ['Admin', 'Project Manager', 'Collaborator'] },
    { to: '/tasks', label: '✅ Tasks', roles: ['Admin', 'Project Manager', 'Collaborator'] },
    { to: '/users', label: '👥 Users', roles: ['Admin'] },
  ].filter(l => l.roles.includes(user?.role));

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">TMS</div>
        <nav className="sidebar-nav">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.[0]}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="btn btn-sm btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        {/* Top bar */}
        <div className="topbar">
          <div />
          <button className="notif-btn" onClick={() => setShowNotifs(s => !s)}>
            🔔 {unread > 0 && <span className="notif-badge">{unread}</span>}
          </button>
        </div>

        {/* Notification panel */}
        {showNotifs && (
          <div className="notif-panel">
            <div className="notif-header">
              <strong>Notifications</strong>
              <button className="btn btn-sm btn-outline" onClick={markAllRead}>Mark all read</button>
            </div>
            {notifications.length === 0 && <p className="notif-empty">No notifications</p>}
            {notifications.map(n => (
              <div key={n.id} className={`notif-item ${n.isRead ? 'read' : 'unread'}`}>
                <p>{n.message}</p>
                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}

        <div className="page-content">
          {/* Page content is rendered here via React Router Outlet */}
        </div>
      </main>
    </div>
  );
}
