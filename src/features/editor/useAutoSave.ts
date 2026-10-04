import { useEffect, useRef } from "react";

export function useAutoSave<T>(data: T, saveFn: (data: T) => Promise<void>, delay: number = 800) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<T>(data);

  useEffect(() => {
    // Ne sauvegarder que si les données ont changé
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    previousDataRef.current = data;

    // Annuler le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Nouveau timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await saveFn(data);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFn, delay]);
}
