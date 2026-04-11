import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import Stripe from "stripe";
import { getStripe } from "@/server/stripe";
import { db } from "@/server/db";
import { orders, orderItems, tickets, eventTickets } from "@/server/db/schema";
import { createHmac } from "node:crypto";
import { nanoid } from "nanoid";

function generateQrHash(ticketId: string): string {
  const secret = process.env.QR_SECRET || "dev-qr-secret";
  return createHmac("sha256", secret).update(ticketId).digest("hex");
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;
      if (!orderId) break;

      await db.transaction(async (tx) => {
        const [order] = await tx
          .select()
          .from(orders)
          .where(eq(orders.id, orderId));

        if (!order || order.status === "completed") return;

        await tx
          .update(orders)
          .set({ status: "completed", updatedAt: new Date() })
          .where(eq(orders.id, orderId));

        const items = await tx.query.orderItems.findMany({
          where: eq(orderItems.orderId, orderId),
        });

        for (const item of items) {
          for (let i = 0; i < item.quantity; i++) {
            const ticketId = nanoid();
            await tx.insert(tickets).values({
              id: ticketId,
              userId: order.userId,
              eventId: order.eventId,
              orderId: order.id,
              orderItemId: item.id,
              ticketTierId: item.ticketTierId,
              qrCodeHash: generateQrHash(ticketId),
              status: "active",
            });
          }

          await tx
            .update(eventTickets)
            .set({
              soldCount: sql`${eventTickets.soldCount} + ${item.quantity}`,
            })
            .where(eq(eventTickets.id, item.ticketTierId));
        }
      });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;
      if (orderId) {
        await db
          .update(orders)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(orders.id, orderId));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
