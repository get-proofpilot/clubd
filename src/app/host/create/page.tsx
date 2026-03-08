'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Camera, MapPin, Calendar, Clock, Users, Tag, Repeat, UserPlus, Type, AlignLeft,
} from 'lucide-react';
import { EventCategory } from '@/lib/types';
import { getCategoryLabel } from '@/lib/utils';

const CATEGORIES = Object.values(EventCategory);

export default function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory | ''>('');
  const [capacity, setCapacity] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [coHost, setCoHost] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  const inputClasses = "h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-10">
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 pb-3 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <Link href="/" className="tap-target flex items-center justify-center rounded-full">
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-primary)]" strokeWidth={1.8} />
          </Link>
          <h1 className="font-display text-lg font-bold text-[var(--color-text-primary)]">Create Event</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pt-6 sm:px-8">
        <div className="relative flex h-48 flex-col items-center justify-center overflow-hidden rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] transition-colors hover:border-[var(--color-primary)]">
          <Camera className="h-8 w-8 text-[var(--color-text-muted)]" strokeWidth={1.8} />
          <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">Add cover image</p>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Tap or drag & drop</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Type className="h-4 w-4 text-[var(--color-text-muted)]" /> Event Title
            </label>
            <input type="text" placeholder="e.g., Saturday Morning Run Club" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <AlignLeft className="h-4 w-4 text-[var(--color-text-muted)]" /> Description
            </label>
            <textarea placeholder="Tell people what to expect..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Calendar className="h-4 w-4 text-[var(--color-text-muted)]" /> Date
            </label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Clock className="h-4 w-4 text-[var(--color-text-muted)]" /> Time
            </label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClasses} />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <MapPin className="h-4 w-4 text-[var(--color-text-muted)]" /> Location
            </label>
            <input type="text" placeholder="Search for a venue or address" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClasses} />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Tag className="h-4 w-4 text-[var(--color-text-muted)]" /> Category
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value as EventCategory)} className={`${inputClasses} appearance-none`}>
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{getCategoryLabel(cat)}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <Users className="h-4 w-4 text-[var(--color-text-muted)]" /> Capacity
            </label>
            <input type="number" placeholder="Max attendees" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClasses} />
          </div>

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

          <div className="sm:col-span-2">
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
              <UserPlus className="h-4 w-4 text-[var(--color-text-muted)]" /> Co-host (optional)
            </label>
            <input type="text" placeholder="Tag a co-host by name" value={coHost} onChange={(e) => setCoHost(e.target.value)} className={inputClasses} />
          </div>
        </div>

        <button onClick={handleSubmit} className="btn-press mt-8 flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-primary)] font-bold text-white" style={{ boxShadow: 'var(--shadow-button)' }}>
          {submitted ? 'Event Created!' : 'Create Event'}
        </button>
        {submitted && <p className="mt-3 text-center text-sm font-medium text-[var(--color-success)]">Your event is now live. Share it with your community!</p>}
      </main>
    </div>
  );
}
