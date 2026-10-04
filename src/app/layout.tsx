import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../styles/design-tokens.css";
import "@/lib/queue/jobs"; // Enregistre les jobs de la file de tâches
import "@/motion/themes/birthday-envelope"; // Enregistre le thème anniversaire

export const metadata: Metadata = {
  title: "Moment",
  description: "Un cadeau qui se vit",
};

export default function RootLayout() {
  redirect("/fr");
}
