'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { phoneNumberSchema, otpCodeSchema } from '@/lib/validators/auth';

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

type LoginStep = 'methods' | 'phone-input' | 'otp-verify';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('methods');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const showDemoLogin = process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === 'true';

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  function formatPhoneDisplay(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  function handlePhoneInputChange(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digits);
    setError(null);
  }

  function toE164(digits: string): string {
    return `+1${digits}`;
  }

  async function handleSendOtp() {
    const e164 = toE164(phoneNumber);
    const result = phoneNumberSchema.safeParse(e164);
    if (!result.success) {
      setError('Please enter a valid 10-digit US phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authClient.phoneNumber.sendOtp({
        phoneNumber: e164,
      });

      if (response.error) {
        setError(response.error.message || 'Failed to send verification code. Please try again.');
        return;
      }

      setStep('otp-verify');
      setResendTimer(60);
      setOtpDigits(['', '', '', '', '', '']);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const submitOtp = useCallback(async (code: string) => {
    const codeResult = otpCodeSchema.safeParse(code);
    if (!codeResult.success) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const e164 = toE164(phoneNumber);
      const response = await authClient.phoneNumber.verify({
        phoneNumber: e164,
        code,
      });

      if (response.error) {
        setError(response.error.message || 'Invalid code. Please try again.');
        setOtpDigits(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        return;
      }

      // Check if user needs onboarding
      const session = await authClient.getSession();
      if (session.data?.user && !(session.data.user as Record<string, unknown>).onboardingComplete) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, router]);

  function handleOtpDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setError(null);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      submitOtp(fullCode);
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const newDigits = [...otpDigits];
      newDigits[index - 1] = '';
      setOtpDigits(newDigits);
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);
    if (pasted.length === 6) {
      submitOtp(pasted);
    } else {
      otpRefs.current[pasted.length]?.focus();
    }
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/demo-login', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Demo login failed.');
        return;
      }
      router.push('/');
    } catch {
      setError('Demo login failed. Please try again.');
    } finally {
      setDemoLoading(false);
    }
  }

  async function handleSocialSignIn(provider: 'google' | 'apple') {
    setLoading(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/onboarding',
      });
    } catch {
      setError(`Failed to sign in with ${provider === 'google' ? 'Google' : 'Apple'}. Please try again.`);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--color-bg)] relative overflow-hidden px-6">
      {/* Warm gradient orbs */}
      <div className="absolute top-[-20%] right-[-15%] h-[500px] w-[500px] rounded-full bg-[var(--color-primary)] opacity-[0.04] blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-20%] h-[400px] w-[400px] rounded-full bg-[var(--color-accent)] opacity-[0.05] blur-[80px]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* -- Branding -- */}
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

          {step === 'methods' && (
            <p
              className="animate-fade-up mt-6 max-w-[280px] text-center text-[15px] leading-relaxed text-[var(--color-text-muted)]"
              style={{ '--stagger': 4 } as React.CSSProperties}
            >
              Discover free local events, connect with friends, and find your next favorite thing to do in SoCal.
            </p>
          )}
        </div>

        {/* -- Error Display -- */}
        {error && (
          <div className="mt-4 rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* -- Auth Methods -- */}
        {step === 'methods' && (
          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={() => { setStep('phone-input'); setError(null); }}
              disabled={loading}
              className="animate-fade-up btn-press flex h-14 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] bg-[var(--color-secondary)] font-semibold text-white"
              style={{ '--stagger': 5, boxShadow: '0 4px 16px rgba(28, 30, 42, 0.2)' } as React.CSSProperties}
            >
              <Phone className="h-5 w-5" strokeWidth={1.8} />
              Continue with Phone
            </button>

            <button
              onClick={() => handleSocialSignIn('apple')}
              disabled={loading}
              className="animate-fade-up btn-press flex h-14 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] bg-black font-semibold text-white"
              style={{ '--stagger': 6, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)' } as React.CSSProperties}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <AppleIcon />}
              Continue with Apple
            </button>

            <button
              onClick={() => handleSocialSignIn('google')}
              disabled={loading}
              className="animate-fade-up btn-press flex h-14 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-card)] font-semibold text-[var(--color-text-primary)]"
              style={{ '--stagger': 7, boxShadow: 'var(--shadow-xs)' } as React.CSSProperties}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>
          </div>
        )}

        {/* -- Phone Input Step -- */}
        {step === 'phone-input' && (
          <div className="mt-8 flex flex-col gap-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <button
              onClick={() => { setStep('methods'); setError(null); setPhoneNumber(''); }}
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <p className="text-sm text-[var(--color-text-secondary)]">
              Enter your phone number and we&apos;ll text you a code.
            </p>

            <div className="flex items-center gap-2">
              <span className="flex h-14 items-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 text-[15px] font-medium text-[var(--color-text-secondary)]">
                +1
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoFocus
                placeholder="(555) 123-4567"
                value={formatPhoneDisplay(phoneNumber)}
                onChange={(e) => handlePhoneInputChange(e.target.value)}
                className="h-14 flex-1 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 text-[15px] font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={phoneNumber.length !== 10 || loading}
              className={`btn-press flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] font-bold text-white transition-all ${
                phoneNumber.length === 10 && !loading
                  ? 'bg-[var(--color-primary)]'
                  : 'bg-[var(--color-text-muted)] cursor-not-allowed'
              }`}
              style={phoneNumber.length === 10 && !loading ? { boxShadow: 'var(--shadow-button)' } : undefined}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Send Code'
              )}
            </button>
          </div>
        )}

        {/* -- OTP Verify Step -- */}
        {step === 'otp-verify' && (
          <div className="mt-8 flex flex-col gap-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <button
              onClick={() => { setStep('phone-input'); setError(null); setOtpDigits(['', '', '', '', '', '']); }}
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <p className="text-sm text-[var(--color-text-secondary)]">
              Enter the 6-digit code sent to{' '}
              <span className="font-semibold text-[var(--color-text-primary)]">
                +1 {formatPhoneDisplay(phoneNumber)}
              </span>
            </p>

            {/* 6 individual digit boxes */}
            <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  autoFocus={i === 0}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={loading}
                  className="h-14 w-12 flex-1 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-card)] text-center text-2xl font-bold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50"
                />
              ))}
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </div>
            )}

            <button
              onClick={() => { handleSendOtp(); setResendTimer(60); }}
              disabled={loading || resendTimer > 0}
              className="text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2 disabled:opacity-50 disabled:no-underline"
            >
              {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
            </button>
          </div>
        )}

        {/* Demo user */}
        {step === 'methods' && showDemoLogin && (
          <div className="animate-fade-up mt-6 text-center" style={{ '--stagger': 8 } as React.CSSProperties}>
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2 disabled:opacity-50"
            >
              {demoLoading ? 'Signing in...' : 'Try as demo user'}
            </button>
            <span className="ml-2 rounded-full bg-[var(--color-primary)] bg-opacity-10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[var(--color-primary)] uppercase">
              Beta
            </span>
          </div>
        )}

        {/* Terms */}
        {step === 'methods' && (
          <p className="mt-6 text-center text-xs leading-relaxed text-[var(--color-text-muted)]">
            By continuing, you agree to our{' '}
            <span className="underline underline-offset-2">Terms of Service</span> and{' '}
            <span className="underline underline-offset-2">Privacy Policy</span>
          </p>
        )}
      </div>
    </div>
  );
}
