"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, variant = "info", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const variants = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-[var(--z-tooltip)] transition-opacity duration-300",
        variants[variant],
      )}
      role="alert"
    >
      {message}
    </div>
  );
}

/**
 * Hook pour gérer les toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; variant: ToastVariant }>>([]);

  const addToast = (message: string, variant: ToastVariant = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, variant }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
