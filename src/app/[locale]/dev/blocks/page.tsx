"use client";

import { CounterBlock } from "@/features/blocks/renders/CounterBlock";
import { GalleryBlock } from "@/features/blocks/renders/GalleryBlock";
import { LetterBlock } from "@/features/blocks/renders/LetterBlock";
import { MusicBlock } from "@/features/blocks/renders/MusicBlock";
import { QuizBlock } from "@/features/blocks/renders/QuizBlock";
import { RevealBlock } from "@/features/blocks/renders/RevealBlock";
import { TimelineBlock } from "@/features/blocks/renders/TimelineBlock";
import { VoiceBlock } from "@/features/blocks/renders/VoiceBlock";

export default function BlocksDevPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8">Moteur de blocs - Développement</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4">Letter Block</h2>
          <LetterBlock
            content="Cher ami,\n\nC'est avec joie que je t'envoi ce cadeau. J'espère qu'il te rappellera les bons moments partagés ensemble.\n\nBisous,"
            style={{ fontSize: "md", textAlign: "center", fontFamily: "serif" }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Gallery Block</h2>
          <GalleryBlock
            images={[
              { id: "https://via.placeholder.com/150", caption: "Moment 1", position: 0 },
              { id: "https://via.placeholder.com/150", caption: "Moment 2", position: 1 },
              { id: "https://via.placeholder.com/150", caption: "Moment 3", position: 2 },
            ]}
            style={{ layout: "grid", showCaptions: true }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Voice Block</h2>
          <VoiceBlock
            audioUrl="/voice-sample.mp3"
            duration={120}
            transcription="Ceci est une transcription de test du message vocal."
            style={{ showTranscription: true, autoPlay: false }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Timeline Block</h2>
          <TimelineBlock
            events={[
              { date: "2023-01-01", title: "Début", description: "Notre amitié commence", icon: "🎉" },
              { date: "2023-06-15", title: "Voyage", description: "Un voyage inoubliable", icon: "✈️" },
              { date: "2023-12-25", title: "Noël", description: "Fêtes ensemble", icon: "🎄" },
            ]}
            style={{ orientation: "horizontal" }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Counter Block</h2>
          <CounterBlock
            targetType="days"
            targetDate="2025-01-01"
            label="Jours restants"
            style={{ size: "lg", showLabel: true }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Quiz Block</h2>
          <QuizBlock
            question="Quelle est notre couleur préférée ?"
            options={[
              { id: "1", text: "Bleu", isCorrect: true },
              { id: "2", text: "Rouge", isCorrect: false },
              { id: "3", text: "Vert", isCorrect: false },
            ]}
            style={{ shuffleOptions: true, showResult: true }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Reveal Block</h2>
          <RevealBlock
            content="Surprise ! 🎉 C'est le moment de révéler le secret."
            style={{ revealTrigger: "click", backgroundColor: "#fef3c7" }}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Music Block</h2>
          <MusicBlock
            trackId="track-1"
            loop={true}
            volume={0.8}
            style={{ showControls: true, autoPlay: false }}
          />
        </section>
      </div>
    </div>
  );
}
