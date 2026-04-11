'use client';

import { CheckCircle, Share2 } from 'lucide-react';
import QrTicket from '../QrTicket';
import CalendarAdd from '../CalendarAdd';

interface ConfirmationProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  attendeeName: string;
  ticketId: string;
  qrCodeHash: string;
  isPaid?: boolean;
}

export default function Confirmation({
  eventTitle,
  eventDate,
  eventLocation,
  eventDescription,
  attendeeName,
  ticketId,
  qrCodeHash,
  isPaid,
}: ConfirmationProps) {
  const handleShare = async () => {
    const shareData = {
      title: `I'm going to ${eventTitle}!`,
      text: `Join me at ${eventTitle}`,
      url: window.location.origin + window.location.pathname.replace(/\/(register|checkout)$/, ''),
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-up">
      {/* Success icon */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-muted)]">
          <CheckCircle className="h-8 w-8 text-[var(--color-success)]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
          {isPaid ? 'Purchase Complete!' : "You're Registered!"}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] text-center">
          {isPaid
            ? `Your tickets for ${eventTitle} are confirmed.`
            : `See you at ${eventTitle}!`}
        </p>
      </div>

      {/* QR Ticket */}
      <QrTicket
        ticketId={ticketId}
        qrCodeHash={qrCodeHash}
        eventTitle={eventTitle}
        attendeeName={attendeeName}
        date={new Date(eventDate).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}
      />

      {/* Actions */}
      <div className="w-full flex flex-col gap-3">
        <CalendarAdd
          title={eventTitle}
          description={eventDescription}
          location={eventLocation}
          startDate={eventDate}
        />

        <button
          onClick={handleShare}
          className="btn-press flex items-center justify-center gap-2 rounded-[var(--radius-button)] border-2 border-[var(--color-border)] bg-[var(--color-card)] py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)]"
        >
          <Share2 className="h-4 w-4" />
          Share with Friends
        </button>
      </div>
    </div>
  );
}
