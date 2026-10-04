"use client";

import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled = false, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}
