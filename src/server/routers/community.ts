import { z } from "zod";
import { nanoid } from "nanoid";
import { eq, and, desc, gte, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "../trpc/init";
import { db } from "../db";
import { communities, events, eventTickets, eventImages } from "../db/schema";
import {
  createCommunityInput,
  updateCommunityInput,
} from "@/lib/validators/community";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let attempt = 0;

  while (attempt < 10) {
    const existing = await db.query.communities.findFirst({
      where: eq(communities.slug, slug),
    });
    if (!existing) return slug;
    attempt++;
    slug = `${base}-${nanoid(4)}`;
  }

  return `${base}-${nanoid(8)}`;
}

export const communityRouter = router({
  create: protectedProcedure
    .input(createCommunityInput)
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      const slug = await generateUniqueSlug(input.name);
      const now = new Date();

      await db.insert(communities).values({
        id,
        slug,
        name: input.name,
        type: input.type,
        category: input.category ?? null,
        description: input.description ?? null,
        avatarUrl: input.avatarUrl ?? null,
        coverImageUrl: input.coverImageUrl ?? null,
        locationLabel: input.locationLabel ?? null,
        locationLat: input.locationLat ?? null,
        locationLng: input.locationLng ?? null,
        instagramHandle: input.instagramHandle ?? null,
        websiteUrl: input.websiteUrl ?? null,
        ownerId: ctx.session.user.id,
        createdAt: now,
        updatedAt: now,
      });

      return { id, slug };
    }),

  update: protectedProcedure
    .input(updateCommunityInput)
    .mutation(async ({ ctx, input }) => {
      const community = await db.query.communities.findFirst({
        where: and(
          eq(communities.id, input.communityId),
          eq(communities.ownerId, ctx.session.user.id),
        ),
      });

      if (!community) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Community not found or you are not the owner",
        });
      }

      const updateData: Record<string, unknown> = { updatedAt: new Date() };

      if (input.name !== undefined) updateData.name = input.name;
      if (input.type !== undefined) updateData.type = input.type;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;
      if (input.coverImageUrl !== undefined) updateData.coverImageUrl = input.coverImageUrl;
      if (input.locationLabel !== undefined) updateData.locationLabel = input.locationLabel;
      if (input.locationLat !== undefined) updateData.locationLat = input.locationLat;
      if (input.locationLng !== undefined) updateData.locationLng = input.locationLng;
      if (input.instagramHandle !== undefined) updateData.instagramHandle = input.instagramHandle;
      if (input.websiteUrl !== undefined) updateData.websiteUrl = input.websiteUrl;

      await db
        .update(communities)
        .set(updateData)
        .where(eq(communities.id, input.communityId));

      const updated = await db.query.communities.findFirst({
        where: eq(communities.id, input.communityId),
      });

      return updated;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const community = await db.query.communities.findFirst({
        where: eq(communities.slug, input.slug),
      });

      if (!community) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Community not found",
        });
      }

      const now = new Date();

      // Get community's upcoming published events
      const communityEvents = await db.query.events.findMany({
        where: and(
          eq(events.communityId, community.id),
          eq(events.status, "published"),
          gte(events.startsAt, now),
        ),
        orderBy: [events.startsAt],
      });

      // Enrich with ticket tiers and images
      const eventIds = communityEvents.map((e) => e.id);
      const tiers =
        eventIds.length > 0
          ? await db.query.eventTickets.findMany({
              where: inArray(eventTickets.eventId, eventIds),
            })
          : [];
      const images =
        eventIds.length > 0
          ? await db.query.eventImages.findMany({
              where: inArray(eventImages.eventId, eventIds),
            })
          : [];

      const enrichedEvents = communityEvents.map((e) => ({
        ...e,
        ticketTiers: tiers.filter((t) => t.eventId === e.id),
        images: images.filter((i) => i.eventId === e.id),
      }));

      return {
        community,
        events: enrichedEvents,
        stats: {
          totalEvents: communityEvents.length,
          upcomingCount: communityEvents.length,
        },
      };
    }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const myCommunities = await db.query.communities.findMany({
      where: eq(communities.ownerId, ctx.session.user.id),
      orderBy: [desc(communities.createdAt)],
    });

    return myCommunities;
  }),
});
