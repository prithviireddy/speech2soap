import React from 'react';
import { Stethoscope, Sparkles } from 'lucide-react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-base bg-dot-grid relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-brand-primary/15 selection:text-brand-primary">
      {/* Ambient Blurred Aura Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-medical/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-lg shadow-brand-primary/25 mb-4 animate-fade-in-scale">
            <Stethoscope size={24} />
          </div>

          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
            ClinicReport
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            AI-Assisted Clinical Documentation & Patient RAG Intelligence
          </p>
        </div>

        {/* Auth Content (Frosted Glass Card) */}
        {children}

        {/* Footer info */}
        <div className="text-center mt-8">
          <p className="text-xs text-text-muted">
            Clinical Decision Support System · HIPAA & Evidence Grounded
          </p>
        </div>
      </div>
    </div>
  );
};
