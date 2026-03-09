import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

export const eventCategoryEnum = pgEnum("event_category", [
  "fitness",
  "wellness",
  "social",
  "outdoor",
  "food_drink",
  "creative",
  "family",
  "community",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "cancelled",
]);

export const events = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    hostId: text("host_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    category: eventCategoryEnum("category").notNull(),
    locationLat: text("location_lat"),
    locationLng: text("location_lng"),
    address: text("address"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    capacity: integer("capacity"),
    rsvpCount: integer("rsvp_count").default(0),
    imageUrl: text("image_url"),
    status: eventStatusEnum("status").default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("events_starts_at_idx").on(t.startsAt),
    index("events_category_idx").on(t.category),
    index("events_host_id_idx").on(t.hostId),
  ],
);
