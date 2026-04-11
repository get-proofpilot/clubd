'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Calendar, Clock, Users, Tag, Repeat,
  Type, AlignLeft, Loader2, DollarSign, ChevronDown,
} from 'lucide-react';
import { trpcReact } from '@/lib/trpc';
import { authClient } from '@/lib/auth-client';
import { getCategoryLabel } from '@/lib/utils';
import ImageUpload from '@/components/ImageUpload';
import PlacesAutocomplete, { type PlaceResult } from '@/components/PlacesAutocomplete';

const CATEGORIES = [
  'fitness', 'wellness', 'social', 'outdoor',
  'food_drink', 'creative', 'family', 'community',
] as const;

type EventCategoryValue = (typeof CATEGORIES)[number];
type PricingType = 'free' | 'free_with_upsell' | 'paid';

interface UploadedImage {
  url: string;
  key: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCommunityId = searchParams.get('community');
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  // Communities the user owns
  const { data: myCommunities } = trpcReact.community.listMine.useQuery(undefined, {
    enabled: !!session?.user,
  });

  // Host as (community or individual)
  const [communityId, setCommunityId] = useState<string | null>(preselectedCommunityId);

  // Core fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [locationText, setLocationText] = useState('');
  const [locationData, setLocationData] = useState<PlaceResult | null>(null);
  const [category, setCategory] = useState<EventCategoryValue | ''>('');
  const [capacity, setCapacity] = useState('');

