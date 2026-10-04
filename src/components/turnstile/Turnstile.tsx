"use client";

import { useEffect, useRef, useState } from "react";

import { env } from "@/lib/env";

interface TurnstileProps {
  siteKey?: string;
  onSuccess?: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string;
    };
  }
}

export function Turnstile({ siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, onSuccess, onError, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Charger le script Turnstile
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.turnstile) return;

    const newWidgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        onSuccess?.(token);
      },
      "error-callback": () => {
        onError?.();
      },
      "expired-callback": () => {
        onExpire?.();
      },
    });

    setWidgetId(newWidgetId);
  }, [isLoaded, siteKey, onSuccess, onError, onExpire]);

  return <div ref={containerRef} />;
}
