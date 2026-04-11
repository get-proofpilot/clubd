import { pgTable, text, integer, index } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { eventTickets } from "./event-tickets";

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    ticketTierId: text("ticket_tier_id")
      .notNull()
      .references(() => eventTickets.id),
    quantity: integer("quantity").notNull(),
    unitPriceInCents: integer("unit_price_in_cents").notNull(),
  },
  (t) => [index("order_items_order_id_idx").on(t.orderId)],
);
