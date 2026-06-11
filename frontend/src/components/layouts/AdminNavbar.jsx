import { useState } from 'react';
import { useAuth } from '../../App.jsx';
import { Link } from 'react-router-dom';
import { AlertTriangle, User, LogOut } from 'lucide-react';

export const AdminNavbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-danger/20 to-danger/10 border-b-2 border-danger backdrop-blur-lg z-40 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-danger rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">⚙️</span>
          </div>
          <h1 className="text-danger font-display font-bold text-xl hidden sm:block">
            Admin Portal
          </h1>
          <span className="hidden lg:inline ml-2 px-2 py-1 bg-danger/20 text-danger text-xs rounded-full font-medium">
            System Administration
          </span>
        </Link>

        {/* Status */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1 bg-success/20 text-success rounded-full text-xs font-medium">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
          All Systems Operational
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full bg-danger flex items-center justify-center text-white font-display font-bold hover:shadow-md transition-shadow"
            >
              {user?.initial || 'A'}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border-default overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border-default bg-bg-base">
                  <p className="font-medium text-sm">{user?.name || 'Administrator'}</p>
                  <p className="text-xs text-text-secondary">{user?.email || 'admin@example.com'}</p>
                  <p className="text-xs text-danger font-medium mt-1">⚙️ System Admin</p>
                </div>

                <button className="w-full text-left px-4 py-2 hover:bg-bg-base transition-colors text-sm flex items-center gap-2">
                  <User size={16} />
                  Admin Profile
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
            className="md:hidden text-danger hover:text-danger/80 transition-colors"
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
