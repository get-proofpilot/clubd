import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { events } from "./events";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "completed",
  "refunded",
  "cancelled",
]);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id),
    status: orderStatusEnum("status").default("pending").notNull(),
    subtotalInCents: integer("subtotal_in_cents").notNull(),
    serviceFeeInCents: integer("service_fee_in_cents").notNull().default(0),
    discountInCents: integer("discount_in_cents").default(0),
    totalInCents: integer("total_in_cents").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    promoCodeId: text("promo_code_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("orders_user_id_idx").on(t.userId),
    index("orders_event_id_idx").on(t.eventId),
  ],
);
