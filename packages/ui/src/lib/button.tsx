import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, variant = 'primary', className, ...rest }: ButtonProps) {
  const base = 'rounded-md px-4 py-2 text-sm font-medium transition-colors';
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-500',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
}
