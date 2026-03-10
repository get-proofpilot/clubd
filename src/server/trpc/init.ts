import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { eq, and } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { events } from "../db/schema";

export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    session,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

/**
 * Host procedure - extends protectedProcedure with event ownership verification.
 * Extracts eventId from rawInput and verifies the current user is the event host.
 * Passes the verified event on context for downstream use.
 */
export const hostProcedure = protectedProcedure.use(
  async ({ ctx, next, getRawInput }) => {
    const rawInput = (await getRawInput()) as { eventId?: string };
    if (!rawInput?.eventId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "eventId is required",
      });
    }

    const event = await db.query.events.findFirst({
      where: and(
        eq(events.id, rawInput.eventId),
        eq(events.hostId, ctx.session.user.id),
      ),
    });

    if (!event) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not the event host",
      });
    }

    return next({ ctx: { ...ctx, event } });
  },
);
