import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'link';
  size?: 'default' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 border border-transparent',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900',
    link: 'bg-transparent text-blue-600 underline-offset-4 hover:underline border-none p-0'
  };
  
  const sizeClasses = {
    default: 'h-10 py-2 px-4 text-sm',
    lg: 'h-11 px-8 text-base'
  };
  
  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    variant !== 'link' ? sizeClasses[size] : 'p-0',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};
