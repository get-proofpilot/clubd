'use client';

import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  Dumbbell,
  Flower2,
  Wine,
  Palette,
  BadgeCheck,
  ChevronRight,
  Calendar,
  X,
} from 'lucide-react';
import MobileContainer from '@/components/MobileContainer';
import { events } from '@/lib/mock-data';
import type { Event } from '@/lib/types';
import { EventCategory } from '@/lib/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) return 'Today';

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();
  if (isTomorrow) return 'Tom';

  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatTime(time: string): string {
  // "7:00 AM" -> "7AM"
  return time.replace(':00', '').replace(' ', '');
}

// ---------------------------------------------------------------------------
// Categories data
// ---------------------------------------------------------------------------

const categories = [
  {
    name: 'Fitness',
    icon: Dumbbell,
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Wellness',
    icon: Flower2,
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Social',
    icon: Wine,
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Creative',
    icon: Palette,
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
];

const trendingSearches = ['Run Club', 'Yoga Flow', 'Cold Plunge', 'Pottery', 'Tech Mixer'];

// ---------------------------------------------------------------------------
// Category label color map
// ---------------------------------------------------------------------------

const categoryLabel: Record<EventCategory, string> = {
  [EventCategory.Fitness]: 'Fitness',
  [EventCategory.Wellness]: 'Wellness',
  [EventCategory.Social]: 'Social',
  [EventCategory.Outdoor]: 'Outdoor',
  [EventCategory.FoodDrink]: 'Food & Drink',
  [EventCategory.Creative]: 'Creative',
  [EventCategory.Family]: 'Family',
  [EventCategory.Community]: 'Community',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DiscoverPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter state
  const [activeWhen, setActiveWhen] = useState('Anytime');
  const [activePrice, setActivePrice] = useState('Any');
  const [radius, setRadius] = useState(5);

  const recommendedEvents = events.slice(0, 3);

  return (
    <MobileContainer className="h-screen">
      {/* -- Mobile Header & Search Section (hidden on desktop) -- */}
      <header className="md:hidden sticky top-0 z-40 bg-white pt-[max(env(safe-area-inset-top),12px)] pb-4 px-4 border-b border-gray-100" style={{ boxShadow: 'var(--shadow-xs)' }}>
        <div className="flex items-center gap-3 mb-4">
          <h1
            className="font-display font-bold text-xl flex-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Explore
          </h1>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
            style={{ backgroundColor: 'var(--color-surface-subtle)', color: 'var(--color-text-primary)' }}
          >
            <MapPin size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} style={{ color: 'var(--color-brand-500)' }} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, hosts, or categories..."
            className="w-full rounded-2xl py-3 pl-12 pr-12 text-base font-medium outline-none transition-all border border-transparent focus:border-[var(--color-brand-500)] focus:bg-white"
            style={{
              backgroundColor: 'var(--color-surface-subtle)',
              color: 'var(--color-text-primary)',
            }}
          />
          <button
            onClick={() => setFilterOpen(true)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center group"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 group-hover:border-[var(--color-brand-300)] transition-colors" style={{ boxShadow: 'var(--shadow-xs)' }}>
              <SlidersHorizontal
                size={16}
                className="group-hover:text-[var(--color-brand-500)] transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
              />
            </div>
          </button>
        </div>
      </header>

      {/* -- Desktop Search Section (hidden on mobile, visible on md+) -- */}
      <div className="hidden md:block border-b border-gray-100 bg-white py-6" style={{ boxShadow: 'var(--shadow-xs)' }}>
        <div className="content-max px-4 md:px-6 lg:px-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search size={20} style={{ color: 'var(--color-brand-500)' }} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, hosts, or categories..."
              className="w-full rounded-2xl py-3.5 pl-14 pr-14 text-base font-medium outline-none transition-all border border-gray-200 focus:border-[var(--color-brand-500)] focus:bg-white"
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                color: 'var(--color-text-primary)',
              }}
            />
            <button
              onClick={() => setFilterOpen(true)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center group"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-gray-200 group-hover:border-[var(--color-brand-300)] transition-colors" style={{ boxShadow: 'var(--shadow-xs)' }}>
                <SlidersHorizontal
                  size={16}
                  className="group-hover:text-[var(--color-brand-500)] transition-colors"
                  style={{ color: 'var(--color-text-primary)' }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* -- Main Content -- */}
      <main
        className="flex-1 overflow-y-auto pb-4"
        style={{ backgroundColor: 'var(--color-surface-subtle)', scrollbarWidth: 'none' }}
      >
        <div className="content-max px-4 md:px-6 lg:px-8 space-y-6 md:space-y-10">
          {/* Trending Searches */}
          <section className="py-6 md:py-0 md:pt-8">
            <h2
              className="font-display font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Trending Now
            </h2>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  className="px-4 py-2 rounded-full bg-white border border-gray-100 text-sm font-medium shadow-sm hover:border-[var(--color-brand-300)] hover:text-[var(--color-brand-600)] transition-colors flex items-center gap-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <TrendingUp size={14} style={{ color: 'var(--color-brand-500)' }} />
                  {term}
                </button>
              ))}
            </div>
          </section>

          {/* Categories Grid */}
          <section>
            <h2
              className="font-display font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Browse Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <a
                  key={cat.name}
                  href="#"
                  className="relative h-24 md:h-32 rounded-xl overflow-hidden group block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <cat.icon size={22} className="mb-1" />
                    <span className="font-display font-semibold text-sm">{cat.name}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Recommended Events */}
          <section className="space-y-4 pb-4">
            <div className="flex justify-between items-end mb-2">
              <h2
                className="font-display font-bold text-lg md:text-xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Recommended for you
              </h2>
            </div>

            {/* Event cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedEvents.map((event) => (
                <EventResultCard key={event.id} event={event} />
              ))}
            </div>

            {/* Host profile card */}
            <HostProfileCard />
          </section>
        </div>
      </main>

      {/* -- Filter Overlay -- */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setFilterOpen(false)}
        />
      )}

      {/* -- Filter Panel: bottom sheet on mobile, side panel on desktop -- */}
      <div
        className={`fixed z-50 bg-white flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          filterOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'
        } inset-x-0 bottom-0 rounded-t-[32px] md:rounded-t-none md:rounded-l-2xl md:inset-y-0 md:left-auto md:right-0 md:w-[420px]`}
        style={{
          height: '85vh',
          boxShadow: 'var(--shadow-sheet)',
        }}
      >
        {/* Handle (mobile only) */}
        <div
          className="w-full flex justify-center pt-3 pb-2 cursor-pointer md:hidden"
          onClick={() => setFilterOpen(false)}
        >
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>

        <div className="px-4 pb-4 flex justify-between items-center border-b border-gray-100">
          <h2
            className="font-display font-bold text-lg"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Filters
          </h2>
          <div className="flex items-center gap-3">
            <button
              className="text-sm font-medium"
              style={{ color: 'var(--color-brand-600)' }}
              onClick={() => {
                setActiveWhen('Anytime');
                setActivePrice('Any');
                setRadius(5);
              }}
            >
              Reset
            </button>
            <button
              className="hidden md:flex w-8 h-8 rounded-full items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={() => setFilterOpen(false)}
            >
              <X size={18} style={{ color: 'var(--color-text-primary)' }} />
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Location */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3
                className="font-semibold text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Location
              </h3>
              <button
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: 'var(--color-brand-600)' }}
              >
                <MapPin size={12} /> Map View
              </button>
            </div>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-secondary)' }}
              />
              <input
                type="text"
                defaultValue="Current Location"
                className="w-full border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none"
                style={{
                  backgroundColor: 'var(--color-surface-subtle)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span style={{ color: 'var(--color-text-secondary)' }}>Radius</span>
                <span style={{ color: 'var(--color-brand-600)' }}>{radius} miles</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-500)]"
              />
            </div>
          </div>

          {/* When */}
          <div className="space-y-3">
            <h3
              className="font-semibold text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            >
              When
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Anytime', 'Today', 'Tomorrow', 'This Weekend'].map((option) => (
                <button
                  key={option}
                  onClick={() => setActiveWhen(option)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
                  style={
                    activeWhen === option
                      ? {
                          backgroundColor: 'var(--color-brand-50)',
                          borderColor: 'var(--color-brand-200)',
                          color: 'var(--color-brand-700)',
                          fontWeight: 600,
                        }
                      : {
                          backgroundColor: 'white',
                          borderColor: '#e5e7eb',
                          color: 'var(--color-text-secondary)',
                        }
                  }
                >
                  {option}
                </button>
              ))}
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white flex items-center gap-1 transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Calendar size={14} /> Pick Date
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-3">
            <h3
              className="font-semibold text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Price
            </h3>
            <div className="flex gap-2">
              {['Any', 'Free', 'Paid'].map((option) => (
                <button
                  key={option}
                  onClick={() => setActivePrice(option)}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border transition-colors"
                  style={
                    activePrice === option
                      ? {
                          backgroundColor: 'var(--color-brand-50)',
                          borderColor: 'var(--color-brand-200)',
                          color: 'var(--color-brand-700)',
                          fontWeight: 600,
                        }
                      : {
                          backgroundColor: 'white',
                          borderColor: '#e5e7eb',
                          color: 'var(--color-text-secondary)',
                        }
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Event Size */}
          <div className="space-y-3">
            <h3
              className="font-semibold text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Event Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Intimate (1-10)', 'Medium (11-50)', 'Large (50+)'].map((option) => (
                <button
                  key={option}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium transition-colors hover:border-[var(--color-brand-300)]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div className="space-y-3">
            <h3
              className="font-semibold text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Accessibility
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 accent-[var(--color-brand-500)]"
                />
                <span
                  className="text-sm font-medium flex-1"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Wheelchair Accessible
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 accent-[var(--color-brand-500)]"
                />
                <span
                  className="text-sm font-medium flex-1"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Beginner Friendly
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => setFilterOpen(false)}
            className="w-full py-4 rounded-2xl text-white text-base font-semibold transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-brand-500)',
              boxShadow: 'var(--shadow-button)',
            }}
          >
            Show {events.length} Results
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}

