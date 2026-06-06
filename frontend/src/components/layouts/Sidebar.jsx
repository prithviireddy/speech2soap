import { Badge } from '../shared';
import { Link } from "react-router-dom";

export function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { icon: '🏠', label: 'Dashboard', id: 'dashboard' },
    { icon: '➕', label: 'New Upload', id: 'upload' },
    { icon: '📄', label: 'Reports', id: 'reports' },
    { icon: '📁', label: 'My Records', id: 'records' },
    { icon: '👤', label: 'Profile', id: 'profile' },
    { icon: '💊', label: 'Medications', id: 'medications' },
    { icon: '✓', label: 'Follow-ups', id: 'followups', badge: 3 },
    { icon: '✨', label: 'AI Assistant', id: 'assistant' },
    { icon: '⚙️', label: 'Settings', id: 'settings' }
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
      <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-border-default transform transition-transform duration-300 ease-out z-30 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-bg-base transition-colors group text-text-primary hover:text-brand-primary text-sm"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge size="sm" variant="danger">{item.badge}</Badge>
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
