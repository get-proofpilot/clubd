import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { events } from "./events";

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed_amount",
]);

export const promoCodes = pgTable("promo_codes", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  eventId: text("event_id").references(() => events.id),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
