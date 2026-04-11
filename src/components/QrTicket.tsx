'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrTicketProps {
  ticketId: string;
  qrCodeHash: string;
  eventTitle: string;
  attendeeName: string;
  date: string;
}

export default function QrTicket({
  ticketId,
  qrCodeHash,
  eventTitle,
  attendeeName,
  date,
}: QrTicketProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const qrPayload = `${appUrl}/ticket/verify/${ticketId}?sig=${qrCodeHash}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, qrPayload, {
      width: 200,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
    });
  }, [qrPayload]);

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--color-card)] border border-[var(--color-border-subtle)] card-shadow overflow-hidden">
      <div className="p-5 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
          Your Ticket
        </p>
        <p className="font-display text-lg font-bold text-[var(--color-text-primary)]">
          {eventTitle}
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{attendeeName}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{date}</p>
      </div>

      {/* Perforated line */}
      <div className="relative">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[var(--color-bg)]" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[var(--color-bg)]" />
        <div className="border-t-2 border-dashed border-[var(--color-border-subtle)] mx-6" />
      </div>

      <div className="flex justify-center p-5">
        <canvas ref={canvasRef} className="rounded-lg" />
      </div>
    </div>
  );
}
