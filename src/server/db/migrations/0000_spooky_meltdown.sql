CREATE TYPE "public"."discount_type" AS ENUM('percentage', 'fixed_amount');--> statement-breakpoint
CREATE TYPE "public"."event_category" AS ENUM('fitness', 'wellness', 'social', 'outdoor', 'food_drink', 'creative', 'family', 'community');--> statement-breakpoint
CREATE TYPE "public"."event_pricing_type" AS ENUM('free', 'free_with_upsell', 'paid');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'completed', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."rsvp_status" AS ENUM('going', 'interested', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('active', 'used', 'cancelled', 'transferred');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price_in_cents" integer DEFAULT 0 NOT NULL,
	"original_price_in_cents" integer,
	"capacity" integer,
	"sold_count" integer DEFAULT 0,
	"sort_order" integer DEFAULT 0,
	"is_popular" boolean DEFAULT false,
	"perks" text[],
	"sales_start_at" timestamp with time zone,
	"sales_end_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"host_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" "event_category" NOT NULL,
	"location_lat" text,
	"location_lng" text,
	"address" text,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"capacity" integer,
	"rsvp_count" integer DEFAULT 0,
	"image_url" text,
	"status" "event_status" DEFAULT 'draft',
	"pricing_type" "event_pricing_type" DEFAULT 'free' NOT NULL,
	"service_fee_percent" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"ticket_tier_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price_in_cents" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event_id" text NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"subtotal_in_cents" integer NOT NULL,
	"service_fee_in_cents" integer DEFAULT 0 NOT NULL,
	"discount_in_cents" integer DEFAULT 0,
	"total_in_cents" integer NOT NULL,
	"stripe_payment_intent_id" text,
	"promo_code_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"event_id" text,
	"discount_type" "discount_type" NOT NULL,
	"discount_value" integer NOT NULL,
	"max_uses" integer,
	"current_uses" integer DEFAULT 0,
	"expires_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promo_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event_id" text NOT NULL,
	"status" "rsvp_status" NOT NULL,
	"attendee_name" text,
	"attendee_email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event_id" text NOT NULL,
	"rsvp_id" text,
	"order_id" text,
	"order_item_id" text,
	"ticket_tier_id" text,
	"qr_code_hash" text NOT NULL,
	"status" "ticket_status" DEFAULT 'active' NOT NULL,
	"checked_in_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"email_verified" boolean DEFAULT false,
	"image" text,
	"phone_number" text,
	"phone_number_verified" boolean DEFAULT false,
	"display_name" text,
	"bio" text,
	"location_lat" text,
	"location_lng" text,
	"location_label" text,
	"interests" text[],
	"onboarding_complete" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "event_tickets" ADD CONSTRAINT "event_tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_ticket_tier_id_event_tickets_id_fk" FOREIGN KEY ("ticket_tier_id") REFERENCES "public"."event_tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promo_codes" ADD CONSTRAINT "promo_codes_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_rsvp_id_rsvps_id_fk" FOREIGN KEY ("rsvp_id") REFERENCES "public"."rsvps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_tier_id_event_tickets_id_fk" FOREIGN KEY ("ticket_tier_id") REFERENCES "public"."event_tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_tickets_event_id_idx" ON "event_tickets" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "events_starts_at_idx" ON "events" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "events_category_idx" ON "events" USING btree ("category");--> statement-breakpoint
CREATE INDEX "events_host_id_idx" ON "events" USING btree ("host_id");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_event_id_idx" ON "orders" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rsvps_user_event_idx" ON "rsvps" USING btree ("user_id","event_id");--> statement-breakpoint
CREATE INDEX "rsvps_event_id_idx" ON "rsvps" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "tickets_user_id_idx" ON "tickets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tickets_event_id_idx" ON "tickets" USING btree ("event_id");