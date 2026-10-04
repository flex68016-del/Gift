"use client";

import { useState } from "react";
import { Stepper } from "@/components/ui/Stepper";
import { useTranslations } from "next-intl";

type Step = "theme" | "info" | "content" | "music" | "opening" | "preview";

interface EditorStepsProps {
  currentStep: Step;
  onStepChange: (step: Step) => void;
}

export function EditorSteps({ currentStep, onStepChange }: EditorStepsProps) {
  const t = useTranslations("editor");

  const steps: Step[] = ["theme", "info", "content", "music", "opening", "preview"];

  const stepLabels = {
    theme: t("steps.theme"),
    info: t("steps.info"),
    content: t("steps.content"),
    music: t("steps.music"),
    opening: t("steps.opening"),
    preview: t("steps.preview"),
  };

  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="mb-8">
      <Stepper
        steps={steps.map((s) => stepLabels[s])}
        currentStep={currentIndex}
        onStepChange={(index) => onStepChange(steps[index])}
      />
    </div>
  );
}
