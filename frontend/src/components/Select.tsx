import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
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
      <select
        className={`px-3 py-2 border border-fb-border rounded-md focus:outline-none focus:ring-2 focus:ring-fb-primary ${
          error ? 'border-fb-error' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-fb-error">{error}</span>}
    </div>
  );
};
