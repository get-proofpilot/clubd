import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

export const communityTypeEnum = pgEnum("community_type", [
  "community",
  "studio",
  "brand",
  "organization",
]);

export const communities = pgTable(
  "communities",
  {
    id: text("id").primaryKey(),
    slug: text("slug").unique().notNull(),
    name: text("name").notNull(),
    type: communityTypeEnum("type").notNull(),
    category: text("category"), // reuses event_category values but stored as text for flexibility
    description: text("description"),
    avatarUrl: text("avatar_url"),
    coverImageUrl: text("cover_image_url"),
    locationLabel: text("location_label"),
    locationLat: text("location_lat"),
    locationLng: text("location_lng"),
    instagramHandle: text("instagram_handle"),
    websiteUrl: text("website_url"),
    ownerId: text("owner_id").notNull(),
    verified: boolean("verified").default(false),
    followerCount: integer("follower_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("communities_owner_id_idx").on(t.ownerId),
    index("communities_slug_idx").on(t.slug),
    index("communities_type_idx").on(t.type),
  ],
);
