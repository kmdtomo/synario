import React from "react";
import { Spinner } from "./spinner";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'loading'> {
  children: React.ReactNode;
  loading?: boolean;
}

export function Button({ children, loading, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {loading && <Spinner className="text-white" />}
      {children}
    </button>
  );
} 