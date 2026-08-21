import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import {
  Bell,
  User as UserIcon,
  LogOut,
  Settings,
  Sparkles,
  Stethoscope,
  ChevronDown,
  Activity,
  Menu,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: 'Clinical RAG assistant updated with Gemini 2.5', time: '10 min ago', type: 'info' },
    { id: 2, text: 'New consultation audio ready for review', time: '1 hour ago', type: 'warning' },
    { id: 3, text: 'Automated daily clinical backup complete', time: '3 hours ago', type: 'info' },
  ];

  const roleLabel = {
    DOCTOR: 'Doctor',
    PATIENT: 'Patient',
    ADMIN: 'Administrator',
  }[user?.role] || user?.role;

  return (
    <nav className="fixed top-0 left-0 w-full z-40 h-16 glass-panel border-b border-border-default shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white shadow-sm shadow-brand-primary/20 group-hover:scale-105 transition-transform">
              <Stethoscope size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-text-primary tracking-tight group-hover:text-brand-primary transition-colors flex items-center gap-1.5">
                ClinicReport
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-brand-primary-light text-brand-primary uppercase tracking-wider border border-brand-primary/20">
                  AI
                </span>
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
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-border-default transition-all cursor-pointer"
          >
            {isDark ? (
              <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={18} className="text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-border-default transition-colors cursor-pointer"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full animate-pulse-glow" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-2xl border border-border-default shadow-xl overflow-hidden z-50 animate-fade-in-scale">
                <div className="px-4 py-3 border-b border-border-subtle bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
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
                      className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
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
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent hover:border-border-default transition-all cursor-pointer"
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
                <div className="px-3 py-2.5 border-b border-border-subtle bg-slate-50/70 dark:bg-slate-800/70 rounded-xl mb-1">
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Activity size={15} />
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-danger hover:bg-danger-light transition-colors mt-1 font-medium cursor-pointer"
                >
                  <LogOut size={15} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
