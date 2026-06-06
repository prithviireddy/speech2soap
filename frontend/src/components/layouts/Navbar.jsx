import { useState } from 'react';
import { useAuth } from '../../App.jsx';
import {Link} from 'react-router-dom';

export function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const routes = {
  Dashboard: '/dashboard',
  Uploads: '/upload',
  Reports: '/report',
  'AI Assistant': '/assistant',
  'My Records': '/records'
};

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-lg border-b border-border-default/40 z-40 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-medical rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">C2</span>
          </div>
          <h1 className="text-brand-primary font-display font-bold text-xl hidden sm:block">
            Clinic2Report
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {['Dashboard', 'Uploads', 'Reports', 'My Records', 'AI Assistant'].map((link) => (
            <Link
              key={link}
              to={routes[link]}
              className="text-sm font-medium text-text-primary hover:text-brand-primary transition-colors relative group"
            >
              {link}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative text-text-primary hover:text-brand-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-danger rounded-full text-white text-xs flex items-center justify-center">
              2
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-medical flex items-center justify-center text-white font-display font-bold hover:shadow-md transition-shadow"
            >
              {user?.initial || 'U'}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-default overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border-default">
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-sm text-text-secondary">{user?.email || 'user@example.com'}</p>
                </div>
                <button className="w-full text-left px-4 py-2 hover:bg-bg-base transition-colors text-sm">
                  View Profile
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-bg-base transition-colors text-sm">
                  Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-danger/10 text-danger transition-colors border-t border-border-default text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

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
}
