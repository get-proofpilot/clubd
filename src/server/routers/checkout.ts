import { createHmac } from "node:crypto";
import { nanoid } from "nanoid";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc/init";
import { db } from "../db";
import {
  events,
  eventTickets,
  orders,
  orderItems,
  tickets,
  promoCodes,
} from "../db/schema";
import { getStripe } from "../stripe";
import {
  validatePromoCodeInput,
  getTicketTiersInput,
  confirmOrderInput,
} from "@/lib/validators/rsvp";

function generateQrHash(ticketId: string): string {
  const secret = process.env.QR_SECRET || "dev-qr-secret";
  return createHmac("sha256", secret).update(ticketId).digest("hex");
}

export const checkoutRouter = router({
  getTicketTiers: publicProcedure
    .input(getTicketTiersInput)
    .query(async ({ input }) => {
      const tiers = await db.query.eventTickets.findMany({
        where: eq(eventTickets.eventId, input.eventId),
        orderBy: [eventTickets.sortOrder],
      });
      return tiers;
    }),

  validatePromoCode: publicProcedure
    .input(validatePromoCodeInput)
    .query(async ({ input }) => {
      const promo = await db.query.promoCodes.findFirst({
        where: eq(promoCodes.code, input.code),
      });

      if (!promo) {
        return { valid: false, code: input.code, message: "Invalid promo code" };
      }

      if (promo.eventId && promo.eventId !== input.eventId) {
        return { valid: false, code: input.code, message: "Code not valid for this event" };
      }

      if (promo.expiresAt && promo.expiresAt < new Date()) {
        return { valid: false, code: input.code, message: "Code has expired" };
      }

      if (promo.maxUses && (promo.currentUses ?? 0) >= promo.maxUses) {
        return { valid: false, code: input.code, message: "Code usage limit reached" };
      }

      return {
        valid: true,
        code: input.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
      };
    }),

  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
        items: z.array(
          z.object({
            ticketTierId: z.string(),
            quantity: z.number().int().min(1).max(10),
          }),
        ),
        promoCode: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const event = await db.query.events.findFirst({
        where: eq(events.id, input.eventId),
      });
      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      // Fetch tiers and calculate totals
      const tiers = await db.query.eventTickets.findMany({
        where: eq(eventTickets.eventId, input.eventId),
      });
      const tierMap = new Map(tiers.map((t) => [t.id, t]));

      let subtotal = 0;
      const lineItems: { tierId: string; quantity: number; unitPrice: number }[] = [];

      for (const item of input.items) {
        const tier = tierMap.get(item.ticketTierId);
        if (!tier) {
          throw new TRPCError({ code: "BAD_REQUEST", message: `Ticket tier ${item.ticketTierId} not found` });
        }
        if (tier.capacity && (tier.soldCount ?? 0) + item.quantity > tier.capacity) {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: `${tier.name} is sold out` });
        }
        subtotal += tier.priceInCents * item.quantity;
        lineItems.push({ tierId: tier.id, quantity: item.quantity, unitPrice: tier.priceInCents });
      }

      // Apply promo code
      let discountInCents = 0;
      let promoCodeId: string | null = null;
      if (input.promoCode) {
        const promo = await db.query.promoCodes.findFirst({
          where: eq(promoCodes.code, input.promoCode.toUpperCase()),
        });
        if (promo && (!promo.eventId || promo.eventId === input.eventId)) {
          promoCodeId = promo.id;
          if (promo.discountType === "percentage") {
            discountInCents = Math.round(subtotal * (promo.discountValue / 100));
          } else {
            discountInCents = Math.min(promo.discountValue, subtotal);
          }
        }
      }

      const serviceFeeInCents = Math.round(
        (subtotal - discountInCents) * ((event.serviceFeePercent ?? 0) / 100),
      );
      const totalInCents = subtotal - discountInCents + serviceFeeInCents;

      if (totalInCents <= 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Order total must be greater than 0" });
      }

      // Create order
      const orderId = nanoid();
      await db.insert(orders).values({
        id: orderId,
        userId,
        eventId: input.eventId,
        status: "pending",
        subtotalInCents: subtotal,
        serviceFeeInCents,
        discountInCents,
        totalInCents,
        promoCodeId,
      });

      for (const item of lineItems) {
        await db.insert(orderItems).values({
          id: nanoid(),
          orderId,
          ticketTierId: item.tierId,
          quantity: item.quantity,
          unitPriceInCents: item.unitPrice,
        });
      }

      // Create Stripe PaymentIntent
      const stripe = getStripe();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalInCents,
        currency: "usd",
        metadata: { orderId, eventId: input.eventId, userId },
      });

      await db
        .update(orders)
        .set({ stripePaymentIntentId: paymentIntent.id })
        .where(eq(orders.id, orderId));

      return { clientSecret: paymentIntent.client_secret!, orderId };
    }),

  confirmOrder: protectedProcedure
    .input(confirmOrderInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await db.transaction(async (tx) => {
        const [order] = await tx
          .select()
          .from(orders)
          .where(and(eq(orders.id, input.orderId), eq(orders.userId, userId)));

        if (!order) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        }
        if (order.status === "completed") {
          return { orderId: order.id, alreadyCompleted: true };
        }

        // Update order status
        await tx
          .update(orders)
          .set({ status: "completed", updatedAt: new Date() })
          .where(eq(orders.id, order.id));

        // Get order items and create tickets
        const items = await tx.query.orderItems.findMany({
          where: eq(orderItems.orderId, order.id),
        });

        for (const item of items) {
          for (let i = 0; i < item.quantity; i++) {
            const ticketId = nanoid();
            await tx.insert(tickets).values({
              id: ticketId,
              userId,
              eventId: order.eventId,
              orderId: order.id,
              orderItemId: item.id,
              ticketTierId: item.ticketTierId,
              qrCodeHash: generateQrHash(ticketId),
              status: "active",
            });
          }

          // Increment soldCount
          await tx
            .update(eventTickets)
            .set({ soldCount: sql`${eventTickets.soldCount} + ${item.quantity}` })
            .where(eq(eventTickets.id, item.ticketTierId));
        }

        // Increment promo code usage
        if (order.promoCodeId) {
          await tx
            .update(promoCodes)
            .set({ currentUses: sql`${promoCodes.currentUses} + 1` })
            .where(eq(promoCodes.id, order.promoCodeId));
        }

        return { orderId: order.id, alreadyCompleted: false };
      });
    }),

  getOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await db.query.orders.findFirst({
        where: and(
          eq(orders.id, input.orderId),
          eq(orders.userId, ctx.session.user.id),
        ),
      });
      if (!order) return null;

      const items = await db.query.orderItems.findMany({
        where: eq(orderItems.orderId, order.id),
      });

      const orderTickets = await db.query.tickets.findMany({
        where: eq(tickets.orderId, order.id),
      });

      return { order, items, tickets: orderTickets };
    }),

  getMyTickets: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db.query.tickets.findMany({
      where: and(
        eq(tickets.userId, ctx.session.user.id),
        eq(tickets.status, "active"),
      ),
    });
    return rows;
  }),
});
