import { z } from "zod";
import { nanoid } from "nanoid";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { router, publicProcedure } from "../trpc/init";
import { db } from "../db";
import {
  events,
  eventTickets,
  rsvps,
  eventImages,
  eventCoHosts,
  eventAnnouncements,
  eventViews,
  users,
} from "../db/schema";
import { trackViewInput } from "@/lib/validators/host";

export const eventRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const event = await db.query.events.findFirst({
        where: eq(events.id, input.id),
      });
      if (!event) return null;

      const [tiers, images, coHostRows, announcements] = await Promise.all([
        db.query.eventTickets.findMany({
          where: eq(eventTickets.eventId, input.id),
          orderBy: [eventTickets.sortOrder],
        }),
        db.query.eventImages.findMany({
          where: eq(eventImages.eventId, input.id),
          orderBy: [eventImages.sortOrder],
        }),
        db
          .select({
            id: eventCoHosts.id,
            userId: eventCoHosts.userId,
            userName: users.name,
            userDisplayName: users.displayName,
            userImage: users.image,
          })
          .from(eventCoHosts)
          .innerJoin(users, eq(eventCoHosts.userId, users.id))
          .where(eq(eventCoHosts.eventId, input.id)),
        db.query.eventAnnouncements.findMany({
          where: eq(eventAnnouncements.eventId, input.id),
          orderBy: [desc(eventAnnouncements.createdAt)],
          limit: 5,
        }),
      ]);

      let userRsvp = null;
      if (ctx.session?.user?.id) {
        userRsvp = await db.query.rsvps.findFirst({
          where: and(
            eq(rsvps.userId, ctx.session.user.id),
            eq(rsvps.eventId, input.id),
          ),
        });
      }

      return {
        event,
        ticketTiers: tiers,
        images,
        coHosts: coHostRows,
        announcements,
        userRsvp,
      };
    }),

  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [
        eq(events.status, "published"),
        gte(events.startsAt, new Date()),
      ];
      if (input.category) {
        conditions.push(
          eq(events.category, input.category as typeof events.category.enumValues[number]),
        );
      }

      const rows = await db
        .select()
        .from(events)
        .where(and(...conditions))
        .orderBy(events.startsAt)
        .limit(input.limit + 1);

      const hasMore = rows.length > input.limit;
      const items = hasMore ? rows.slice(0, -1) : rows;

      return {
        items,
        nextCursor: hasMore ? items[items.length - 1]?.id : undefined,
      };
    }),

  getAttendees: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const rows = await db.query.rsvps.findMany({
        where: and(
          eq(rsvps.eventId, input.eventId),
          eq(rsvps.status, "going"),
        ),
        limit: input.limit,
        offset: input.offset,
      });

      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(rsvps)
        .where(
          and(eq(rsvps.eventId, input.eventId), eq(rsvps.status, "going")),
        );

      return { attendees: rows, total: Number(total[0]?.count ?? 0) };
    }),

  /**
   * Track a page view or share click for an event.
   * Public procedure -- anonymous tracking supported via viewerSessionId.
   */
  trackView: publicProcedure
    .input(trackViewInput)
    .mutation(async ({ input, ctx }) => {
      await db.insert(eventViews).values({
        id: nanoid(),
        eventId: input.eventId,
        viewType: input.viewType,
        viewerId: ctx.session?.user?.id ?? null,
        viewerSessionId: null,
      });
      return { success: true };
    }),
});
