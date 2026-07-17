import { Badge } from '../shared';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckCheck,
  Bot,
  Settings,
  Plus,
  Clock
} from 'lucide-react';

export const DoctorSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', id: 'dashboard', link: '/doctor/dashboard' },
    { icon: <Plus />, label: 'New Consultation', id: 'upload', link: '/doctor/upload' },
    { icon: <Clock />, label: 'Pending Reviews', id: 'pending', link: '/doctor/dashboard', badge: 5 },
    { icon: <Users />, label: 'Manage Patients', id: 'patients', link: '/doctor/patients' },
    { icon: <FileText />, label: 'Reports', id: 'reports', link: '/doctor/dashboard' },
    { icon: <CheckCheck />, label: 'Followups', id: 'followups', link: '/doctor/followups' },
    { icon: <Bot />, label: 'AI Assistant', id: 'assistant', link: '/doctor/assistant' },
    { icon: <Settings />, label: 'Settings', id: 'settings', link: '#' }
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
                <Badge size="sm" variant="danger">
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
