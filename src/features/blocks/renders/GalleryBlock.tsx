"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface GalleryBlockProps {
  images: Array<{ id: string; caption?: string; position: number }>;
  style: {
    layout: "grid" | "carousel" | "single";
    showCaptions: boolean;
  };
}

export function GalleryBlock({ images, style }: GalleryBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (style.layout === "single" && images.length > 0) {
    const image = images[0];
    if (!image) return null;
    return (
      <div className="relative">
        <img
          src={image.id}
          alt={image.caption || ""}
          className="w-full h-64 object-cover rounded-lg"
        />
        {style.showCaptions && image.caption && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{image.caption}</p>
        )}
      </div>
    );
  }

  if (style.layout === "carousel") {
    const image = images[currentIndex];
    if (!image) return null;
    return (
      <div className="relative">
        <img
          src={image.id}
          alt={image.caption || ""}
          className="w-full h-64 object-cover rounded-lg"
        />
        {style.showCaptions && image.caption && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{image.caption}</p>
        )}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
          >
            ←
          </button>
          <span className="text-sm">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={() => setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
          >
            →
          </button>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div className={cn("grid gap-2", style.layout === "grid" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1")}>
      {images.map((image) => (
        <div key={image.id} className="relative">
          <img
            src={image.id}
            alt={image.caption || ""}
            className="w-full h-32 object-cover rounded-lg cursor-pointer"
          />
          {style.showCaptions && image.caption && (
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 truncate">{image.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
}
