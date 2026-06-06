export function Card({ className = '', children, ...props }) {
  return (
    <div 
      className={`bg-bg-secondary rounded-lg p-6 shadow-sm border border-border-default ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
