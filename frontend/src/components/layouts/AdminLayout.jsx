import { useState } from 'react';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base">
      <AdminNavbar onMenuToggle={() => setMenuOpen(!menuOpen)} />
      <AdminSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="md:ml-64 pt-16 px-4 pb-4 md:px-8 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
