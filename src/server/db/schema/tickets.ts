import {
  pgTable,
  text,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { events } from "./events";
import { rsvps } from "./rsvps";
import { orders } from "./orders";
import { orderItems } from "./order-items";
import { eventTickets } from "./event-tickets";

export const ticketStatusEnum = pgEnum("ticket_status", [
  "active",
  "used",
  "cancelled",
  "transferred",
]);

export const tickets = pgTable(
  "tickets",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id),
    rsvpId: text("rsvp_id").references(() => rsvps.id),
    orderId: text("order_id").references(() => orders.id),
    orderItemId: text("order_item_id").references(() => orderItems.id),
    ticketTierId: text("ticket_tier_id").references(() => eventTickets.id),
    qrCodeHash: text("qr_code_hash").notNull(),
    status: ticketStatusEnum("status").default("active").notNull(),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("tickets_user_id_idx").on(t.userId),
    index("tickets_event_id_idx").on(t.eventId),
  ],
);
