import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { events } from "./events";

export const rsvpStatusEnum = pgEnum("rsvp_status", [
  "going",
  "interested",
  "cancelled",
]);

export const rsvps = pgTable(
  "rsvps",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id),
    status: rsvpStatusEnum("status").notNull(),
    attendeeName: text("attendee_name"),
    attendeeEmail: text("attendee_email"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("rsvps_user_event_idx").on(t.userId, t.eventId),
    index("rsvps_event_id_idx").on(t.eventId),
  ],
);
