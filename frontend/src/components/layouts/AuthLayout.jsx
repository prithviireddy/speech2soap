import React from 'react';

/**
 * AuthLayout Component
 * 
 * Wrapper for all authentication pages (LoginPage, AdminLoginPage)
 * Provides a centered, clean layout for login forms
 * 
 * Features:
 * - Centered content area
 * - Responsive design (mobile-first)
 * - Gradient background
 * - No navbar/sidebar (auth pages only need form)
 */
export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-base via-white to-brand-primary/5 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-medical/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-text-secondary border-t border-border-default/20 bg-white/50 backdrop-blur-sm">
        <p>
          © 2024 Clinic2Report. All rights reserved. |{' '}
          <a href="#" className="text-brand-primary hover:underline">
            Privacy Policy
          </a>
          {' '}|{' '}
          <a href="#" className="text-brand-primary hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
};
