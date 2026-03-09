'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Dumbbell,
  Heart,
  Users,
  Mountain,
  UtensilsCrossed,
  Palette,
  Baby,
  HandHelping,
  ArrowRight,
  Locate,
  Loader2,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { trpc } from '@/lib/trpc';

const LOCATIONS = [
  { id: 'oc', label: 'Orange County' },
  { id: 'la', label: 'LA County' },
  { id: 'sd', label: 'San Diego County' },
  { id: 'ie', label: 'Inland Empire' },
];

const INTERESTS = [
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'wellness', label: 'Wellness', icon: Heart },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'outdoor', label: 'Outdoor', icon: Mountain },
  { id: 'food_drink', label: 'Food & Drink', icon: UtensilsCrossed },
  { id: 'creative', label: 'Creative', icon: Palette },
  { id: 'family', label: 'Family', icon: Baby },
  { id: 'community', label: 'Community', icon: HandHelping },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const session = authClient.useSession();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [locationButtonText, setLocationButtonText] = useState('Use my location');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleInterest(id: string) {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function getLocationLabel(id: string): string {
    return LOCATIONS.find((loc) => loc.id === id)?.label ?? id;
  }

  async function handleComplete() {
    if (!selectedLocation || selectedInterests.size < 2) return;

    setLoading(true);
    setError(null);

    try {
      await trpc.user.completeOnboarding.mutate({
        location: getLocationLabel(selectedLocation),
        interests: Array.from(selectedInterests) as (
          "fitness" | "wellness" | "social" | "outdoor" |
          "food_drink" | "creative" | "family" | "community"
        )[],
      });

      router.push('/');
    } catch {
      setError('Something went wrong saving your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Show loading while session is being checked
  if (session.isPending) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center bg-[var(--color-bg)]">
      {/* Progress Bar */}
      <div className="flex w-full max-w-md gap-2 px-6 pt-[max(env(safe-area-inset-top),20px)]">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500" style={{ width: '100%' }} />
        </div>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500" style={{ width: step === 2 ? '100%' : '0%' }} />
        </div>
      </div>

      {/* Welcome message for authenticated users */}
      {session.data?.user && (
        <div className="w-full max-w-md px-6 pt-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Welcome, <span className="font-semibold text-[var(--color-text-primary)]">{session.data.user.name || 'there'}</span>
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="w-full max-w-md px-6 pt-4">
          <div className="rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="flex flex-1 flex-col w-full max-w-md px-6 pt-8">
        {step === 1 ? (
          <div className="flex flex-1 flex-col" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: 'var(--color-primary-muted)' }}>
              <MapPin className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <h1 className="font-display mt-4 text-2xl font-bold text-[var(--color-text-primary)]">Where do you hang out?</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">We&apos;ll show you events nearby. You can always change this later.</p>

            <div className="mt-8 flex flex-col gap-3">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`btn-press flex h-14 items-center rounded-[var(--radius-button)] border-2 px-5 text-left text-[15px] font-medium transition-all ${
                    selectedLocation === loc.id
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]'
                  }`}
                  style={selectedLocation === loc.id ? { backgroundColor: 'var(--color-primary-muted)' } : undefined}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setLocationButtonText('Locating...');
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    () => {
                      setSelectedLocation('oc');
                      setLocationButtonText('Located! Orange County');
                    },
                    () => {
                      setSelectedLocation('oc');
                      setLocationButtonText('Located! Orange County');
                    },
                    { timeout: 5000 }
                  );
                } else {
                  setSelectedLocation('oc');
                  setLocationButtonText('Located! Orange County');
                }
              }}
              className={`btn-press mt-4 flex items-center justify-center gap-2 rounded-[var(--radius-button)] border-2 py-3.5 text-sm font-medium transition-colors ${
                locationButtonText === 'Located! Orange County'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
              style={locationButtonText === 'Located! Orange County' ? { backgroundColor: 'var(--color-primary-muted)' } : undefined}
            >
              <Locate className="h-4 w-4" />
              {locationButtonText}
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: 'var(--color-primary-muted)' }}>
              <Heart className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <h1 className="font-display mt-4 text-2xl font-bold text-[var(--color-text-primary)]">What are you into?</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Pick at least 2 so we can personalise your feed.</p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {INTERESTS.map((interest) => {
                const Icon = interest.icon;
                const selected = selectedInterests.has(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`btn-press relative flex flex-col items-center gap-2 rounded-[var(--radius-card)] border-2 py-5 transition-all ${
                      selected
                        ? 'border-[var(--color-primary)] card-shadow'
                        : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-strong)]'
                    }`}
                    style={selected ? { backgroundColor: 'var(--color-primary-muted)' } : undefined}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)]">
                      <Icon className={`h-5 w-5 ${selected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`} />
                    </div>
                    <span className={`text-sm font-semibold ${selected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                      {interest.label}
                    </span>
                    {selected && (
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                        &#10003;
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-md px-6 pb-[max(env(safe-area-inset-bottom),24px)] pt-4">
        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            disabled={!selectedLocation}
            className={`btn-press flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] font-bold text-white transition-all ${selectedLocation ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-text-muted)] cursor-not-allowed'}`}
            style={selectedLocation ? { boxShadow: 'var(--shadow-button)' } : undefined}
          >
            Next <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={selectedInterests.size < 2 || loading}
            className={`btn-press flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] font-bold text-white transition-all ${selectedInterests.size >= 2 && !loading ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-text-muted)] cursor-not-allowed'}`}
            style={selectedInterests.size >= 2 && !loading ? { boxShadow: 'var(--shadow-button)' } : undefined}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Get Started'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
