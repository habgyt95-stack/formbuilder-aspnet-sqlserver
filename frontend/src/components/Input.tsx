import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-fb-foreground">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2 border border-fb-border rounded-md focus:outline-none focus:ring-2 focus:ring-fb-primary ${
          error ? 'border-fb-error' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-fb-error">{error}</span>}
    </div>
  );
};
