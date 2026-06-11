import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

/**
 * DashboardLayout Component
 * 
 * Generic dashboard wrapper for general pages
 * Integrates generic Navbar and Sidebar
 * Used as fallback/default layout when role-specific layout isn't needed
 * 
 * Features:
 * - Fixed navbar at top
 * - Collapsible sidebar for navigation
 * - Responsive mobile menu
 * - Consistent spacing and padding
 * - Mobile-first responsive design
 */
export const DashboardLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Top Navigation */}
      <Navbar onMenuToggle={() => setMenuOpen(!menuOpen)} />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content */}
      <main className="md:ml-64 pt-16 px-4 pb-4 md:px-8 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
