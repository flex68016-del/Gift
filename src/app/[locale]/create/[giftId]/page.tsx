"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { EditorSteps } from "@/features/editor/components/EditorSteps";
import { BlockList } from "@/features/editor/components/BlockList";
import { useAutoSave } from "@/features/editor/useAutoSave";
import { GiftSettings, giftSettingsSchema } from "@/features/editor/schema";
import { Button } from "@/components/ui/Button";
import { Block, blockTypeSchema } from "@/features/blocks/schemas";

type Step = "theme" | "info" | "content" | "music" | "opening" | "preview";

export default function EditGiftPage() {
  const t = useTranslations("editor");
  const params = useParams();
  const router = useRouter();
  const giftId = params.giftId as string;

  const [currentStep, setStep] = useState<Step>("theme");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [blocks, setBlocks] = useState<Block[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<GiftSettings>({
    resolver: zodResolver(giftSettingsSchema),
    defaultValues: {
      themeKey: "birthday",
      locale: "fr",
      senderName: "",
      blocks: [],
      openSettings: { type: "immediate" },
      musicSettings: { type: "library" },
    },
  });

  const formData = watch();

  // Auto-save
  useAutoSave(formData, async (data) => {
    setSaveStatus("saving");
    try {
      await fetch(`/api/gifts/${giftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("idle");
    }
  });

  const addBlock = (type: z.infer<typeof blockTypeSchema>) => {
    const newBlock: Block = {
      type,
      // Valeurs par défaut selon le type
      ...(type === "letter" && {
        content: "",
        style: { fontSize: "md", textAlign: "left", fontFamily: "serif" },
      }),
      ...(type === "gallery" && {
        images: [],
        style: { layout: "grid", showCaptions: true },
      }),
      ...(type === "reveal" && {
        content: "",
        style: { revealTrigger: "click" },
      }),
    } as Block;

    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    try {
      await fetch(`/api/gifts/${giftId}/publish`, {
        method: "POST",
      });
      router.push(`/${formData.locale}/gift/${giftId}`);
    } catch (error) {
      console.error("Publish failed:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "theme":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("steps.theme")}</h2>
            <div className="grid grid-cols-2 gap-4">
              {["birthday", "love", "thank-you", "celebration"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setStep("info")}
                  className={`p-6 rounded-lg border-2 transition-colors ${
                    formData.themeKey === theme ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  <div className="text-4xl mb-2">{theme === "birthday" ? "🎂" : theme === "love" ? "❤️" : theme === "thank-you" ? "🙏" : "🎉"}</div>
                  <div className="font-medium capitalize">{theme}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case "info":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("steps.info")}</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Nom de l'expéditeur</label>
              <input {...register("senderName")} className="w-full px-4 py-2 border rounded-lg" />
              {errors.senderName && <p className="text-red-600 text-sm">{errors.senderName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Langue</label>
              <select {...register("locale")} className="w-full px-4 py-2 border rounded-lg">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        );

      case "content":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("steps.content")}</h2>
            <div className="flex gap-2 flex-wrap">
              {blockTypeSchema.options.map((type) => (
                <Button key={type} onClick={() => addBlock(type)} variant="outline" size="sm">
                  + {type}
                </Button>
              ))}
            </div>
            <BlockList blocks={blocks} onReorder={setBlocks} renderBlock={(block, index) => (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{block.type}</span>
                  <button onClick={() => removeBlock(index)} className="text-red-600 text-sm">Supprimer</button>
                </div>
                <div className="text-sm text-gray-500">Contenu du bloc...</div>
              </div>
            )} />
          </div>
        );

      case "music":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("steps.music")}</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Type de musique</label>
              <select {...register("musicSettings.type")} className="w-full px-4 py-2 border rounded-lg">
                <option value="library">Bibliothèque</option>
                <option value="integration">Lien (YouTube/Spotify)</option>
              </select>
            </div>
            {formData.musicSettings?.type === "integration" && (
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input {...register("musicSettings.integrationUrl")} className="w-full px-4 py-2 border rounded-lg" placeholder="https://youtube.com/watch?v=..." />
              </div>
            )}
          </div>
        );

      case "opening":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("steps.opening")}</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Type d'ouverture</label>
              <select {...register("openSettings.type")} className="w-full px-4 py-2 border rounded-lg">
                <option value="immediate">Immédiate</option>
                <option value="secret">Mot secret</option>
                <option value="scheduled">Date programmée</option>
              </select>
            </div>
            {formData.openSettings?.type === "secret" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Mot secret</label>
                  <input {...register("openSettings.secret")} type="password" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Indice</label>
                  <input {...register("openSettings.hint")} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </>
            )}
            {formData.openSettings?.type === "scheduled" && (
              <div>
                <label className="block text-sm font-medium mb-2">Date et heure</label>
                <input {...register("openSettings.scheduledAt")} type="datetime-local" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            )}
          </div>
        );

      case "preview":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("steps.preview")}</h2>
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-center text-gray-500">Aperçu du cadeau...</p>
            </div>
            <Button onClick={handlePublish} className="w-full">{t("publish")}</Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Éditeur de cadeau</h1>
          <div className="text-sm">
            {saveStatus === "saving" && <span className="text-yellow-600">{t("saving")}</span>}
            {saveStatus === "saved" && <span className="text-green-600">{t("saved")}</span>}
          </div>
        </div>

        <EditorSteps currentStep={currentStep} onStepChange={setStep} />

        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button onClick={() => {
            const steps: Step[] = ["theme", "info", "content", "music", "opening", "preview"];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex > 0) setStep(steps[currentIndex - 1]);
          }} disabled={currentStep === "theme"} variant="outline">
            Précédent
          </Button>
          <Button onClick={() => {
            const steps: Step[] = ["theme", "info", "content", "music", "opening", "preview"];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
          }} disabled={currentStep === "preview"}>
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
