import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Home,
  Sparkles,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminNav, patientNav, doctorNav } from '../navigation';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navMap = {
    ADMIN: adminNav,
    DOCTOR: doctorNav,
    PATIENT: patientNav,
  };

  const navItems = navMap[user?.role] ?? [];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 glass-panel border-r border-slate-200/70 transform transition-transform duration-300 ease-out z-30 flex flex-col justify-between p-4 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Navigation Section Label */}
          <div className="px-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Main Menu
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/25 font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle'
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-transform duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-text-muted group-hover:text-brand-primary group-hover:scale-110'
                    }`}
                  />
                  <span className="flex-1 truncate">{item.label}</span>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info Card */}
        <div className="pt-4 border-t border-border-subtle">
          <div className="p-3 rounded-xl bg-gradient-to-b from-brand-primary-light/60 to-bg-base border border-brand-primary/15 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              <p className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">
                System Active
              </p>
            </div>
            <p className="text-xs text-text-secondary font-medium truncate">
              {user?.full_name || user?.email}
            </p>
            <p className="text-[10px] text-text-muted font-mono mt-0.5 capitalize">
              Role: {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
