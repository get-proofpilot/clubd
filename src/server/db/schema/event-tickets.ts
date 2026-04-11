import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { events } from "./events";

export const eventTickets = pgTable(
  "event_tickets",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id),
    name: text("name").notNull(),
    description: text("description"),
    priceInCents: integer("price_in_cents").notNull().default(0),
    originalPriceInCents: integer("original_price_in_cents"),
    capacity: integer("capacity"),
    soldCount: integer("sold_count").default(0),
    sortOrder: integer("sort_order").default(0),
    isPopular: boolean("is_popular").default(false),
    perks: text("perks").array(),
    salesStartAt: timestamp("sales_start_at", { withTimezone: true }),
    salesEndAt: timestamp("sales_end_at", { withTimezone: true }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("event_tickets_event_id_idx").on(t.eventId)],
);
