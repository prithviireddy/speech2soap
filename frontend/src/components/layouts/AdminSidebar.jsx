import { Badge } from '../shared';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Activity,
  AlertTriangle,
  Lock
} from 'lucide-react';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', id: 'dashboard', link: '/admin/dashboard' },
    { icon: <Users />, label: 'User Management', id: 'users', link: '/admin/users' },
    { icon: <Activity />, label: 'System Monitoring', id: 'monitoring', link: '/admin/monitoring' },
    { icon: <AlertTriangle />, label: 'Audit Logs', id: 'audit', link: '/admin/audit', badge: 3 },
    { icon: <Lock />, label: 'Security', id: 'security', link: '/admin/security' }
  ];

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
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => onClose()}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-danger/5 transition-colors group text-text-primary hover:text-danger text-sm"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge size="sm" variant="danger">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-8 border-t border-border-default">
          <div className="p-3 bg-danger/5 rounded-lg">
            <p className="text-xs font-medium text-danger">⚠️ Admin Access</p>
            <p className="text-xs text-text-secondary mt-2">All actions are logged and monitored</p>
          </div>
        </div>
      </aside>
    </>
  );
};
