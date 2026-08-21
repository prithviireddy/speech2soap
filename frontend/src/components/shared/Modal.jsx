import React from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';

export const Modal = ({ isOpen, onClose, title, children, actions, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <Card
        className={`relative z-10 w-full ${maxWidth} max-h-[90vh] overflow-y-auto glass-dropdown border border-border-default shadow-2xl rounded-2xl animate-fade-in-scale p-6`}
      >
        <div className="flex justify-between items-center pb-4 mb-5 border-b border-border-subtle">
          <h2 className="text-lg font-display font-bold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface-subtle transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6">{children}</div>

        {actions && (
          <div className="flex gap-2.5 justify-end pt-4 border-t border-border-subtle">
            {actions}
          </div>
        )}
      </Card>
    </div>
  );
};