// ---------------------------------------------------------------------------
// Event Result Card (list-style)
// ---------------------------------------------------------------------------

function EventResultCard({ event }: { event: Event }) {
  const dateLabel = `${formatShortDate(event.date)} ${formatTime(event.time)}`;
  const palsGoing = event.friendsGoing.length;
  const palsInterested = event.friendsInterested.length;
  const palText =
    palsGoing > 0
      ? `${palsGoing} Pal${palsGoing > 1 ? 's' : ''} going`
      : palsInterested > 0
        ? `${palsInterested} Pal${palsInterested > 1 ? 's' : ''} interested`
        : null;

  const palAvatars = palsGoing > 0 ? event.friendsGoing : event.friendsInterested;

  return (
    <article
      className="bg-white rounded-2xl p-3 border border-gray-100 flex gap-3 cursor-pointer hover:border-[var(--color-brand-200)] transition-colors"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Thumbnail */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover"
          src={event.coverImage}
          alt={event.title}
        />
        <div className="absolute top-1 left-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {dateLabel}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider mb-1 block"
            style={{ color: 'var(--color-brand-600)' }}
          >
            {categoryLabel[event.category]}
          </span>
          <h3
            className="font-display font-bold text-base leading-tight mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {event.title}
          </h3>
          <p
            className="text-xs mb-2 flex items-center gap-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <MapPin size={12} style={{ color: 'var(--color-brand-400)' }} />
            {event.location.name}
          </p>
        </div>
        {palText && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {palAvatars.slice(0, 3).map((pal) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={pal.id}
                  src={pal.avatar}
                  alt={pal.name}
                  className="w-5 h-5 rounded-full border border-white"
                />
              ))}
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{ color: 'var(--color-brand-700)' }}
            >
              {palText}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Host Profile Card
// ---------------------------------------------------------------------------

function HostProfileCard() {
  // Use the host from the first event as a representative profile
  const host = events[0]?.host;
  if (!host) return null;

  return (
    <article
      className="bg-white rounded-2xl p-3 border border-gray-100 flex gap-3 items-center cursor-pointer hover:border-[var(--color-brand-200)] transition-colors"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 p-0.5" style={{ border: '2px solid var(--color-brand-100)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover rounded-full"
          src={host.avatar}
          alt={host.name}
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-0.5">
          <h3
            className="font-display font-bold text-base"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {host.name}
          </h3>
          {host.verified && (
            <BadgeCheck size={14} style={{ color: 'var(--color-brand-500)' }} />
          )}
        </div>
        <p
          className="text-xs mb-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Host &bull; {host.eventCount} Upcoming Events
        </p>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-surface-subtle)',
            }}
          >
            Wellness
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-surface-subtle)',
            }}
          >
            Community
          </span>
        </div>
      </div>

      {/* Chevron */}
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}
      >
        <ChevronRight size={16} />
      </button>
    </article>
  );
}
