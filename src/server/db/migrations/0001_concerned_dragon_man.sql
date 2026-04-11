CREATE TYPE "public"."community_type" AS ENUM('community', 'studio', 'brand', 'organization');--> statement-breakpoint
CREATE TYPE "public"."event_view_type" AS ENUM('page_view', 'share_click');--> statement-breakpoint
CREATE TABLE "communities" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"type" "community_type" NOT NULL,
	"category" text,
	"description" text,
	"avatar_url" text,
	"cover_image_url" text,
	"location_label" text,
	"location_lat" text,
	"location_lng" text,
	"instagram_handle" text,
	"website_url" text,
	"owner_id" text NOT NULL,
	"verified" boolean DEFAULT false,
	"follower_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "communities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "event_announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"author_id" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_co_hosts" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_images" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"url" text NOT NULL,
	"key" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_views" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"view_type" "event_view_type" NOT NULL,
	"viewer_session_id" text,
	"viewer_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "community_id" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "template_event_id" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "location_name" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "location_place_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_account_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_account_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "event_announcements" ADD CONSTRAINT "event_announcements_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_announcements" ADD CONSTRAINT "event_announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_co_hosts" ADD CONSTRAINT "event_co_hosts_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_co_hosts" ADD CONSTRAINT "event_co_hosts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_views" ADD CONSTRAINT "event_views_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "communities_owner_id_idx" ON "communities" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "communities_slug_idx" ON "communities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "communities_type_idx" ON "communities" USING btree ("type");--> statement-breakpoint
CREATE INDEX "event_announcements_event_id_idx" ON "event_announcements" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "event_co_hosts_event_user_idx" ON "event_co_hosts" USING btree ("event_id","user_id");--> statement-breakpoint
CREATE INDEX "event_images_event_id_idx" ON "event_images" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_views_event_id_idx" ON "event_views" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_views_event_type_idx" ON "event_views" USING btree ("event_id","view_type");