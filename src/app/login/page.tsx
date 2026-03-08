'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone } from 'lucide-react';

function AppleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--color-bg)] relative overflow-hidden px-6">
      {/* Warm gradient orbs */}
      <div className="absolute top-[-20%] right-[-15%] h-[500px] w-[500px] rounded-full bg-[var(--color-primary)] opacity-[0.04] blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-20%] h-[400px] w-[400px] rounded-full bg-[var(--color-accent)] opacity-[0.05] blur-[80px]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* ── Branding ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center">
          {/* Logo mark */}
          <div
            className="animate-fade-up mb-6 flex h-20 w-20 items-center justify-center rounded-[22px] bg-[var(--color-secondary)]"
            style={{ boxShadow: '0 8px 32px rgba(28, 30, 42, 0.2)' }}
          >
            <span className="font-display text-3xl font-extrabold text-white tracking-tight">C</span>
          </div>

          <h1
            className="animate-fade-up font-display text-[42px] font-extrabold tracking-tight text-[var(--color-secondary)]"
            style={{ '--stagger': 1 } as React.CSSProperties}
          >
            Clubd
          </h1>

          <p
            className="animate-fade-up mt-2 text-lg font-medium text-[var(--color-text-secondary)]"
            style={{ '--stagger': 2 } as React.CSSProperties}
          >
            Find Your People
          </p>

          {/* Brand accent line */}
          <div className="animate-fade-up mt-6 flex items-center gap-2" style={{ '--stagger': 3 } as React.CSSProperties}>
            <span className="h-[3px] w-[3px] rounded-full bg-[var(--color-primary)]" />
            <span className="h-[3px] w-8 rounded-full bg-[var(--color-primary)] opacity-40" />
            <span className="h-[3px] w-[3px] rounded-full bg-[var(--color-primary)]" />
          </div>

          <p
            className="animate-fade-up mt-6 max-w-[280px] text-center text-[15px] leading-relaxed text-[var(--color-text-muted)]"
            style={{ '--stagger': 4 } as React.CSSProperties}
          >
            Discover free local events, connect with friends, and find your next favorite thing to do in SoCal.
          </p>
        </div>

        {/* ── Auth Buttons ─────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-3">
          <button
            onClick={() => router.push('/onboarding')}
            className="animate-fade-up btn-press flex h-14 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] bg-[var(--color-secondary)] font-semibold text-white"
            style={{ '--stagger': 5, boxShadow: '0 4px 16px rgba(28, 30, 42, 0.2)' } as React.CSSProperties}
          >
            <Phone className="h-5 w-5" strokeWidth={1.8} />
            Continue with Phone
          </button>

          <button
            onClick={() => router.push('/onboarding')}
            className="animate-fade-up btn-press flex h-14 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] bg-black font-semibold text-white"
            style={{ '--stagger': 6, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)' } as React.CSSProperties}
          >
            <AppleIcon />
            Continue with Apple
          </button>

          <button
            onClick={() => router.push('/onboarding')}
            className="animate-fade-up btn-press flex h-14 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-card)] font-semibold text-[var(--color-text-primary)]"
            style={{ '--stagger': 7, boxShadow: 'var(--shadow-xs)' } as React.CSSProperties}
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        {/* Demo user */}
        <div className="animate-fade-up mt-6 text-center" style={{ '--stagger': 8 } as React.CSSProperties}>
          <Link href="/" className="text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2">
            Try as demo user
          </Link>
          <span className="ml-2 rounded-full bg-[var(--color-primary)] bg-opacity-10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[var(--color-primary)] uppercase">
            Beta
          </span>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs leading-relaxed text-[var(--color-text-muted)]">
          By continuing, you agree to our{' '}
          <span className="underline underline-offset-2">Terms of Service</span> and{' '}
          <span className="underline underline-offset-2">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
