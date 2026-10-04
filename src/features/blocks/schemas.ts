import { z } from "zod";

// Types de blocs
export const blockTypeSchema = z.enum([
  "letter",
  "gallery",
  "voice",
  "timeline",
  "counter",
  "quiz",
  "reveal",
  "music",
]);

export type BlockType = z.infer<typeof blockTypeSchema>;

// Schéma du bloc letter
export const letterBlockSchema = z.object({
  type: z.literal("letter"),
  content: z.string().min(1).max(10000),
  style: z.object({
    fontSize: z.enum(["sm", "md", "lg", "xl"]).default("md"),
    textAlign: z.enum(["left", "center", "right"]).default("left"),
    fontFamily: z.enum(["sans", "serif"]).default("serif"),
  }),
});

// Schéma du bloc gallery
export const galleryBlockSchema = z.object({
  type: z.literal("gallery"),
  images: z
    .array(
      z.object({
        id: z.string(),
        caption: z.string().max(200).optional(),
        position: z.number().int().min(0),
      }),
    )
    .min(1)
    .max(20),
  style: z.object({
    layout: z.enum(["grid", "carousel", "single"]).default("grid"),
    showCaptions: z.boolean().default(true),
  }),
});

// Schéma du bloc voice
export const voiceBlockSchema = z.object({
  type: z.literal("voice"),
  audioUrl: z.string().url(),
  duration: z.number().positive().max(300), // max 5 minutes
  transcription: z.string().max(5000).optional(),
  style: z.object({
    showTranscription: z.boolean().default(false),
    autoPlay: z.boolean().default(false),
  }),
});

// Schéma du bloc timeline
export const timelineBlockSchema = z.object({
  type: z.literal("timeline"),
  events: z
    .array(
      z.object({
        date: z.string(),
        title: z.string().max(100),
        description: z.string().max(500).optional(),
        icon: z.string().optional(),
      }),
    )
    .min(1)
    .max(20),
  style: z.object({
    orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
  }),
});

// Schéma du bloc counter
export const counterBlockSchema = z.object({
  type: z.literal("counter"),
  targetType: z.enum(["days", "hours", "custom"]),
  targetDate: z.string().optional(),
  targetValue: z.number().int().positive().optional(),
  label: z.string().max(50).optional(),
  style: z.object({
    size: z.enum(["sm", "md", "lg"]).default("md"),
    showLabel: z.boolean().default(true),
  }),
});

// Schéma du bloc quiz
export const quizBlockSchema = z.object({
  type: z.literal("quiz"),
  question: z.string().min(1).max(200),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1).max(100),
        isCorrect: z.boolean(),
      }),
    )
    .min(2)
    .max(6),
  style: z.object({
    shuffleOptions: z.boolean().default(false),
    showResult: z.boolean().default(true),
  }),
});

// Schéma du bloc reveal
export const revealBlockSchema = z.object({
  type: z.literal("reveal"),
  content: z.string().min(1).max(5000),
  mediaUrl: z.string().url().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
  style: z.object({
    revealTrigger: z.enum(["click", "swipe", "auto"]).default("click"),
    backgroundColor: z.string().optional(),
  }),
});

// Schéma du bloc music
export const musicBlockSchema = z.object({
  type: z.literal("music"),
  trackId: z.string(),
  loop: z.boolean().default(true),
  volume: z.number().min(0).max(1).default(0.8),
  style: z.object({
    showControls: z.boolean().default(true),
    autoPlay: z.boolean().default(false),
  }),
});

// Schéma générique d'un bloc
export const blockSchema = z.discriminatedUnion("type", [
  letterBlockSchema,
  galleryBlockSchema,
  voiceBlockSchema,
  timelineBlockSchema,
  counterBlockSchema,
  quizBlockSchema,
  revealBlockSchema,
  musicBlockSchema,
]);

export type Block = z.infer<typeof blockSchema>;

// Schéma complet d'un cadeau (validation globale)
export const giftSchema = z.object({
  blocks: z.array(blockSchema).min(1).max(12),
});

// Fonction de validation
export function validateGift(blocks: unknown[]): { valid: boolean; errors: string[] } {
  const result = giftSchema.safeParse({ blocks });

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`),
    };
  }

  // Validation additionnelle : reveal unique et dernier
  const revealCount = blocks.filter((b) => b.type === "reveal").length;
  if (revealCount > 1) {
    return {
      valid: false,
      errors: ["Un seul bloc 'reveal' est autorisé"],
    };
  }

  const lastBlock = blocks[blocks.length - 1];
  if (lastBlock.type !== "reveal") {
    return {
      valid: false,
      errors: ["Le dernier bloc doit être de type 'reveal'"],
    };
  }

  return { valid: true, errors: [] };
}

// Fonction de normalisation de l'ordre
export function normalizeOrder(blocks: Block[]): Block[] {
  // La logique de normalisation sera implémentée selon les besoins
  // Pour l'instant, on retourne les blocs tels quels
  return blocks;
}
