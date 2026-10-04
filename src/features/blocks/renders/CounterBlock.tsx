"use client";

import { useState, useEffect } from "react";

interface CounterBlockProps {
  targetType: "days" | "hours" | "custom";
  targetDate?: string;
  targetValue?: number;
  label?: string;
  style: {
    size: "sm" | "md" | "lg";
    showLabel: boolean;
  };
}

export function CounterBlock({ targetType, targetDate, targetValue, label, style }: CounterBlockProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (targetType === "custom" && targetValue !== undefined) {
      setValue(targetValue);
      return;
    }

    if (targetDate) {
      const target = new Date(targetDate).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
          clearInterval(interval);
          setValue(0);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        setValue(targetType === "days" ? days : hours);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [targetType, targetDate, targetValue]);

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  return (
    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className={sizeClasses[style.size]} font-bold text-gray-900 dark:text-gray-100">
        {value}
      </div>
      {style.showLabel && (label || targetType) && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {label || (targetType === "days" ? "Jours" : "Heures")}
        </p>
      )}
    </div>
  );
}
