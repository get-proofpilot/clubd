'use client';

import { useCallback } from 'react';
import { X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

interface AuthGateProps {
  open: boolean;
  onClose: () => void;
  pendingIntent?: { action: string; eventId: string };
}

export default function AuthGate({ open, onClose, pendingIntent }: AuthGateProps) {
  const handleSignIn = useCallback(
    (provider: 'google' | 'apple') => {
      if (pendingIntent) {
        sessionStorage.setItem('clubd_pending_intent', JSON.stringify(pendingIntent));
      }
      if (provider === 'google') {
        authClient.signIn.social({ provider: 'google', callbackURL: window.location.href });
      } else {
        authClient.signIn.social({ provider: 'apple', callbackURL: window.location.href });
      }
    },
    [pendingIntent],
  );

  const handlePhone = useCallback(() => {
    if (pendingIntent) {
      sessionStorage.setItem('clubd_pending_intent', JSON.stringify(pendingIntent));
    }
    window.location.href = '/login';
  }, [pendingIntent]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-fade-up rounded-t-3xl bg-[var(--color-card)] border-t border-[var(--color-border-subtle)] pb-safe">
        <div className="mx-auto max-w-md px-6 pt-6 pb-8">
          {/* Handle */}
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[var(--color-border)]" />

          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
              Sign in to continue
            </h2>
            <button onClick={onClose} className="text-[var(--color-text-muted)]">
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Create an account or sign in to RSVP for events and get your tickets.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleSignIn('google')}
              className="btn-press flex h-12 items-center justify-center gap-3 rounded-[var(--radius-button)] border-2 border-[var(--color-border)] bg-[var(--color-card)] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleSignIn('apple')}
              className="btn-press flex h-12 items-center justify-center gap-3 rounded-[var(--radius-button)] bg-black font-semibold text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border-subtle)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[var(--color-card)] px-3 text-xs text-[var(--color-text-muted)]">or</span>
              </div>
            </div>

            <button
              onClick={handlePhone}
              className="btn-press flex h-12 items-center justify-center gap-3 rounded-[var(--radius-button)] border-2 border-[var(--color-border)] bg-[var(--color-card)] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)]"
            >
              Continue with Phone
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
