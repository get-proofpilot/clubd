import { z } from "zod";
import { nanoid } from "nanoid";
import { eq, and, desc, gte, lt, sql, ilike, ne, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  router,
  protectedProcedure,
  hostProcedure,
} from "../trpc/init";
import { db } from "../db";
import {
  events,
  eventImages,
  eventCoHosts,
  eventAnnouncements,
  eventViews,
  eventTickets,
  rsvps,
  users,
} from "../db/schema";
import { getStripe } from "../stripe";
import {
  createEventInput,
  updateEventInput,
  publishEventInput,
  cancelEventInput,
  repeatEventInput,
} from "@/lib/validators/event";
import {
  createAnnouncementInput,
  addCoHostInput,
  removeCoHostInput,
  searchCoHostsInput,
} from "@/lib/validators/host";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Calculate future occurrence dates for recurring events.
 */
function calculateOccurrenceDates(
  baseStart: Date,
  baseEnd: Date | null,
  frequency: "weekly" | "biweekly" | "monthly" | "custom",
  count: number,
  customIntervalDays?: number,
): Array<{ start: Date; end: Date | null }> {
  const results: Array<{ start: Date; end: Date | null }> = [];
  const durationMs = baseEnd ? baseEnd.getTime() - baseStart.getTime() : 0;

  for (let i = 1; i <= count; i++) {
    let start: Date;

    switch (frequency) {
      case "weekly":
        start = new Date(baseStart);
        start.setDate(start.getDate() + 7 * i);
        break;
      case "biweekly":
        start = new Date(baseStart);
        start.setDate(start.getDate() + 14 * i);
        break;
      case "monthly": {
        start = new Date(baseStart);
        const targetMonth = start.getMonth() + i;
        const targetYear = start.getFullYear() + Math.floor(targetMonth / 12);
        const targetMonthMod = targetMonth % 12;
        // Clamp to last day of target month if needed
        const daysInTargetMonth = new Date(
          targetYear,
          targetMonthMod + 1,
          0,
        ).getDate();
        const day = Math.min(start.getDate(), daysInTargetMonth);
        start = new Date(
          targetYear,
          targetMonthMod,
          day,
          start.getHours(),
          start.getMinutes(),
          start.getSeconds(),
          start.getMilliseconds(),
        );
        break;
      }
      case "custom": {
        const interval = customIntervalDays ?? 7;
        start = new Date(baseStart);
        start.setDate(start.getDate() + interval * i);
        break;
      }
    }

    const end = baseEnd ? new Date(start.getTime() + durationMs) : null;
    results.push({ start, end });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Host Router
// ---------------------------------------------------------------------------

export const hostRouter = router({
  // -------------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------------

  /**
   * Create a new event as draft.
   * Uses protectedProcedure (not hostProcedure) because no event exists yet.
   */
  createEvent: protectedProcedure
    .input(createEventInput)
    .mutation(async ({ ctx, input }) => {
      const eventId = nanoid();
      const now = new Date();

      await db.insert(events).values({
        id: eventId,
        hostId: ctx.session.user.id,
        title: input.title,
        description: input.description ?? null,
        category: input.category,
        startsAt: new Date(input.startsAt),
        endsAt: input.endsAt ? new Date(input.endsAt) : null,
        locationName: input.locationName ?? null,
        address: input.address ?? null,
        locationLat: input.locationLat ?? null,
        locationLng: input.locationLng ?? null,
        locationPlaceId: input.locationPlaceId ?? null,
        capacity: input.capacity ?? null,
        pricingType: input.pricingType,
        serviceFeePercent: input.serviceFeePercent,
        communityId: input.communityId ?? null,
        imageUrl: null,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      });

      // Associate pre-uploaded images
      if (input.imageKeys?.length) {
        await db.insert(eventImages).values(
          input.imageKeys.map((url, i) => ({
            id: nanoid(),
            eventId,
            url,
            key: url,
            sortOrder: i,
          })),
        );
        // Set cover image (first image)
        await db
          .update(events)
          .set({ imageUrl: input.imageKeys[0] })
          .where(eq(events.id, eventId));
      }

      return { eventId };
    }),

  /**
   * Update an existing event. Only the host can update.
   */
  updateEvent: hostProcedure
    .input(updateEventInput)
    .mutation(async ({ input }) => {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };

      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.startsAt !== undefined)
        updateData.startsAt = new Date(input.startsAt);
      if (input.endsAt !== undefined)
        updateData.endsAt = input.endsAt ? new Date(input.endsAt) : null;
      if (input.locationName !== undefined)
        updateData.locationName = input.locationName;
      if (input.address !== undefined) updateData.address = input.address;
      if (input.locationLat !== undefined)
        updateData.locationLat = input.locationLat;
      if (input.locationLng !== undefined)
        updateData.locationLng = input.locationLng;
      if (input.locationPlaceId !== undefined)
        updateData.locationPlaceId = input.locationPlaceId;
      if (input.capacity !== undefined) updateData.capacity = input.capacity;
      if (input.pricingType !== undefined)
        updateData.pricingType = input.pricingType;
      if (input.serviceFeePercent !== undefined)
        updateData.serviceFeePercent = input.serviceFeePercent;

      await db
        .update(events)
        .set(updateData)
        .where(eq(events.id, input.eventId));

      // Replace images if provided
      if (input.imageKeys !== undefined) {
        await db
          .delete(eventImages)
          .where(eq(eventImages.eventId, input.eventId));

        if (input.imageKeys.length > 0) {
          await db.insert(eventImages).values(
            input.imageKeys.map((url, i) => ({
              id: nanoid(),
              eventId: input.eventId,
              url,
              key: url,
              sortOrder: i,
            })),
          );
          await db
            .update(events)
            .set({ imageUrl: input.imageKeys[0] })
            .where(eq(events.id, input.eventId));
        } else {
          await db
            .update(events)
            .set({ imageUrl: null })
            .where(eq(events.id, input.eventId));
        }
      }

      const updated = await db.query.events.findFirst({
        where: eq(events.id, input.eventId),
      });
      return updated;
    }),

  /**
   * Publish an event (draft -> published).
   * Validates the event has all required fields for public visibility.
   */
  publishEvent: hostProcedure
    .input(publishEventInput)
    .mutation(async ({ ctx }) => {
      const event = ctx.event;

      // Validate required fields for publishing
      if (!event.title || !event.description) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Title and description are required to publish",
        });
      }
      if (!event.address || !event.locationLat || !event.locationLng) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Location details (address, coordinates) are required to publish",
        });
      }
      if (!event.startsAt || !event.category) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Start time and category are required to publish",
        });
      }

      await db
        .update(events)
        .set({ status: "published", updatedAt: new Date() })
        .where(eq(events.id, event.id));

      const updated = await db.query.events.findFirst({
        where: eq(events.id, event.id),
      });
      return updated;
    }),

  /**
   * Cancel an event. Events are never deleted (locked decision).
   */
  cancelEvent: hostProcedure
    .input(cancelEventInput)
    .mutation(async ({ ctx }) => {
      await db
        .update(events)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(events.id, ctx.event.id));

      const updated = await db.query.events.findFirst({
        where: eq(events.id, ctx.event.id),
      });
      return updated;
    }),

  /**
   * Repeat an event -- create N future occurrences from a template event.
   * Each occurrence is a separate, editable event with templateEventId set.
   */
  repeatEvent: hostProcedure
    .input(repeatEventInput)
    .mutation(async ({ ctx, input }) => {
      const source = ctx.event;

      if (input.frequency === "custom" && !input.customIntervalDays) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "customIntervalDays is required for custom frequency",
        });
      }

      const dates = calculateOccurrenceDates(
        source.startsAt,
        source.endsAt,
        input.frequency,
        input.count,
        input.customIntervalDays ?? undefined,
      );

      const newEventIds: string[] = [];
      const now = new Date();

      for (const date of dates) {
        const newId = nanoid();
        newEventIds.push(newId);

        await db.insert(events).values({
          id: newId,
          hostId: source.hostId,
          title: source.title,
          description: source.description,
          category: source.category,
          startsAt: date.start,
          endsAt: date.end,
          locationName: source.locationName,
          address: source.address,
          locationLat: source.locationLat,
          locationLng: source.locationLng,
          locationPlaceId: source.locationPlaceId,
          capacity: source.capacity,
          pricingType: source.pricingType,
          serviceFeePercent: source.serviceFeePercent,
          imageUrl: source.imageUrl,
          status: "draft",
          rsvpCount: 0,
          templateEventId: source.id,
          createdAt: now,
          updatedAt: now,
        });
      }

      return { eventIds: newEventIds };
    }),

  /**
   * Create an announcement for an event.
   */
  createAnnouncement: hostProcedure
    .input(createAnnouncementInput)
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      await db.insert(eventAnnouncements).values({
        id,
        eventId: input.eventId,
        authorId: ctx.session.user.id,
        message: input.message,
      });

      const announcement = await db.query.eventAnnouncements.findFirst({
        where: eq(eventAnnouncements.id, id),
      });
      return announcement;
    }),

  /**
   * Add a co-host to an event.
   */
  addCoHost: hostProcedure
    .input(addCoHostInput)
    .mutation(async ({ input }) => {
      // Verify target user exists
      const targetUser = await db.query.users.findFirst({
        where: eq(users.id, input.userId),
      });
      if (!targetUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check for duplicate
      const existing = await db.query.eventCoHosts.findFirst({
        where: and(
          eq(eventCoHosts.eventId, input.eventId),
          eq(eventCoHosts.userId, input.userId),
        ),
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already a co-host",
        });
      }

      await db.insert(eventCoHosts).values({
        id: nanoid(),
        eventId: input.eventId,
        userId: input.userId,
      });

      return { success: true };
    }),

  /**
   * Remove a co-host from an event.
   */
  removeCoHost: hostProcedure
    .input(removeCoHostInput)
    .mutation(async ({ input }) => {
      await db
        .delete(eventCoHosts)
        .where(
          and(
            eq(eventCoHosts.eventId, input.eventId),
            eq(eventCoHosts.userId, input.userId),
          ),
        );

      return { success: true };
    }),

  /**
   * Set up Stripe Connect Express account for host payouts.
   * Creates account if needed, returns onboarding URL.
   */
  setupStripeConnect: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = getStripe();
    const userId = ctx.session.user.id;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    let accountId = user.stripeAccountId;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        metadata: { clubdUserId: userId },
      });
      accountId = account.id;
      await db
        .update(users)
        .set({ stripeAccountId: accountId })
        .where(eq(users.id, userId));
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/host/dashboard?stripe=retry`,
      return_url: `${baseUrl}/host/dashboard?stripe=complete`,
      type: "account_onboarding",
    });

    return { url: accountLink.url };
  }),

  // -------------------------------------------------------------------------
  // Queries
  // -------------------------------------------------------------------------

  /**
   * List the current user's events, split into upcoming and past.
   */
  myEvents: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const userId = ctx.session.user.id;

    const upcoming = await db.query.events.findMany({
      where: and(
        eq(events.hostId, userId),
        gte(events.startsAt, now),
      ),
      orderBy: [events.startsAt],
    });

    const past = await db.query.events.findMany({
      where: and(
        eq(events.hostId, userId),
        lt(events.startsAt, now),
      ),
      orderBy: [desc(events.startsAt)],
    });

    return { upcoming, past };
  }),

  /**
   * Get detailed event info for host management.
   * Includes images, co-hosts, announcements, ticket tiers, and basic stats.
   */
  eventDetail: hostProcedure
    .input(publishEventInput) // reuse { eventId } shape
    .query(async ({ ctx }) => {
      const event = ctx.event;

      const [images, coHostRows, announcements, tiers] = await Promise.all([
        db.query.eventImages.findMany({
          where: eq(eventImages.eventId, event.id),
          orderBy: [eventImages.sortOrder],
        }),
        db
          .select({
            id: eventCoHosts.id,
            userId: eventCoHosts.userId,
            addedAt: eventCoHosts.addedAt,
            userName: users.name,
            userDisplayName: users.displayName,
            userImage: users.image,
          })
          .from(eventCoHosts)
          .innerJoin(users, eq(eventCoHosts.userId, users.id))
          .where(eq(eventCoHosts.eventId, event.id)),
        db.query.eventAnnouncements.findMany({
          where: eq(eventAnnouncements.eventId, event.id),
          orderBy: [desc(eventAnnouncements.createdAt)],
        }),
        db.query.eventTickets.findMany({
          where: eq(eventTickets.eventId, event.id),
          orderBy: [eventTickets.sortOrder],
        }),
      ]);

      // Get aggregate stats
      const [viewStats] = await db
        .select({
          pageViews: sql<number>`count(*) filter (where ${eventViews.viewType} = 'page_view')`,
          shareClicks: sql<number>`count(*) filter (where ${eventViews.viewType} = 'share_click')`,
        })
        .from(eventViews)
        .where(eq(eventViews.eventId, event.id));

      return {
        event,
        images,
        coHosts: coHostRows,
        announcements,
        ticketTiers: tiers,
        stats: {
          rsvpCount: event.rsvpCount ?? 0,
          pageViews: Number(viewStats?.pageViews ?? 0),
          shareClicks: Number(viewStats?.shareClicks ?? 0),
        },
      };
    }),

  /**
   * Paginated attendee list for a specific event.
   */
  eventAttendees: hostProcedure
    .input(
      z.object({
        eventId: z.string(),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const attendeeRows = await db
        .select({
          rsvpId: rsvps.id,
          userId: rsvps.userId,
          attendeeName: rsvps.attendeeName,
          attendeeEmail: rsvps.attendeeEmail,
          rsvpStatus: rsvps.status,
          rsvpCreatedAt: rsvps.createdAt,
          userName: users.name,
          userDisplayName: users.displayName,
          userImage: users.image,
        })
        .from(rsvps)
        .innerJoin(users, eq(rsvps.userId, users.id))
        .where(
          and(
            eq(rsvps.eventId, ctx.event.id),
            eq(rsvps.status, "going"),
          ),
        )
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(rsvps.createdAt));

      const [totalRow] = await db
        .select({ count: sql<number>`count(*)` })
        .from(rsvps)
        .where(
          and(
            eq(rsvps.eventId, ctx.event.id),
            eq(rsvps.status, "going"),
          ),
        );

      return {
        attendees: attendeeRows,
        total: Number(totalRow?.count ?? 0),
      };
    }),

  /**
   * Aggregate analytics for a specific event.
   */
  eventAnalytics: hostProcedure
    .input(publishEventInput) // { eventId }
    .query(async ({ ctx }) => {
      const event = ctx.event;

      const [viewStats] = await db
        .select({
          pageViews: sql<number>`count(*) filter (where ${eventViews.viewType} = 'page_view')`,
          shareClicks: sql<number>`count(*) filter (where ${eventViews.viewType} = 'share_click')`,
        })
        .from(eventViews)
        .where(eq(eventViews.eventId, event.id));

      const pageViews = Number(viewStats?.pageViews ?? 0);
      const rsvpCount = event.rsvpCount ?? 0;
      const conversionRate =
        pageViews > 0 ? Math.round((rsvpCount / pageViews) * 10000) / 100 : 0;

      return {
        pageViews,
        shareClicks: Number(viewStats?.shareClicks ?? 0),
        rsvpCount,
        conversionRate,
      };
    }),

  /**
   * Search users for co-host selection.
   * Searches by displayName or name with ILIKE. Excludes current user.
   */
  searchUsers: protectedProcedure
    .input(searchCoHostsInput)
    .query(async ({ ctx, input }) => {
      const pattern = `%${input.query}%`;

      const results = await db
        .select({
          id: users.id,
          name: users.name,
          displayName: users.displayName,
          image: users.image,
        })
        .from(users)
        .where(
          and(
            ne(users.id, ctx.session.user.id),
            or(
              ilike(users.name, pattern),
              ilike(users.displayName, pattern),
            ),
          ),
        )
        .limit(10);

      return results;
    }),
});