  // Images
  const [coverImages, setCoverImages] = useState<UploadedImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);

  // Pricing
  const [pricingType, setPricingType] = useState<PricingType>('free');

  // Recurring
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');

  // Advanced
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successId, setSuccessId] = useState<string | null>(null);

  const createEvent = trpcReact.host.createEvent.useMutation({
    onSuccess: (data) => {
      setSuccessId(data.eventId);
    },
  });

  const publishEvent = trpcReact.host.publishEvent.useMutation({
    onSuccess: () => {
      router.push('/host/dashboard');
    },
  });

  if (!sessionLoading && !session?.user) {
    router.push('/login');
    return null;
  }

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  function validate(requireLocation: boolean): boolean {
    const newErrors: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    if (!date) {
      newErrors.date = 'Please select a date';
    }
    if (!startTime) {
      newErrors.startTime = 'Please select a start time';
    }
    if (requireLocation && !locationData) {
      newErrors.location = 'Please select a location to publish';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function buildPayload() {
    const startsAt = new Date(`${date}T${startTime}:00`).toISOString();
    const endsAt = endTime ? new Date(`${date}T${endTime}:00`).toISOString() : undefined;

    const allImageKeys = [
      ...coverImages.map((i) => i.url),
      ...galleryImages.map((i) => i.url),
    ];

    return {
      title: title.trim(),
      description: description.trim() || undefined,
      category: category as EventCategoryValue,
      startsAt,
      endsAt,
      locationName: (locationData?.name ?? locationText.trim()) || undefined,
      address: locationData?.address ?? undefined,
      locationLat: locationData?.lat ?? undefined,
      locationLng: locationData?.lng ?? undefined,
      locationPlaceId: locationData?.placeId ?? undefined,
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      pricingType,
      imageKeys: allImageKeys.length > 0 ? allImageKeys : undefined,
      communityId: communityId ?? undefined,
    };
  }

  async function handleSaveDraft() {
    if (!validate(false)) return;
    createEvent.mutate(buildPayload(), {
      onSuccess: () => {
        setTimeout(() => router.push('/host/dashboard'), 1200);
      },
    });
  }

  async function handlePublish() {
    if (!validate(true)) return;
    createEvent.mutate(buildPayload(), {
      onSuccess: (data) => {
        publishEvent.mutate({ eventId: data.eventId });
      },
    });
  }

  function handleLocationSelect(place: PlaceResult) {
    setLocationData(place);
  }

  const inputClasses =
    'h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10';

  const isLoading = createEvent.isPending || publishEvent.isPending;
  const mutationError = createEvent.error || publishEvent.error;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 pb-3 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <Link href="/host/dashboard" className="tap-target flex items-center justify-center rounded-full">
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-primary)]" strokeWidth={1.8} />
          </Link>
          <h1 className="font-display text-lg font-bold text-[var(--color-text-primary)]">Create Event</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pt-6 sm:px-8">
        {/* Error banner */}
        {mutationError && (
          <div className="mb-4 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {mutationError.message}
          </div>
        )}

        {/* Success banner */}
        {successId && !publishEvent.isPending && (
          <div className="mb-4 rounded-[var(--radius-md)] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Event saved! Redirecting...
          </div>
        )}

        {/* Cover Image */}
        <ImageUpload
          images={coverImages}
          onChange={setCoverImages}
          maxImages={1}
          variant="cover"
        />

        {/* Host as selector — only shows when user has communities */}
        {myCommunities && myCommunities.length > 0 && (
          <div className="mt-4">
            <label className="mb-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
              Host as
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scroll">
              <button
                type="button"
                onClick={() => setCommunityId(null)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  !communityId
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                }`}
              >
                Yourself
              </button>
              {myCommunities.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCommunityId(c.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    communityId === c.id
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                  }`}
                >
                  {c.avatarUrl && (
                    <img src={c.avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                  )}
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Type className="h-4 w-4 text-[var(--color-text-muted)]" /> Event Title
            </label>
            <input
              type="text"
              placeholder="e.g., Saturday Morning Run Club"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Category chips */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Tag className="h-4 w-4 text-[var(--color-text-muted)]" /> Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Calendar className="h-4 w-4 text-[var(--color-text-muted)]" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClasses}
            />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>

          {/* Start Time */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Clock className="h-4 w-4 text-[var(--color-text-muted)]" /> Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputClasses}
            />
            {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>}
          </div>

          {/* End Time */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Clock className="h-4 w-4 text-[var(--color-text-muted)]" /> End Time
              <span className="text-xs font-normal text-[var(--color-text-muted)]">(optional)</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`${inputClasses} sm:max-w-[50%]`}
            />
          </div>

          {/* Location */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              Location
              {locationData && (
                <span className="ml-auto text-xs font-normal text-[var(--color-success)]">Selected</span>
              )}
            </label>
            <PlacesAutocomplete
              value={locationText}
              onChange={setLocationText}
              onSelect={handleLocationSelect}
            />
            {locationData && (
              <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                {locationData.address}
              </p>
            )}
            {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <AlignLeft className="h-4 w-4 text-[var(--color-text-muted)]" /> Description
            </label>
            <textarea
              placeholder="Tell people what to expect..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>

          {/* Additional Images */}
          {coverImages.length > 0 && (
            <div className="sm:col-span-2">
              <label className="mb-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
                Additional Photos
                <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
                  ({galleryImages.length}/4)
                </span>
              </label>
              <ImageUpload
                images={galleryImages}
                onChange={setGalleryImages}
                maxImages={4}
                variant="gallery"
              />
            </div>
          )}

          {/* Pricing */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <DollarSign className="h-4 w-4 text-[var(--color-text-muted)]" /> Tickets
            </label>
            <div className="flex gap-2">
              {([
                { value: 'free', label: 'Free' },
                { value: 'free_with_upsell', label: 'Free + Upsell' },
                { value: 'paid', label: 'Paid' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPricingType(opt.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    pricingType === opt.value
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {pricingType === 'paid' && (
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Ticket tiers can be configured after creating the event.
              </p>
            )}
          </div>

          {/* Advanced Settings */}
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Advanced Settings
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </button>

            {showAdvanced && (
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Capacity */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
                    <Users className="h-4 w-4 text-[var(--color-text-muted)]" /> Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className={inputClasses}
                  />
                </div>

                {/* Recurring */}
                <div className="sm:col-span-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-[var(--color-text-muted)]" />
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        Make this recurring
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRecurring(!isRecurring)}
                      className={`relative h-7 w-12 rounded-full transition-colors ${
                        isRecurring ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-text-muted)]'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                          isRecurring ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  {isRecurring && (
                    <div className="mt-3 flex gap-2">
                      {(['weekly', 'biweekly', 'monthly'] as const).map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setRecurringFrequency(freq)}
                          className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
                            recurringFrequency === freq
                              ? 'bg-[var(--color-primary)] text-white'
                              : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)]/95 backdrop-blur-md pb-[max(env(safe-area-inset-bottom),12px)]">
        <div className="mx-auto flex max-w-2xl gap-3 px-5 pt-3 sm:px-8">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isLoading || !!successId}
            className="btn-press flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-border-strong)] bg-[var(--color-card)] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-subtle)] disabled:opacity-60"
          >
            {createEvent.isPending && !publishEvent.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isLoading || !!successId}
            className="btn-press flex h-12 flex-[2] items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] font-bold text-white disabled:opacity-60"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            {publishEvent.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {successId ? 'Published!' : 'Publish Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
