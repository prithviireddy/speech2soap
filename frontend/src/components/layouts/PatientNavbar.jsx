import { useState } from 'react';
import { useAuth } from '../../App.jsx';
import { Link } from 'react-router-dom';
import { Bell, User, LogOut, Settings } from 'lucide-react';

export const PatientNavbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'New report available: Annual Checkup', time: '1 hour ago', type: 'info' },
    { id: 2, text: 'Medication reminder: Take Lisinopril', time: '4 hours ago', type: 'warning' },
    { id: 3, text: 'Follow-up scheduled: Lab work due soon', time: '1 day ago', type: 'info' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-lg border-b border-border-default/40 z-40 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/patient/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-medical rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">C2</span>
          </div>
          <h1 className="text-brand-primary font-display font-bold text-xl hidden sm:block">
            Clinic2Report
          </h1>
          <span className="hidden lg:inline ml-2 px-2 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
            Patient
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {[
            { label: 'Dashboard', link: '/patient/dashboard' },
            { label: 'Reports', link: '/patient/reports' },
            { label: 'Medications', link: '/patient/medications' },
            { label: 'Followups', link: '/patient/followups' },
            { label: 'Health Assistant', link: '/patient/assistant' },
          ].map((nav) => (
            <Link
              key={nav.label}
              to={nav.link}
              className="text-sm font-medium text-text-primary hover:text-brand-primary transition-colors relative group"
            >
              {nav.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
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
                  <p className="font-medium text-sm">Health Notifications</p>
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
              className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-medical flex items-center justify-center text-white font-display font-bold hover:shadow-md transition-shadow"
            >
              {user?.initial || 'P'}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border-default overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border-default bg-bg-base">
                  <p className="font-medium text-sm">{user?.name || 'Patient'}</p>
                  <p className="text-xs text-text-secondary">{user?.email || 'patient@example.com'}</p>
                  <p className="text-xs text-success font-medium mt-1">👤 Patient Account</p>
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
