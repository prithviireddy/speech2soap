import { Card } from './Card';

export function Modal({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl">{title}</h2>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="mb-6">
          {children}
        </div>
        {actions && (
          <div className="flex gap-3 justify-end">
            {actions}
          </div>
        )}
      </Card>
    </div>
  );
}
