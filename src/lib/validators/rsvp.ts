import { z } from "zod";

export const createRsvpInput = z.object({
  eventId: z.string().min(1),
  attendeeName: z.string().min(1, "Name is required"),
  attendeeEmail: z.string().email("Valid email required"),
});

export const cancelRsvpInput = z.object({
  eventId: z.string().min(1),
});

export const createOrderInput = z.object({
  eventId: z.string().min(1),
  items: z.array(
    z.object({
      ticketTierId: z.string().min(1),
      quantity: z.number().int().min(1).max(10),
    }),
  ).min(1, "Select at least one ticket"),
  attendeeName: z.string().min(1),
  attendeeEmail: z.string().email(),
  promoCode: z.string().optional(),
});

export const validatePromoCodeInput = z.object({
  code: z.string().min(1).transform((v) => v.toUpperCase()),
  eventId: z.string().min(1),
});

export const getTicketTiersInput = z.object({
  eventId: z.string().min(1),
});

export const confirmOrderInput = z.object({
  orderId: z.string().min(1),
  paymentIntentId: z.string().min(1),
});
