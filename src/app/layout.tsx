import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../styles/design-tokens.css";

export const metadata: Metadata = {
  title: "Moment",
  description: "Un cadeau qui se vit",
};

export default function RootLayout() {
  redirect("/fr");
}
