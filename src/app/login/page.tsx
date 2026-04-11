'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Users, BookUser, MapPin, ShieldCheck, ChevronDown } from 'lucide-react';
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

type LoginStep = 'form' | 'otp-verify';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('form');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [contactsEnabled, setContactsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const showDemoLogin = process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === 'true';

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
      const response = await authClient.phoneNumber.sendOtp({ phoneNumber: e164 });
      if (response.error) {
        setError(response.error.message || 'Failed to send verification code.');
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
      const response = await authClient.phoneNumber.verify({ phoneNumber: e164, code });
      if (response.error) {
        setError(response.error.message || 'Invalid code. Please try again.');
        setOtpDigits(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        return;
      }
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
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) submitOtp(fullCode);
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
    for (let i = 0; i < 6; i++) newDigits[i] = pasted[i] || '';
    setOtpDigits(newDigits);
    if (pasted.length === 6) submitOtp(pasted);
    else otpRefs.current[pasted.length]?.focus();
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
      setError('Demo login failed.');
    } finally {
      setDemoLoading(false);
    }
  }

  async function handleSocialSignIn(provider: 'google' | 'apple') {
    setLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({ provider, callbackURL: '/onboarding' });
    } catch {
      setError(`Failed to sign in with ${provider === 'google' ? 'Google' : 'Apple'}.`);
      setLoading(false);
    }
  }

  // ── OTP Verify Screen ─────────────────────────────────────────────────────
  if (step === 'otp-verify') {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--color-surface-subtle)] px-6">
        <div className="w-full max-w-md">
          <button
            onClick={() => { setStep('form'); setError(null); setOtpDigits(['', '', '', '', '', '']); }}
            className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Verify your number</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Enter the 6-digit code sent to <span className="font-semibold text-[var(--color-text-primary)]">+1 {formatPhoneDisplay(phoneNumber)}</span>
          </p>

          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="flex justify-between gap-2 mb-6" onPaste={handleOtpPaste}>
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
                className="h-14 w-12 flex-1 rounded-xl border border-gray-200 bg-white text-center text-2xl font-bold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand-500)] focus:ring-1 focus:ring-[var(--color-brand-500)] transition-all disabled:opacity-50"
              />
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)] mb-4">
              <Loader2 size={16} className="animate-spin" /> Verifying...
            </div>
          )}

          <button
            onClick={() => { handleSendOtp(); setResendTimer(60); }}
            disabled={loading || resendTimer > 0}
            className="text-sm font-semibold text-[var(--color-brand-600)] disabled:text-[var(--color-text-muted)]"
          >
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
          </button>
        </div>
      </div>
    );
  }

  // ── Main Login Form ───────────────────────────────────────────────────────
  return (
    <div className="bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] w-full min-h-screen overflow-x-hidden m-0 p-0 flex flex-col md:flex-row">
      {/* ── Left: Hero (Desktop Only) ─────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative flex-col justify-between p-12 bg-gradient-to-br from-[var(--color-brand-100)] via-[var(--color-brand-50)] to-white overflow-hidden grain-bg">
        {/* Abstract Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--color-brand-300)] opacity-20 blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-300 opacity-20 blur-[120px] mix-blend-multiply" />

        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-500)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-brand-500)]/30">
              <Users size={20} />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-[var(--color-text-primary)]">Clubd</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-[var(--color-text-primary)] leading-[1.1] mb-6">
              Discover local events through your social graph.
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-10 leading-relaxed">
              Join run clubs, yoga sessions, and community gatherings based on where your friends are going. Social proof makes discovery authentic.
            </p>

            {/* Social Proof Card */}
            <div className="glass-pill rounded-2xl p-6 shadow-xl shadow-[var(--color-brand-900)]/5 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300 w-full max-w-sm border border-white/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)] text-xs font-semibold mb-2">Wellness</span>
                  <h3 className="font-bold text-[var(--color-text-primary)]">Sunrise Yoga & Coffee</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Sat, 8:00 AM &middot; Dolores Park</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-200)] border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-300)] border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-400)] border-2 border-white" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-[var(--color-text-secondary)]">14 Pals going</span>
                </div>
                <span className="px-4 py-2 rounded-full bg-[var(--color-brand-500)] text-white text-sm font-semibold shadow-md shadow-[var(--color-brand-500)]/20">
                  Interested
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
          <ShieldCheck size={16} className="text-[var(--color-brand-500)]" />
          <span>Verified hosts & authentic community reviews.</span>
        </div>
      </div>

      {/* ── Right: Auth Form ──────────────────────────────────── */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center min-h-screen bg-white relative px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        {/* Mobile Header */}
        <div className="md:hidden flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-500)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-brand-500)]/30 mb-4">
            <Users size={24} />
          </div>
          <h1 className="font-display font-bold text-3xl text-[var(--color-text-primary)] mb-2">Clubd</h1>
          <p className="text-[var(--color-text-secondary)] text-sm max-w-[280px]">Find local events through your social graph.</p>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-6 md:mb-8 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-1.5">Welcome in</h2>
            <p className="text-[var(--color-text-secondary)]">Enter your phone number to get started.</p>
          </div>

          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
            {/* Phone Input */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text-secondary)]">Phone Number</label>
              <div className="relative flex rounded-xl shadow-sm border border-gray-200 focus-within:border-[var(--color-brand-500)] focus-within:ring-1 focus-within:ring-[var(--color-brand-500)] transition-all overflow-hidden bg-gray-50">
                <div className="flex items-center px-4 border-r border-gray-200 bg-gray-100 text-[var(--color-text-secondary)] font-medium text-sm">
                  <span>+1</span>
                  <ChevronDown size={12} className="ml-1.5 text-[var(--color-text-muted)]" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  inputMode="numeric"
                  placeholder="(555) 000-0000"
                  value={formatPhoneDisplay(phoneNumber)}
                  onChange={(e) => handlePhoneInputChange(e.target.value)}
                  className="flex-1 block w-full px-4 py-3.5 bg-transparent border-0 focus:ring-0 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm outline-none"
                />
              </div>
            </div>

            {/* Send Code Button */}
            <button
              type="submit"
              disabled={phoneNumber.length !== 10 || loading}
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white transition-all active:scale-[0.98] ${
                phoneNumber.length === 10 && !loading
                  ? 'bg-[var(--color-brand-500)] hover:bg-[var(--color-brand-600)] shadow-[var(--color-brand-500)]/20'
                  : 'bg-[var(--color-text-muted)] cursor-not-allowed'
              }`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send SMS Code'}
            </button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignIn('apple')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 transition-colors"
              >
                <AppleIcon />
                <span className="ml-3">Continue with Apple</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignIn('google')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 transition-colors"
              >
                <GoogleIcon />
                <span className="ml-3">Continue with Google</span>
              </button>
            </div>

            {/* Demo Login */}
            {showDemoLogin && (
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-[var(--color-brand-600)] hover:bg-[var(--color-brand-50)] transition-colors"
              >
                {demoLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                {demoLoading ? 'Signing in...' : 'Try as Demo User'}
              </button>
            )}

            {/* Permissions Toggles */}
            <div className="mt-8 space-y-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Enhance your experience</h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <BookUser size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Find Friends</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">Sync contacts to see who&apos;s going</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setContactsEnabled(!contactsEnabled)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${contactsEnabled ? 'bg-[var(--color-brand-500)]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${contactsEnabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Local Events</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">Use location for nearby activities</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLocationEnabled(!locationEnabled)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${locationEnabled ? 'bg-[var(--color-brand-500)]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${locationEnabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Legal */}
            <div className="mt-6 text-center">
              <p className="text-xs text-[var(--color-text-secondary)]">
                By continuing, you agree to Clubd&apos;s{' '}
                <span className="text-[var(--color-brand-600)] font-medium hover:underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-[var(--color-brand-600)] font-medium hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </form>
        </div>

        {/* Mobile Social Proof Footer */}
        <div className="md:hidden mt-auto pt-8 flex justify-center items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-[var(--color-brand-200)] border border-white" />
            <div className="w-6 h-6 rounded-full bg-[var(--color-brand-300)] border border-white" />
            <div className="w-6 h-6 rounded-full bg-[var(--color-brand-400)] border border-white" />
          </div>
          <span className="text-xs text-[var(--color-text-secondary)] font-medium">Join 20k+ locals discovering events</span>
        </div>
      </div>
    </div>
  );
}
