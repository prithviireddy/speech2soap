import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Sidebar Component (Generic)
 * 
 * Left navigation sidebar for dashboard pages
 * Provides general navigation links
 * 
 * Features:
 * - Responsive mobile slide-out
 * - Mobile overlay
 * - Navigation links
 * - Role-based navigation hints
 * - Smooth animations
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Generic navigation items
  const navItems = [
    { icon: <Home />, label: 'Home', id: 'home', link: '/' },
    { icon: <LayoutDashboard />, label: 'Dashboard', id: 'dashboard', link: '/' },
    { icon: <Settings />, label: 'Settings', id: 'settings', link: '#' }
  ];

  // Helper function to determine appropriate dashboard link based on role
  const getDashboardLink = () => {
    if (user?.role === 'doctor') return '/dashboard';
    if (user?.role === 'patient') return '/patient/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-border-default transform transition-transform duration-300 ease-out z-30 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            // Skip dashboard if it's the first item, we'll add a smart one
            if (item.id === 'dashboard') {
              return (
                <Link
                  key={item.id}
                  to={getDashboardLink()}
                  onClick={() => onClose()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-bg-base transition-colors group text-text-primary hover:text-brand-primary text-sm"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.link}
                onClick={() => onClose()}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-bg-base transition-colors group text-text-primary hover:text-brand-primary text-sm"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="font-medium flex-1 text-left">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 mt-8 border-t border-border-default">
          <div className="p-3 bg-brand-primary/5 rounded-lg">
            <p className="text-xs font-medium text-brand-primary">Current User</p>
            <p className="text-xs text-text-secondary mt-2">{user?.name || 'Dashboard User'}</p>
            {user?.role && (
              <p className="text-xs text-brand-primary font-medium mt-1 capitalize">
                📋 {user.role === 'doctor' ? '👨‍⚕️ Healthcare Provider' : user.role === 'patient' ? '👤 Patient' : '⚙️ Administrator'}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
