'use client';

import { use, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { events as mockEvents } from '@/lib/mock-data';
import { trpc } from '@/lib/trpc';
import { getStripe } from '@/lib/stripe';
import type { CheckoutStep } from '@/lib/types';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import TicketSelection from '@/components/checkout/TicketSelection';
import DetailsAndPayment from '@/components/checkout/DetailsAndPayment';
import Confirmation from '@/components/checkout/Confirmation';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const event = mockEvents.find((e) => e.id === id);

  const initialStep = (searchParams.get('step') as CheckoutStep) || 'selection';
  const [step, setStep] = useState<CheckoutStep>(initialStep);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(searchParams.get('orderId'));
  const [promoCode, setPromoCode] = useState<string | undefined>();
  const [discountInCents, setDiscountInCents] = useState(0);
  const [ticketData, setTicketData] = useState<{ ticketId: string; qrCodeHash: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for return from Stripe redirect
  useEffect(() => {
    if (initialStep === 'confirmation' && orderId) {
      handleConfirmOrder(orderId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleQuantityChange = useCallback((tierId: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [tierId]: quantity }));
  }, []);

  const handleContinueToPayment = useCallback(async () => {
    setError(null);
    const items = Object.entries(quantities)
      .filter(([, q]) => q > 0)
      .map(([ticketTierId, quantity]) => ({ ticketTierId, quantity }));

    try {
      const result = await trpc.checkout.createPaymentIntent.mutate({
        eventId: id,
        items,
        promoCode,
      });

      setClientSecret(result.clientSecret);
      setOrderId(result.orderId);
      setStep('details');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
    }
  }, [id, quantities, promoCode]);

  const handleConfirmOrder = useCallback(async (oid: string) => {
    try {
      const paymentIntentId = new URLSearchParams(window.location.search).get('payment_intent') || '';
      await trpc.checkout.confirmOrder.mutate({ orderId: oid, paymentIntentId });

      // Get ticket data
      const orderData = await trpc.checkout.getOrder.query({ orderId: oid });
      if (orderData?.tickets?.[0]) {
        setTicketData({
          ticketId: orderData.tickets[0].id,
          qrCodeHash: orderData.tickets[0].qrCodeHash,
        });
      }
      setStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm order');
    }
  }, []);

  const handlePaymentComplete = useCallback(() => {
    if (orderId) {
      handleConfirmOrder(orderId);
    }
  }, [orderId, handleConfirmOrder]);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">Event not found</p>
          <Link href="/" className="mt-3 inline-block text-sm font-semibold text-[var(--color-primary)]">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const tiers = event.ticketTiers ?? [];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-16">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-white border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3">
          <button
            onClick={() => {
              if (step === 'details') setStep('selection');
              else router.back();
            }}
            className="text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
            {event.title}
          </h1>
        </div>
        <CheckoutProgress currentStep={step} />
      </div>

      <div className="mx-auto max-w-md px-5 pt-5 sm:px-8">
        {error && (
          <div className="mb-4 rounded-[var(--radius-md)] bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Selection */}
        {step === 'selection' && (
          <TicketSelection
            tiers={tiers}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
            onContinue={handleContinueToPayment}
          />
        )}

        {/* Step 2: Details & Payment */}
        {step === 'details' && clientSecret && (
          <Elements
            stripe={getStripe()}
            options={{ clientSecret, appearance: { theme: 'stripe' } }}
          >
            <DetailsAndPayment
              tiers={tiers}
              quantities={quantities}
              eventId={id}
              serviceFeePercent={event.serviceFeePercent ?? 0}
              orderId={orderId!}
              attendeeName={attendeeName}
              attendeeEmail={attendeeEmail}
              onNameChange={setAttendeeName}
              onEmailChange={setAttendeeEmail}
              onPaymentComplete={handlePaymentComplete}
              promoCode={promoCode}
              discountInCents={discountInCents}
              onPromoApplied={(code, discount) => {
                setPromoCode(code);
                setDiscountInCents(discount);
              }}
              onPromoRemoved={() => {
                setPromoCode(undefined);
                setDiscountInCents(0);
              }}
            />
          </Elements>
        )}

        {/* Step 3: Confirmation */}
        {step === 'confirmation' && ticketData && (
          <>
            <Confirmation
              eventTitle={event.title}
              eventDate={event.date}
              eventLocation={`${event.location.name}, ${event.location.address}`}
              eventDescription={event.description}
              attendeeName={attendeeName}
              ticketId={ticketData.ticketId}
              qrCodeHash={ticketData.qrCodeHash}
              isPaid
            />
            <div className="mt-6 text-center">
              <Link
                href={`/event/${id}`}
                className="text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2"
              >
                Back to event
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
