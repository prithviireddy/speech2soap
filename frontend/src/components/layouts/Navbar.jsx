import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Activity,
  Menu,
  X,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabel = {
    DOCTOR: 'Physician',
    PATIENT: 'Patient Portal',
    ADMIN: 'Administrator',
  }[user?.role] ?? user?.role;

  const notifications = [
    { id: 1, text: 'Clinical notes for Consultation #482 ready for review', time: '10m ago' },
    { id: 2, text: 'Audio processing completed for Sarah Johnson', time: '1h ago' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-default glass-panel">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-medical flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Stethoscope size={18} />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-base tracking-tight text-text-primary">
                Cura<span className="text-brand-primary font-mono ml-0.5">.</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Actions, Theme Toggle & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle border border-transparent hover:border-border-default transition-all cursor-pointer"
          >
            {isDark ? (
              <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={18} className="text-text-secondary hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle border border-transparent hover:border-border-default transition-colors cursor-pointer"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full animate-pulse-glow" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-2xl border border-border-default shadow-xl overflow-hidden z-50 animate-fade-in-scale">
                <div className="px-4 py-3 border-b border-border-subtle bg-bg-surface-subtle/50 flex items-center justify-between">
                  <p className="font-semibold text-xs text-text-primary uppercase tracking-wider">
                    Notifications
                  </p>
                  <span className="text-[11px] font-mono text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded-full">
                    {notifications.length} new
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-border-subtle">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 hover:bg-bg-surface-subtle/60 transition-colors cursor-pointer"
                    >
                      <p className="text-xs font-medium text-text-primary leading-snug">
                        {n.text}
                      </p>
                      <p className="text-[10px] text-text-muted mt-1 font-mono">
                        {n.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-2xl hover:bg-bg-surface-subtle border border-transparent hover:border-border-default transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-medical flex items-center justify-center text-white font-display font-bold text-xs shadow-xs">
                {(user?.full_name ?? user?.email)?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-text-primary truncate max-w-[120px]">
                  {user?.full_name || user?.email}
                </span>
                <span className="text-[10px] text-text-muted font-medium">
                  {roleLabel}
                </span>
              </div>
              <ChevronDown size={14} className="text-text-muted hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl border border-border-default shadow-xl overflow-hidden z-50 animate-fade-in-scale p-1.5">
                <div className="px-3 py-2.5 border-b border-border-subtle bg-bg-surface-subtle/70 rounded-xl mb-1">
                  <p className="font-semibold text-xs text-text-primary truncate">
                    {user?.full_name || 'User Profile'}
                  </p>
                  <p className="text-[11px] text-text-muted truncate font-mono">
                    {user?.email}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded-full mt-1.5">
                    {roleLabel}
                  </span>
                </div>

                <Link
                  to={
                    user?.role === 'DOCTOR'
                      ? '/doctor/dashboard'
                      : user?.role === 'PATIENT'
                      ? '/patient/dashboard'
                      : '/admin/dashboard'
                  }
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-brand-primary hover:bg-bg-surface-subtle transition-colors"
                >
                  <Activity size={15} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-danger hover:bg-danger-light/50 transition-colors mt-1 cursor-pointer"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
