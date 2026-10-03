import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Moment",
  description: "Un cadeau qui se vit",
};

export default function RootLayout() {
  redirect("/fr");
}
