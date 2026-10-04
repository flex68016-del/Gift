"use client";

import { useState } from "react";

import { Haptics } from "@/motion/primitives/Haptics";

interface QuizBlockProps {
  question: string;
  options: Array<{ id: string; text: string; isCorrect: boolean }>;
  style: {
    shuffleOptions: boolean;
    showResult: boolean;
  };
}

export function QuizBlock({ question, options, style }: QuizBlockProps) {
  const [shuffledOptions, setShuffledOptions] = useState(() =>
    style.shuffleOptions ? [...options].sort(() => Math.random() - 0.5) : options,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (id: string) => {
    if (showResult) return;
    setSelectedId(id);
    setShowResult(true);
    Haptics.medium();

    const isCorrect = options.find((o) => o.id === id)?.isCorrect;
    if (isCorrect) {
      Haptics.success();
    } else {
      Haptics.error();
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{question}</h3>
      <div className="space-y-2">
        {shuffledOptions.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.isCorrect;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={showResult}
              className={`
                w-full text-left p-3 rounded border transition-colors
                ${isSelected
                  ? isCorrect
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "bg-red-100 border-red-500 text-red-700"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }
                ${showResult && !isSelected && isCorrect ? "bg-green-100 border-green-500 text-green-700" : ""}
              `}
            >
              {option.text}
            </button>
          );
        })}
      </div>
      {showResult && style.showResult && (
        <p className="mt-4 text-sm text-center">
          {selectedId && options.find((o) => o.id === selectedId)?.isCorrect
            ? "✓ Correct !"
            : selectedId
            ? "✗ Incorrect"
            : "Veuillez sélectionner une réponse"}
        </p>
      )}
    </div>
  );
}
