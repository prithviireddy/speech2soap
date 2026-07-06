import React from 'react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-medical/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-brand-primary">
              ClinicReport
            </h1>

            <p className="mt-2 text-text-secondary">
              AI-Powered Clinical Documentation
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
