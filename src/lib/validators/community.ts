import { z } from "zod";

const communityTypeValues = [
  "community",
  "studio",
  "brand",
  "organization",
] as const;

const categoryValues = [
  "fitness",
  "wellness",
  "social",
  "outdoor",
  "food_drink",
  "creative",
  "family",
  "community",
] as const;

export const createCommunityInput = z.object({
  name: z.string().min(3).max(100),
  type: z.enum(communityTypeValues),
  category: z.enum(categoryValues).optional(),
  description: z.string().max(2000).optional(),
  avatarUrl: z.string().optional(),
  coverImageUrl: z.string().optional(),
  locationLabel: z.string().max(200).optional(),
  locationLat: z.string().optional(),
  locationLng: z.string().optional(),
  instagramHandle: z.string().max(100).optional(),
  websiteUrl: z.string().url().max(500).optional(),
});

export const updateCommunityInput = z.object({
  communityId: z.string(),
  name: z.string().min(3).max(100).optional(),
  type: z.enum(communityTypeValues).optional(),
  category: z.enum(categoryValues).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  coverImageUrl: z.string().optional().nullable(),
  locationLabel: z.string().max(200).optional().nullable(),
  locationLat: z.string().optional().nullable(),
  locationLng: z.string().optional().nullable(),
  instagramHandle: z.string().max(100).optional().nullable(),
  websiteUrl: z.string().url().max(500).optional().nullable(),
});
