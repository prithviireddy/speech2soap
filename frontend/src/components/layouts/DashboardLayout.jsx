import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const DashboardLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base bg-dot-grid relative selection:bg-brand-primary/15 selection:text-brand-primary">
      {/* Ambient Top Glow Mesh */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-radial-aura pointer-events-none z-0" />

      {/* Top Fixed Navigation */}
      <Navbar onMenuToggle={() => setMenuOpen(!menuOpen)} />

      {/* Left Sidebar Navigation */}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Page Content */}
      <main className="relative z-10 md:ml-64 pt-20 px-4 pb-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
