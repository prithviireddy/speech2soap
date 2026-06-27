import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Bell, User, LogOut, Settings } from 'lucide-react';

/**
 * Navbar Component (Generic)
 * 
 * Top navigation bar for dashboard pages
 * Provides logo, navigation links, notifications, and user menu
 * 
 * Features:
 * - Responsive design with mobile menu toggle
 * - User profile menu with logout
 * - Notification bell (placeholder)
 * - Logo with app branding
 * - Glassmorphic design with backdrop blur
 */
export const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Placeholder notifications
  const notifications = [
    { id: 1, text: 'New update available', time: '5 min ago', type: 'info' },
    { id: 2, text: 'Your session will expire soon', time: '1 hour ago', type: 'warning' },
    { id: 3, text: 'System maintenance scheduled', time: '3 hours ago', type: 'info' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-lg border-b border-border-default/40 z-40 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          {/* <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-medical rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">C2</span>
          </div> */}
          <h1 className="text-brand-primary font-display font-bold text-xl hidden sm:block">
            ClinicReport
          </h1>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-text-primary hover:text-brand-primary transition-colors hover:bg-bg-base rounded-lg"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-border-default overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border-default">
                  <p className="font-medium text-sm">Notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      className="w-full text-left px-4 py-3 hover:bg-bg-base transition-colors border-b border-border-default/50 last:border-b-0"
                    >
                      <p className="text-sm font-medium text-text-primary">{notif.text}</p>
                      <p className="text-xs text-text-secondary mt-1">{notif.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-medical flex items-center justify-center text-white font-display font-bold hover:shadow-md transition-shadow"
            >
              {user?.initial || 'U'}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border-default overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border-default bg-bg-base">
                  <p className="font-medium text-sm">{user?.name || 'User'}</p>
                  <p className="text-xs text-text-secondary">{user?.email || 'user@example.com'}</p>
                  <p className="text-xs text-brand-primary font-medium mt-1">Dashboard User</p>
                </div>

                <button className="w-full text-left px-4 py-2 hover:bg-bg-base transition-colors text-sm flex items-center gap-2">
                  <User size={16} />
                  View Profile
                </button>

                <button className="w-full text-left px-4 py-2 hover:bg-bg-base transition-colors text-sm flex items-center gap-2">
                  <Settings size={16} />
                  Settings
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-danger/10 text-danger transition-colors border-t border-border-default text-sm flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Menu Toggle */}
          <button
            onClick={onMenuToggle}
            className="md:hidden text-text-primary hover:text-brand-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
