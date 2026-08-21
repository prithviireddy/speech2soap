import React from 'react';

/**
 * Tabs — Modern pill-style tab switcher with floating glass indicator.
 */
export const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex p-1 bg-slate-200/60 rounded-2xl border border-slate-300/40 w-fit backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? 'bg-white text-brand-primary shadow-sm font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/40'
              }`}
            >
              {Icon && <Icon size={16} className={isActive ? 'text-brand-primary' : 'text-text-muted'} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono font-semibold leading-none ${
                    isActive
                      ? 'bg-brand-primary-light text-brand-primary'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="animate-fade-in-up">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};
