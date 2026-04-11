import dotenv from "dotenv";
// Don't override env vars already set (e.g. DATABASE_URL from Railway CLI)
dotenv.config({ path: ".env.local", override: false });

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "../server/db/index";
import { users, communities, events } from "../server/db/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CompanyEvent {
  title: string;
  description: string;
  category: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  hour: number;
  minute: number;
  durationMinutes: number;
  locationName: string;
  address: string;
  capacity: number;
  pricingType: "free" | "paid";
  priceInCents?: number;
  coverImage: string;
}

interface Company {
  name: string;
  slug: string;
  type: "community" | "studio" | "brand" | "organization";
  category: string;
  description: string;
  locationLabel: string;
  locationLat: string;
  locationLng: string;
  avatarUrl: string;
  coverImageUrl: string;
  instagramHandle: string;
  websiteUrl: string;
  events: CompanyEvent[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SYSTEM_USER_ID = "clubd-system-outreach";

/**
 * Get the next occurrence of a given day-of-week at a given time.
 * Always returns a date in the future (at least 1 day from now).
 */
function getNextOccurrence(
  dayOfWeek: number,
  hour: number,
  minute: number,
): Date {
  const now = new Date();
  const result = new Date(now);
  const currentDay = now.getDay();
  let daysUntil = (dayOfWeek - currentDay + 7) % 7;
  if (daysUntil === 0) {
    // If same day, check if the time has passed
    const todayAtTime = new Date(now);
    todayAtTime.setHours(hour, minute, 0, 0);
    if (now >= todayAtTime) {
      daysUntil = 7;
    }
  }
  if (daysUntil === 0) daysUntil = 7; // Always at least next week
  result.setDate(result.getDate() + daysUntil);
  result.setHours(hour, minute, 0, 0);
  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seedOutreach() {
  console.log("🌱 Seeding outreach companies and events...\n");

  // 1. Upsert system user
  const existing = await db.query.users.findFirst({
    where: eq(users.id, SYSTEM_USER_ID),
  });

  if (!existing) {
    await db.insert(users).values({
      id: SYSTEM_USER_ID,
      name: "Clubd Team",
      email: "team@clubd.app",
      emailVerified: true,
      displayName: "Clubd",
      bio: "The Clubd team — managing outreach pages",
      locationLat: "33.6461",
      locationLng: "-117.9187",
      locationLabel: "Orange County, CA",
      onboardingComplete: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ System user created");
  } else {
    console.log("ℹ️  System user already exists");
  }

  // 2. Load company data
  const dataPath = join(__dirname, "data", "oc-companies.json");
  const raw = readFileSync(dataPath, "utf-8");
  const companies: Company[] = JSON.parse(raw);

  console.log(`📋 Found ${companies.length} companies to seed\n`);

  let communitiesCreated = 0;
  let eventsCreated = 0;
  let skipped = 0;

  for (const company of companies) {
    // 3. Check if community already exists
    const existingCommunity = await db.query.communities.findFirst({
      where: eq(communities.slug, company.slug),
    });

    if (existingCommunity) {
      console.log(`⏭️  Skipping "${company.name}" — slug already exists`);
      skipped++;
      continue;
    }

    // 4. Insert community
    const communityId = nanoid();
    const now = new Date();

    await db.insert(communities).values({
      id: communityId,
      slug: company.slug,
      name: company.name,
      type: company.type,
      category: company.category,
      description: company.description,
      avatarUrl: company.avatarUrl,
      coverImageUrl: company.coverImageUrl,
      locationLabel: company.locationLabel,
      locationLat: company.locationLat,
      locationLng: company.locationLng,
      instagramHandle: company.instagramHandle,
      websiteUrl: company.websiteUrl || null,
      ownerId: SYSTEM_USER_ID,
      verified: false,
      followerCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    communitiesCreated++;
    console.log(`✅ Created community: ${company.name} (/c/${company.slug})`);

    // 5. Insert events for this community
    for (const evt of company.events) {
      const eventId = nanoid();
      const startsAt = getNextOccurrence(evt.dayOfWeek, evt.hour, evt.minute);
      const endsAt = new Date(
        startsAt.getTime() + evt.durationMinutes * 60 * 1000,
      );

      await db.insert(events).values({
        id: eventId,
        hostId: SYSTEM_USER_ID,
        title: evt.title,
        description: evt.description,
        category: evt.category as "fitness" | "wellness" | "social" | "outdoor" | "food_drink" | "creative" | "family" | "community",
        locationName: evt.locationName,
        address: evt.address,
        locationLat: company.locationLat,
        locationLng: company.locationLng,
        startsAt,
        endsAt,
        capacity: evt.capacity,
        rsvpCount: 0,
        imageUrl: evt.coverImage,
        status: "published",
        pricingType: evt.pricingType,
        communityId,
        createdAt: now,
        updatedAt: now,
      });

      eventsCreated++;
    }
  }

  console.log("\n" + "─".repeat(50));
  console.log(`🎉 Done!`);
  console.log(`   Communities created: ${communitiesCreated}`);
  console.log(`   Events created: ${eventsCreated}`);
  console.log(`   Skipped (already existed): ${skipped}`);
  console.log("─".repeat(50));

  process.exit(0);
}

seedOutreach().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
