import { ButtonHTMLAttributes } from "react";
import { Spinner } from "./spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ 
  children, 
  loading = false, 
  variant = 'primary',
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = "w-full py-3 rounded-lg transition-all duration-200 font-medium focus:outline-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300",
    outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
  };

  const variantStyle = variants[variant];
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyle}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <Spinner className="w-5 h-5" />}
        {children}
      </div>
    </button>
  );
} 