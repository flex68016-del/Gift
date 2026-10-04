import { BirthdayEnvelopeScene } from "@/motion/themes/birthday-envelope/scene";
import { ParchmentScene } from "@/motion/themes/parchment/scene";
import { GiftRibbonScene } from "@/motion/themes/gift-ribbon/scene";
import { LetterBlock } from "@/features/blocks/renders/LetterBlock";
import { GalleryBlock } from "@/features/blocks/renders/GalleryBlock";
import { VoiceBlock } from "@/features/blocks/renders/VoiceBlock";
import { TimelineBlock } from "@/features/blocks/renders/TimelineBlock";
import { CounterBlock } from "@/features/blocks/renders/CounterBlock";
import { QuizBlock } from "@/features/blocks/renders/QuizBlock";
import { RevealBlock } from "@/features/blocks/renders/RevealBlock";
import { MusicBlock } from "@/features/blocks/renders/MusicBlock";
import { forceTier } from "@/motion/perf/tier";
import { useTier } from "@/motion/perf/useTier";
import { useState } from "react";

const testBlocks = [
  {
    type: "letter" as const,
    content: "Cher ami,\n\nJoyeux anniversaire ! Que cette journée te soit remplie de bonheur et de lumière.\n\nAvec tout mon amour,\nMarie",
    style: { fontSize: "md" as const, textAlign: "left" as const, fontFamily: "sans" as const },
  },
  {
    type: "gallery" as const,
    images: [
      { id: "1", caption: "Souvenir 1", position: 0 },
      { id: "2", caption: "Souvenir 2", position: 1 },
    ],
    style: { layout: "grid" as const, showCaptions: true },
  },
  {
    type: "voice" as const,
    audioUrl: "https://example.com/audio.mp3",
    duration: 30,
    style: { showTranscription: true, autoPlay: false },
  },
  {
    type: "timeline" as const,
    events: [
      { date: "2020", title: "Notre rencontre", description: "Le jour où on s'est rencontrés" },
      { date: "2022", title: "Nos premiers pas", description: "Début de notre aventure" },
    ],
    style: { orientation: "vertical" as const },
  },
  {
    type: "counter" as const,
    targetType: "days" as const,
    targetDate: "2024-12-31",
    label: "Jours ensemble",
    style: { size: "md" as const, showLabel: true },
  },
  {
    type: "quiz" as const,
    question: "Quel est notre plat préféré ?",
    options: [
      { id: "1", text: "Pizza", isCorrect: false },
      { id: "2", text: "Sushi", isCorrect: true },
      { id: "3", text: "Pâtes", isCorrect: false },
    ],
    style: { shuffleOptions: false, showResult: true },
  },
  {
    type: "reveal" as const,
    content: "Tu es incroyable !",
    style: { revealTrigger: "click" as const, backgroundColor: undefined },
  },
  {
    type: "music" as const,
    trackId: "track-1",
    loop: true,
    volume: 0.7,
    style: { showControls: true, autoPlay: false },
  },
];

export default function AllThemesTestPage() {
  const { tier } = useTier();
  const [selectedTheme, setSelectedTheme] = useState<"birthday" | "parchment" | "gift">("birthday");
  const [showBlocks, setShowBlocks] = useState(false);

  const renderScene = () => {
    switch (selectedTheme) {
      case "birthday":
        return (
          <BirthdayEnvelopeScene
            onOpen={() => setShowBlocks(true)}
            onSkip={() => setShowBlocks(true)}
            tier={tier}
          />
        );
      case "parchment":
        return (
          <ParchmentScene
            onOpen={() => setShowBlocks(true)}
            onSkip={() => setShowBlocks(true)}
            tier={tier}
          />
        );
      case "gift":
        return (
          <GiftRibbonScene
            onOpen={() => setShowBlocks(true)}
            onSkip={() => setShowBlocks(true)}
            tier={tier}
          />
        );
    }
  };

  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case "letter":
        return <LetterBlock key={index} content={block.content} style={block.style} />;
      case "gallery":
        return <GalleryBlock key={index} images={block.images} style={block.style} />;
      case "voice":
        return <VoiceBlock key={index} audioUrl={block.audioUrl} duration={block.duration} transcription={undefined} style={block.style} />;
      case "timeline":
        return <TimelineBlock key={index} events={block.events} style={block.style} />;
      case "counter":
        return <CounterBlock key={index} targetType={block.targetType} targetDate={block.targetDate} label={block.label} style={block.style} />;
      case "quiz":
        return <QuizBlock key={index} question={block.question} options={block.options} style={block.style} />;
      case "reveal":
        return <RevealBlock key={index} content={block.content} style={block.style} />;
      case "music":
        return <MusicBlock key={index} trackId={block.trackId} loop={block.loop} volume={block.volume} style={block.style} />;
      default:
        return <div key={index}>Unknown block type</div>;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg max-w-xs">
        <h1 className="text-lg font-bold mb-2">Test des thèmes</h1>
        <p className="text-sm mb-2">Niveau détecté: {tier}</p>
        <div className="space-y-2 mb-4">
          <button
            onClick={() => forceTier("lite")}
            className="block w-full px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Force Lite
          </button>
          <button
            onClick={() => forceTier("standard")}
            className="block w-full px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Force Standard
          </button>
          <button
            onClick={() => forceTier("ultra")}
            className="block w-full px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Force Ultra
          </button>
          <button
            onClick={() => forceTier(null)}
            className="block w-full px-3 py-1 bg-blue-200 rounded hover:bg-blue-300 text-sm"
          >
            Auto-detect
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Thème:</label>
          <select
            value={selectedTheme}
            onChange={(e) => {
              setSelectedTheme(e.target.value as any);
              setShowBlocks(false);
            }}
            className="w-full px-3 py-1 border rounded"
          >
            <option value="birthday">Anniversaire</option>
            <option value="parchment">Parchemin</option>
            <option value="gift">Cadeau</option>
          </select>
        </div>
      </div>

      {!showBlocks ? (
        renderScene()
      ) : (
        <div className="max-w-2xl mx-auto p-8">
          <h2 className="text-2xl font-bold mb-6">Test des blocs - {selectedTheme}</h2>
          <div className="space-y-8">
            {testBlocks.map((block, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2 text-gray-500">Block: {block.type}</h3>
                {renderBlock(block, index)}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowBlocks(false)}
            className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Rejouer la scène
          </button>
        </div>
      )}
    </div>
  );
}
