import { createHmac } from "node:crypto";
import { nanoid } from "nanoid";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc/init";
import { db } from "../db";
import { events, rsvps, tickets } from "../db/schema";
import { createRsvpInput, cancelRsvpInput } from "@/lib/validators/rsvp";

function generateQrHash(ticketId: string): string {
  const secret = process.env.QR_SECRET || "dev-qr-secret";
  return createHmac("sha256", secret).update(ticketId).digest("hex");
}

export const rsvpRouter = router({
  create: protectedProcedure
    .input(createRsvpInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await db.transaction(async (tx) => {
        // Row lock on event to enforce capacity
        const [event] = await tx
          .select()
          .from(events)
          .where(eq(events.id, input.eventId))
          .for("update");

        if (!event) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        }

        if (event.capacity && (event.rsvpCount ?? 0) >= event.capacity) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Event is full",
          });
        }

        // Upsert RSVP
        const rsvpId = nanoid();
        const [rsvp] = await tx
          .insert(rsvps)
          .values({
            id: rsvpId,
            userId,
            eventId: input.eventId,
            status: "going",
            attendeeName: input.attendeeName,
            attendeeEmail: input.attendeeEmail,
          })
          .onConflictDoUpdate({
            target: [rsvps.userId, rsvps.eventId],
            set: {
              status: "going",
              attendeeName: input.attendeeName,
              attendeeEmail: input.attendeeEmail,
              updatedAt: new Date(),
            },
          })
          .returning();

        // Increment rsvpCount
        await tx
          .update(events)
          .set({ rsvpCount: sql`${events.rsvpCount} + 1` })
          .where(eq(events.id, input.eventId));

        // Create ticket
        const ticketId = nanoid();
        const qrCodeHash = generateQrHash(ticketId);
        const [ticket] = await tx
          .insert(tickets)
          .values({
            id: ticketId,
            userId,
            eventId: input.eventId,
            rsvpId: rsvp.id,
            qrCodeHash,
            status: "active",
          })
          .returning();

        return { rsvp, ticket };
      });
    }),

  cancel: protectedProcedure
    .input(cancelRsvpInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await db.transaction(async (tx) => {
        const [rsvp] = await tx
          .select()
          .from(rsvps)
          .where(
            and(eq(rsvps.userId, userId), eq(rsvps.eventId, input.eventId)),
          );

        if (!rsvp || rsvp.status === "cancelled") {
          throw new TRPCError({ code: "NOT_FOUND", message: "RSVP not found" });
        }

        await tx
          .update(rsvps)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(rsvps.id, rsvp.id));

        // Cancel associated ticket
        await tx
          .update(tickets)
          .set({ status: "cancelled" })
          .where(
            and(
              eq(tickets.rsvpId, rsvp.id),
              eq(tickets.status, "active"),
            ),
          );

        // Decrement rsvpCount
        await tx
          .update(events)
          .set({ rsvpCount: sql`GREATEST(${events.rsvpCount} - 1, 0)` })
          .where(eq(events.id, input.eventId));

        return { success: true };
      });
    }),

  getMyRsvps: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const rows = await db.query.rsvps.findMany({
      where: and(eq(rsvps.userId, userId), eq(rsvps.status, "going")),
    });
    return rows;
  }),
});
