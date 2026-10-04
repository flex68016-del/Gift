import { cn } from "@/lib/utils";

interface LetterBlockProps {
  content: string;
  style: {
    fontSize: "sm" | "md" | "lg" | "xl";
    textAlign: "left" | "center" | "right";
    fontFamily: "sans" | "serif";
  };
}

export function LetterBlock({ content, style }: LetterBlockProps) {
  const fontSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const fontFamilyClasses = {
    sans: "font-sans",
    serif: "font-serif",
  };

  // Échappement HTML sécurisé
  const escapedContent = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  // Mini-balisage pour le gras/italique et les sauts de ligne
  const formattedContent = escapedContent
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\/\/(.*?)\/\//g, "<em>$1</em>")
    .replace(/\n/g, "<br />");

  return (
    <div
      className={cn(
        "p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm",
        fontSizeClasses[style.fontSize],
        textAlignClasses[style.textAlign],
        fontFamilyClasses[style.fontFamily],
      )}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
}
