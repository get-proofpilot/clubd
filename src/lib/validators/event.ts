import { z } from "zod";

const eventCategoryValues = [
  "fitness",
  "wellness",
  "social",
  "outdoor",
  "food_drink",
  "creative",
  "family",
  "community",
] as const;

const eventPricingTypeValues = ["free", "free_with_upsell", "paid"] as const;

const repeatFrequencyValues = [
  "weekly",
  "biweekly",
  "monthly",
  "custom",
] as const;

/**
 * Input schema for creating a new event (draft).
 * Only title, category, and startsAt are required for drafts.
 */
export const createEventInput = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(5000).optional(),
  category: z.enum(eventCategoryValues),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  locationName: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  locationLat: z.string().optional(),
  locationLng: z.string().optional(),
  locationPlaceId: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  pricingType: z.enum(eventPricingTypeValues).default("free"),
  serviceFeePercent: z.number().int().min(0).max(100).default(7),
  imageKeys: z.array(z.string()).max(5).optional(),
  communityId: z.string().optional(),
});

/**
 * Input schema for updating an existing event.
 * eventId is required, all other fields are optional.
 */
export const updateEventInput = z.object({
  eventId: z.string(),
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(5000).optional(),
  category: z.enum(eventCategoryValues).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional().nullable(),
  locationName: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  locationLat: z.string().optional(),
  locationLng: z.string().optional(),
  locationPlaceId: z.string().optional(),
  capacity: z.number().int().positive().optional().nullable(),
  pricingType: z.enum(eventPricingTypeValues).optional(),
  serviceFeePercent: z.number().int().min(0).max(100).optional(),
  imageKeys: z.array(z.string()).max(5).optional(),
});

/**
 * Input schema for publishing an event.
 * Separate action from update -- validates event is ready for public visibility.
 */
export const publishEventInput = z.object({
  eventId: z.string(),
});

/**
 * Input schema for cancelling an event.
 * Events are cancelled, never deleted (locked decision).
 */
export const cancelEventInput = z.object({
  eventId: z.string(),
  reason: z.string().max(500).optional(),
});

/**
 * Input schema for repeating an event (creating recurring occurrences).
 * Template-based: each occurrence is a separate event pre-filled from source.
 */
export const repeatEventInput = z.object({
  eventId: z.string(),
  frequency: z.enum(repeatFrequencyValues),
  count: z.number().int().min(1).max(52),
  customIntervalDays: z.number().int().positive().optional(),
});
