import { useState } from 'react';
import { DoctorNavbar } from './DoctorNavbar';
import { DoctorSidebar } from './DoctorSidebar';

export const DoctorLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base">
      <DoctorNavbar onMenuToggle={() => setMenuOpen(!menuOpen)} />
      <DoctorSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="md:ml-64 pt-16 px-4 pb-4 md:px-8 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
