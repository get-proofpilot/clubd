'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import type { PricingType, RSVPStatus } from '@/lib/types';
import AuthGate from './AuthGate';

interface RsvpButtonProps {
  eventId: string;
  pricingType: PricingType;
  userRsvpStatus?: RSVPStatus | null;
  isAuthenticated: boolean;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export default function RsvpButton({
  eventId,
  pricingType,
  userRsvpStatus,
  isAuthenticated,
  isSaved = false,
  onSaveToggle,
}: RsvpButtonProps) {
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);

  const isGoing = userRsvpStatus === 'going';
  const isPaid = pricingType === 'paid';

  const handleAction = useCallback(() => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }

    if (isGoing) {
      // Navigate to registration page to show cancel option
      router.push(`/event/${eventId}/register`);
      return;
    }

    if (isPaid) {
      router.push(`/event/${eventId}/checkout`);
    } else {
      router.push(`/event/${eventId}/register`);
    }
  }, [isAuthenticated, isGoing, isPaid, eventId, router]);

  const getButtonLabel = () => {
    if (isGoing) return 'Going \u2713';
    if (isPaid) return 'Get Tickets';
    return "RSVP — I'm Going";
  };

  const getButtonStyle = () => {
    if (isGoing) {
      return 'border-2 border-[var(--color-primary)] bg-transparent font-bold text-[var(--color-primary)]';
    }
    return 'bg-[var(--color-primary)] font-bold text-white';
  };

  return (
    <>
      <div className="sticky bottom-0 z-40 glass-panel border-t border-gray-100 pb-[max(env(safe-area-inset-bottom,8px),8px)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onSaveToggle}
            className={`btn-press flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-[var(--color-card)] transition-colors ${
              isSaved
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : ''}`}
              strokeWidth={1.8}
            />
          </button>
          <button
            onClick={handleAction}
            className={`btn-press flex h-12 flex-1 items-center justify-center rounded-[var(--radius-button)] tracking-wide transition-colors ${getButtonStyle()}`}
            style={!isGoing ? { boxShadow: 'var(--shadow-button)' } : undefined}
          >
            {getButtonLabel()}
          </button>
        </div>
      </div>

      <AuthGate
        open={showAuth}
        onClose={() => setShowAuth(false)}
        pendingIntent={{ action: isPaid ? 'checkout' : 'rsvp', eventId }}
      />
    </>
  );
}
