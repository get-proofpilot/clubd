'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Camera, MapPin, Calendar, Clock, Users, Tag, Repeat, Type, AlignLeft, Loader2,
} from 'lucide-react';
import { trpcReact } from '@/lib/trpc';
import { authClient } from '@/lib/auth-client';
import { getCategoryLabel } from '@/lib/utils';

const CATEGORIES = [
  'fitness',
  'wellness',
  'social',
  'outdoor',
  'food_drink',
  'creative',
  'family',
  'community',
] as const;

type EventCategoryValue = (typeof CATEGORIES)[number];

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategoryValue | ''>('');
  const [capacity, setCapacity] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successId, setSuccessId] = useState<string | null>(null);

  const createEvent = trpcReact.host.createEvent.useMutation({
    onSuccess: (data) => {
      setSuccessId(data.eventId);
      setTimeout(() => {
        router.push('/host/dashboard');
      }, 1500);
    },
  });

  // Redirect unauthenticated users
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

  function validate(): boolean {
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
    if (!time) {
      newErrors.time = 'Please select a time';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    // Combine date and time into ISO datetime
    const startsAt = new Date(`${date}T${time}:00`).toISOString();

    createEvent.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      category: category as EventCategoryValue,
      startsAt,
      locationName: location.trim() || undefined,
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      pricingType: 'free',
    });
  }

  const inputClasses = "h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10";

  const isLoading = createEvent.isPending;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-10">
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
        {createEvent.error && (
          <div className="mb-4 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {createEvent.error.message}
          </div>
        )}

        {/* Success banner */}
        {successId && (
          <div className="mb-4 rounded-[var(--radius-md)] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Event created successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Cover image placeholder */}
        <div className="relative flex h-48 flex-col items-center justify-center overflow-hidden rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] transition-colors hover:border-[var(--color-primary)]">
          <Camera className="h-8 w-8 text-[var(--color-text-muted)]" strokeWidth={1.8} />
          <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">Add cover image</p>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Tap or drag & drop</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Type className="h-4 w-4 text-[var(--color-text-muted)]" /> Event Title
            </label>
            <input type="text" placeholder="e.g., Saturday Morning Run Club" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <AlignLeft className="h-4 w-4 text-[var(--color-text-muted)]" /> Description
            </label>
            <textarea placeholder="Tell people what to expect..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Calendar className="h-4 w-4 text-[var(--color-text-muted)]" /> Date
            </label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>

          {/* Time */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Clock className="h-4 w-4 text-[var(--color-text-muted)]" /> Time
            </label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClasses} />
            {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
          </div>

          {/* Location */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <MapPin className="h-4 w-4 text-[var(--color-text-muted)]" /> Location
            </label>
            <input type="text" placeholder="Search for a venue or address" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClasses} />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Tag className="h-4 w-4 text-[var(--color-text-muted)]" /> Category
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value as EventCategoryValue)} className={`${inputClasses} appearance-none`}>
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{getCategoryLabel(cat)}</option>))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          {/* Capacity */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Users className="h-4 w-4 text-[var(--color-text-muted)]" /> Capacity
            </label>
            <input type="number" placeholder="Max attendees" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClasses} />
          </div>

          {/* Recurring toggle */}
          <div className="sm:col-span-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">Make this recurring</span>
              </div>
              <button onClick={() => setIsRecurring(!isRecurring)} className={`relative h-7 w-12 rounded-full transition-colors ${isRecurring ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-text-muted)]'}`}>
                <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${isRecurring ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            {isRecurring && (
              <div className="mt-3 flex gap-2">
                {(['weekly', 'monthly'] as const).map((freq) => (
                  <button key={freq} onClick={() => setRecurringFrequency(freq)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${recurringFrequency === freq ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]'}`}
                  >{freq}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !!successId}
          className="btn-press mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] font-bold text-white disabled:opacity-60"
          style={{ boxShadow: 'var(--shadow-button)' }}
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {successId ? 'Event Created!' : isLoading ? 'Creating...' : 'Create Event'}
        </button>
      </main>
    </div>
  );
}
