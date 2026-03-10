import {
  pgTable,
  text,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { events } from "./events";

export const eventViewTypeEnum = pgEnum("event_view_type", [
  "page_view",
  "share_click",
]);

export const eventViews = pgTable(
  "event_views",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    viewType: eventViewTypeEnum("view_type").notNull(),
    viewerSessionId: text("viewer_session_id"),
    viewerId: text("viewer_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("event_views_event_id_idx").on(t.eventId),
    index("event_views_event_type_idx").on(t.eventId, t.viewType),
  ],
);
