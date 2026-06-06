export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer font-display';
  
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-95',
    secondary: 'bg-white border-2 border-brand-primary text-brand-primary hover:bg-bg-base',
    danger: 'bg-danger text-white hover:bg-danger/90',
    outline: 'border border-border-default text-text-primary hover:bg-bg-base',
    ghost: 'text-brand-primary hover:bg-bg-base'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base w-full'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
