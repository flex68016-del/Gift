import { z } from "zod";

import { blockSchema } from "@/features/blocks/schemas";

export const giftSettingsSchema = z.object({
  themeKey: z.string().min(1).max(50),
  locale: z.enum(["fr", "en"]),
  senderName: z.string().min(1).max(100),
  blocks: z.array(blockSchema).min(1).max(12),
  openSettings: z
    .object({
      type: z.enum(["immediate", "secret", "scheduled"]),
      secret: z.string().optional(),
      hint: z.string().max(200).optional(),
      scheduledAt: z.string().optional(), // ISO 8601 UTC
    })
    .optional(),
  musicSettings: z
    .object({
      type: z.enum(["library", "integration"]),
      trackId: z.string().optional(),
      integrationUrl: z.string().url().optional(),
    })
    .optional(),
});

export type GiftSettings = z.infer<typeof giftSettingsSchema>;
