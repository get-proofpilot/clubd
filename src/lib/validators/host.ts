import { z } from "zod";

/**
 * Input schema for creating an announcement on an event.
 */
export const createAnnouncementInput = z.object({
  eventId: z.string(),
  message: z.string().min(1).max(2000),
});

/**
 * Input schema for searching users (co-host search).
 */
export const searchCoHostsInput = z.object({
  query: z.string().min(1).max(100),
});

/**
 * Input schema for adding a co-host to an event.
 */
export const addCoHostInput = z.object({
  eventId: z.string(),
  userId: z.string(),
});

/**
 * Input schema for removing a co-host from an event.
 */
export const removeCoHostInput = z.object({
  eventId: z.string(),
  userId: z.string(),
});

/**
 * Input schema for tracking event views (page views, share clicks).
 */
export const trackViewInput = z.object({
  eventId: z.string(),
  viewType: z.enum(["page_view", "share_click"]),
});
