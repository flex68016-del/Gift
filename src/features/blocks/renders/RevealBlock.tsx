"use client";

import { useState } from "react";
import { Reveal } from "@/motion/primitives/Reveal";

interface RevealBlockProps {
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  style: {
    revealTrigger: "click" | "swipe" | "auto";
    backgroundColor?: string;
  };
}

export function RevealBlock({ content, mediaUrl, mediaType, style }: RevealBlockProps) {
  const [isRevealed, setIsRevealed] = useState(style.revealTrigger === "auto");

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <div
      className="p-4 rounded-lg shadow-sm min-h-32 flex items-center justify-center"
      style={{ backgroundColor: style.backgroundColor || "white" }}
    >
      {!isRevealed ? (
        <button
          onClick={handleReveal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Révéler
        </button>
      ) : (
        <Reveal>
          <div className="text-center">
            {mediaUrl && mediaType === "image" && (
              <img src={mediaUrl} alt="" className="max-w-full h-auto rounded-lg mb-4" />
            )}
            {mediaUrl && mediaType === "video" && (
              <video src={mediaUrl} controls className="max-w-full h-auto rounded-lg mb-4" />
            )}
            <p className="text-lg text-gray-900 dark:text-gray-100">{content}</p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
