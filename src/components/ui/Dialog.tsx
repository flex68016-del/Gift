"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
