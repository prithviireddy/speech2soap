import { Badge } from '../shared';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Pill,
  CheckCheck,
  Bot,
  Settings
} from 'lucide-react';

export const PatientSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', id: 'dashboard', link: '/patient/dashboard' },
    { icon: <FileText />, label: 'My Reports', id: 'reports', link: '/patient/reports' },
    { icon: <Pill />, label: 'Medications', id: 'medications', link: '/patient/medications' },
    { icon: <CheckCheck />, label: 'Followups', id: 'followups', link: '/patient/followups', badge: 2 },
    { icon: <Bot />, label: 'Health Assistant', id: 'assistant', link: '/patient/assistant' },
    { icon: <Settings />, label: 'Settings', id: 'settings', link: '/patient/settings' }
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
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-bg-base transition-colors group text-text-primary hover:text-brand-primary text-sm"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge size="sm" variant="warning">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};
