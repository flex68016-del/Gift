import { useEffect,useState } from "react";

type GiftState = "locked" | "ready" | "intro" | "blocks" | "finale" | "ended";

interface GiftExperienceData {
  giftId: string;
  themeKey: string;
  openSettings: {
    type: "immediate" | "secret" | "scheduled";
    secret?: string;
    hint?: string;
    scheduledAt?: string;
  };
  blocks: any[];
}

export function useGiftExperience(slug: string) {
  const [state, setState] = useState<GiftState>("locked");
  const [data, setData] = useState<GiftExperienceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  // Charger le contenu au montage
  useEffect(() => {
    loadContent();
  }, [slug]);

  // Reprise du dernier bloc vu (stockage local)
  useEffect(() => {
    const savedState = localStorage.getItem(`gift_${slug}_state`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.state && parsed.currentBlockIndex !== undefined) {
          setState(parsed.state);
          setCurrentBlockIndex(parsed.currentBlockIndex);
        }
      } catch (e) {
        // Ignorer les erreurs de parsing
      }
    }
  }, [slug]);

  // Sauvegarde de l'état (sans donnée sensible)
  useEffect(() => {
    if (state !== "locked") {
      localStorage.setItem(
        `gift_${slug}_state`,
        JSON.stringify({
          state,
          currentBlockIndex,
        }),
      );
    }
  }, [state, currentBlockIndex, slug]);

  const unlock = async (secret: string) => {
    try {
      const response = await fetch(`/api/g/${slug}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });

      if (response.ok) {
        // Recharger le contenu après déverrouillage
        await loadContent();
      } else {
        const data = await response.json();
        setError(data.error || "Unlock failed");
      }
    } catch (e) {
      setError("Network error");
    }
  };

  const loadContent = async () => {
    try {
      const response = await fetch(`/api/g/${slug}/content`);

      if (response.status === 423) {
        // Cadeau planifié avant l'échéance
        setError("scheduled");
        return;
      }

      if (!response.ok) {
        setError("Failed to load content");
        return;
      }

      const giftData = await response.json();
      setData(giftData.gift);

      // Déterminer l'état initial selon le mode d'ouverture
      if (giftData.gift.openSettings.type === "immediate") {
        setState("intro");
      } else if (giftData.gift.openSettings.type === "secret") {
        setState("ready");
      } else {
        setState("intro");
      }
    } catch (e) {
      setError("Network error");
    }
  };

  const completeIntro = () => {
    setState("blocks");
  };

  const nextBlock = () => {
    if (data && currentBlockIndex < data.blocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    } else {
      setState("finale");
    }
  };

  const completeFinale = () => {
    setState("ended");
    // Nettoyer le stockage local
    localStorage.removeItem(`gift_${slug}_state`);
  };

  const report = async (reason: string) => {
    try {
      const response = await fetch(`/api/g/${slug}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error("Report failed");
      }

      return true;
    } catch (e) {
      return false;
    }
  };

  return {
    state,
    data,
    error,
    currentBlockIndex,
    unlock,
    loadContent,
    completeIntro,
    nextBlock,
    completeFinale,
    report,
  };
}
