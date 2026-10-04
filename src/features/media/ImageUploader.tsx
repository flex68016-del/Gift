"use client";

import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";

interface ImageUploaderProps {
  onImageUpload: (file: File, compressed: File, thumbnail: File) => Promise<void>;
  maxImages?: number;
  currentCount?: number;
}

export function ImageUploader({ onImageUpload, maxImages = 10, currentCount = 0 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (currentCount + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      for (const file of files) {
        // Options de compression
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
          initialQuality: 0.8,
        };

        // Compression de l'image principale
        const compressed = await imageCompression(file, options);

        // Création de la miniature (480px max)
        const thumbnailOptions = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 480,
          useWebWorker: true,
          initialQuality: 0.7,
        };
        const thumbnail = await imageCompression(file, thumbnailOptions);

        await onImageUpload(file, compressed, thumbnail);
      }
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("Failed to process image");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        disabled={isUploading || currentCount >= maxImages}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer ${
          isUploading || currentCount >= maxImages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        {isUploading ? "Processing..." : `Add Images (${currentCount}/${maxImages})`}
      </label>
    </div>
  );
}
