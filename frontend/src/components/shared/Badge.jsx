export function Badge({ variant = 'primary', size = 'md', children }) {
  const variants = {
    primary: 'bg-brand-primary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    danger: 'bg-danger text-white',
    info: 'bg-medical text-white',
    outline: 'bg-white border border-brand-primary text-brand-primary'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`inline-block rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
