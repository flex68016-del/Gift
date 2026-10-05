"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppCTAProps {
  phoneNumber: string;
  defaultMessage?: string;
  label?: string;
  position?: "floating" | "inline";
}

export default function WhatsAppCTA({
  phoneNumber,
  defaultMessage = "Je t'ai envoyé un cadeau spécial ! Scanne ce lien pour l'ouvrir :",
  label = "Partager sur WhatsApp",
  position = "floating",
}: WhatsAppCTAProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  const baseClasses = "flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full hover:bg-green-600 transition-colors";
  const floatingClasses = "fixed bottom-6 right-6 z-50 shadow-lg";
  const inlineClasses = "";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${position === "floating" ? floatingClasses : inlineClasses}`}
      aria-label={label}
    >
      <MessageCircle size={24} />
      {position === "inline" && <span>{label}</span>}
    </a>
  );
}
