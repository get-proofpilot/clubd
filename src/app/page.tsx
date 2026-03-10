'use client';

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  MapPin,
  Users,
  Star,
  Search,
  Flame,
  CheckCircle2,
  Dumbbell,
  Leaf,
  PartyPopper,
  Mountain,
  UtensilsCrossed,
  Palette,
  Heart,
  HandHeart,
  Megaphone,
  TrendingUp,
  CalendarPlus,
} from 'lucide-react';
import EventCard from '@/components/EventCard';
import { events, activities } from '@/lib/mock-data';

// ---------------------------------------------------------------------------
// Scroll-reveal hook
// ---------------------------------------------------------------------------
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    const targets = el.querySelectorAll('[data-reveal]');
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  return ref;
}

// ---------------------------------------------------------------------------
// Category data
// ---------------------------------------------------------------------------
const categories = [
  { name: 'Fitness', color: '#C44B3F', icon: Dumbbell, count: 64 },
  { name: 'Wellness', color: '#5A9E6F', icon: Leaf, count: 48 },
  { name: 'Social', color: '#E8553A', icon: PartyPopper, count: 112 },
  { name: 'Outdoor', color: '#3478A7', icon: Mountain, count: 73 },
  { name: 'Food & Drink', color: '#C88B2E', icon: UtensilsCrossed, count: 89 },
  { name: 'Creative', color: '#7B5EA7', icon: Palette, count: 41 },
  { name: 'Family', color: '#D47B8E', icon: Heart, count: 35 },
  { name: 'Community', color: '#2E8E8E', icon: HandHeart, count: 52 },
];

// ---------------------------------------------------------------------------
// SoCal neighborhood data
// ---------------------------------------------------------------------------
const neighborhoods = [
  {
    name: 'Laguna Beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    count: 42,
  },
  {
    name: 'Irvine',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    count: 67,
  },
  {
    name: 'Newport Beach',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    count: 54,
  },
  {
    name: 'Downtown LA',
    image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80',
    count: 128,
  },
  {
    name: 'Santa Monica',
    image: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&q=80',
    count: 91,
  },
];

// ---------------------------------------------------------------------------
// Community types (like SweatPals' "Built for every kind of community")
// ---------------------------------------------------------------------------
const communityTypes = [
  {
    title: 'Run clubs & fitness groups',
    description: 'Weekly runs, group workouts, and active communities that keep people showing up.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80',
  },
  {
    title: 'Studios & wellness spaces',
    description: 'Yoga studios, meditation centers, and wellness brands building loyal followings.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
  },
  {
    title: 'Social clubs & meetups',
    description: 'Happy hours, game nights, and hangouts that turn strangers into friends.',
    image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80',
  },
  {
    title: 'Nonprofits & community orgs',
    description: 'Beach cleanups, volunteer days, and events that bring neighborhoods together.',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&q=80',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const containerRef = useScrollReveal();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleEmailSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (email.trim()) setSubmitted(true);
    },
    [email],
  );

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push('/explore');
      }
    },
    [searchQuery, router],
  );

  // Pick 3 activity items for the friendships section
  const friendshipActivities = [activities[0], activities[1], activities[2]];

  // Look up event title by id
  const getEventTitle = (eventId?: string) => {
    if (!eventId) return '';
    const event = events.find((e) => e.id === eventId);
    return event?.title ?? '';
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // -----------------------------------------------------------------------
  // Email capture component
  // -----------------------------------------------------------------------
  const EmailCapture = ({ light = false }: { light?: boolean }) => {
    if (submitted) {
      return (
        <div className={`flex items-center gap-2 rounded-full px-5 py-3 ${light ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/15 text-emerald-400'}`}>
          <CheckCircle2 size={20} />
          <span className="font-semibold text-sm">You&apos;re on the list. We&apos;ll be in touch.</span>
        </div>
      );
    }

    return (
      <form onSubmit={handleEmailSubmit} className="flex w-full max-w-md gap-2 flex-col sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex-1 rounded-full px-5 py-3.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[#E8553A]/50 ${
            light
              ? 'bg-white text-[#1C1E2A] placeholder:text-gray-400 border border-gray-200 shadow-sm'
              : 'bg-white/10 text-white placeholder:text-white/40 border border-white/15'
          }`}
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-[#E8553A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E8553A]/25 transition-all hover:bg-[#D4432A] hover:shadow-xl hover:shadow-[#E8553A]/30 active:scale-95"
        >
          Sign up for free
        </button>
      </form>
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden">
      {/* ================================================================
          1. STICKY TOP NAV
          ================================================================ */}
      <nav className="glass-white fixed top-0 left-0 right-0 z-50 border-b border-gray-200/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="font-display text-xl font-bold text-[#1C1E2A]">Clubd</span>
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-md items-center"
          >
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-[#F7F4EF] py-2.5 pl-10 pr-4 text-sm text-[#1C1E2A] placeholder:text-gray-400 outline-none transition-shadow focus:ring-2 focus:ring-[#E8553A]/30 focus:border-[#E8553A]/30"
              />
            </div>
          </form>

          {/* Nav links + Join button */}
          <div className="flex items-center gap-4">
            <Link
              href="/host/create"
              className="hidden sm:block text-sm font-semibold text-[#1C1E2A] hover:text-[#E8553A] transition-colors"
            >
              Host an event
            </Link>
            <Link
              href="/onboarding"
              className="shrink-0 rounded-full bg-[#E8553A] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#D4432A] active:scale-95"
            >
              Join Clubd
            </Link>
          </div>
        </div>

        {/* Location line */}
        <div className="mx-auto max-w-6xl border-t border-gray-100 px-4 py-1.5 sm:px-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={12} className="text-[#E8553A]" />
            <span>Orange County, CA</span>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-[88px] sm:h-[92px]" />

      {/* ================================================================
          2. HERO — Dual-audience, clear purpose
          ================================================================ */}
      <section className="bg-[#F7F4EF] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1
            className={`font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight text-[#1C1E2A] transition-all duration-700 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            The community platform.
            <br />
            <span className="text-[#E8553A]">Where interests become friendships.</span>
          </h1>

          <p
            className={`mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500 transition-all duration-700 delay-150 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Discover free local events in Southern California.
            Build a community around what you love. Always free.
          </p>

          {/* Dual CTAs — clearly for two audiences */}
          <div
            className={`mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-700 delay-300 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Link
              href="/explore"
              className="rounded-full bg-[#E8553A] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E8553A]/25 transition-all hover:bg-[#D4432A] hover:shadow-xl active:scale-95"
            >
              Explore events
            </Link>
            <Link
              href="/host/create"
              className="group flex items-center gap-2 rounded-full border border-gray-300 px-7 py-3.5 text-sm font-bold text-[#1C1E2A] transition-all hover:border-[#E8553A]/40 hover:shadow-sm"
            >
              Host an event
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile search */}
          <form
            onSubmit={handleSearch}
            className="sm:hidden mt-6"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-[#1C1E2A] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#E8553A]/30"
              />
            </div>
          </form>

          <p
            className={`mt-5 text-sm text-gray-400 transition-all duration-700 delay-[450ms] ${
              heroLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Join 2,400+ people discovering their city
          </p>
        </div>
      </section>

      {/* ================================================================
          3. EVENTS NEAR ORANGE COUNTY, CA
          ================================================================ */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-baseline justify-between" data-reveal>
            <h2 className="font-display text-2xl font-bold text-[#1C1E2A] sm:text-3xl">
              Events near Orange County, CA
            </h2>
            <Link
              href="/explore"
              className="group hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8553A] hover:underline"
            >
              See all events
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal style={{ transitionDelay: '100ms' }}>
            {events.slice(0, 6).map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden" data-reveal>
            <Link
              href="/explore"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#E8553A]"
            >
              See all events
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. DUAL AUDIENCE — For Members / For Hosts (SweatPals-inspired)
          ================================================================ */}
      <section className="bg-[#F7F4EF] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* For Members */}
            <div
              data-reveal
              className="rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8553A]/10 px-3 py-1 text-xs font-bold text-[#E8553A] uppercase tracking-wide">
                <Users size={12} /> For members
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-[#1C1E2A] sm:text-3xl leading-tight">
                Find what moves you
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Browse free events near you. See which friends are going. RSVP in one tap and show up to something great this weekend. It&apos;s that simple.
              </p>
              <Link
                href="/explore"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#E8553A] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#D4432A] active:scale-95"
              >
                Find your crew
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* For Hosts */}
            <div
              data-reveal
              style={{ transitionDelay: '120ms' }}
              className="rounded-2xl border border-gray-200/60 bg-[#1C1E2A] p-8 shadow-sm"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70 uppercase tracking-wide">
                <Megaphone size={12} /> For hosts
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-white sm:text-3xl leading-tight">
                Build what moves others
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                List your events for free, reach new people, and grow a loyal community. Clubd puts your events in front of people who are actually looking for them.
              </p>
              <Link
                href="/host/create"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1C1E2A] shadow-sm transition-all hover:bg-gray-100 active:scale-95"
              >
                Start hosting for free
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. EXPLORE TOP CATEGORIES
          ================================================================ */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-[#1C1E2A] sm:text-3xl" data-reveal>
            Explore top categories
          </h2>

          <div
            className="mt-8 flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            data-reveal
            style={{ transitionDelay: '100ms' }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/explore?category=${cat.name.toLowerCase().replace(/ & /g, '-')}`}
                className="group flex shrink-0 flex-col items-start rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[#E8553A]/20 w-[160px]"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <cat.icon size={22} style={{ color: cat.color }} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#1C1E2A] font-display">{cat.name}</h3>
                <p className="mt-0.5 text-xs text-gray-400">{cat.count} events</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          6. BUILT FOR EVERY KIND OF COMMUNITY
          ================================================================ */}
      <section className="bg-[#F7F4EF] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center" data-reveal>
            <h2 className="font-display text-2xl font-bold text-[#1C1E2A] sm:text-3xl">
              Built for every kind of community
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              Whether you run a fitness group or a neighborhood nonprofit, Clubd gives you the tools to grow.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {communityTypes.map((type, i) => (
              <div
                key={type.title}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className="group overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={type.image}
                    alt={type.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-[#1C1E2A] font-display">{type.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          7. FOR HOSTS — Fill every event (SweatPals-inspired)
          ================================================================ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <div data-reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1E2A] px-3 py-1 text-xs font-bold text-white uppercase tracking-wide">
                <Megaphone size={12} /> For hosts
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-[#1C1E2A] sm:text-3xl leading-tight">
                Fill every event.
                <br />
                Grow your community.
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Over 2,400 people use Clubd to find events nearby. List yours for free and get in front of people who are actively looking for things to do. We invest in your growth so you don&apos;t have to.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {[
                  { icon: CalendarPlus, text: 'List unlimited events for free' },
                  { icon: TrendingUp, text: 'Reach people actively searching nearby' },
                  { icon: Users, text: 'Build a following that comes back' },
                ].map((perk) => (
                  <div key={perk.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8553A]/10">
                      <perk.icon size={16} className="text-[#E8553A]" />
                    </div>
                    <span className="text-sm font-medium text-[#1C1E2A]">{perk.text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/host/create"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#1C1E2A] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#2a2d3e] active:scale-95"
              >
                Get started for free
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Stats card — visual proof for hosts */}
            <div data-reveal style={{ transitionDelay: '150ms' }} className="relative">
              <div className="rounded-2xl border border-gray-200/60 bg-[#F7F4EF] p-8 shadow-sm">
                <div className="space-y-6">
                  {[
                    { value: '2,400+', label: 'Active members', color: '#E8553A' },
                    { value: '500+', label: 'Free events listed', color: '#3478A7' },
                    { value: '92%', label: 'Would come back', color: '#5A9E6F' },
                    { value: '$0', label: 'Always free for hosts', color: '#C88B2E' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-baseline justify-between border-b border-gray-200/60 pb-4 last:border-0 last:pb-0">
                      <span className="text-sm text-gray-500">{stat.label}</span>
                      <span className="font-display text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          8. POPULAR IN SOCAL
          ================================================================ */}
      <section className="bg-[#F7F4EF] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-[#1C1E2A] sm:text-3xl" data-reveal>
            Popular in SoCal
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3" data-reveal style={{ transitionDelay: '100ms' }}>
            {neighborhoods.map((hood, i) => (
              <Link
                key={hood.name}
                href={`/explore?location=${encodeURIComponent(hood.name)}`}
                className={`group relative overflow-hidden rounded-2xl transition-lift ${
                  i === 0 ? 'col-span-2 sm:col-span-1 aspect-[16/10]' : 'aspect-[4/3]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hood.image}
                  alt={hood.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="gradient-overlay-bottom absolute inset-0" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-lg font-bold text-white drop-shadow-sm">{hood.name}</h3>
                  <p className="mt-0.5 text-sm text-white/75">{hood.count} events</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          9. HOW CLUBD WORKS
          ================================================================ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-display text-2xl font-bold text-[#1C1E2A] sm:text-3xl" data-reveal>
            How Clubd works
          </h2>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {[
              {
                icon: MapPin,
                color: '#E8553A',
                title: 'Discover',
                text: 'Browse free events happening near you — from sunrise yoga to rooftop mixers to beach cleanups.',
              },
              {
                icon: Users,
                color: '#3478A7',
                title: 'Connect',
                text: 'See which friends are going, who else is interested, and find your people before you even show up.',
              },
              {
                icon: Star,
                color: '#C88B2E',
                title: 'Show up',
                text: 'No tickets. No cover charge. Just show up, have a great time, and make it a regular thing.',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                data-reveal
                style={{ transitionDelay: `${i * 120}ms` }}
                className="text-center"
              >
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  <item.icon size={26} style={{ color: item.color }} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#1C1E2A] font-display">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          10. FRIENDSHIPS ARE MADE ON CLUBD
          ================================================================ */}
      <section className="bg-[#F7F4EF] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div data-reveal>
            <h2 className="font-display text-2xl font-bold text-[#1C1E2A] sm:text-3xl">
              Friendships are made on Clubd
            </h2>
            <p className="mt-3 max-w-lg text-gray-500">
              See what your friends are up to. RSVP together, give kudos, and never miss a great event.
            </p>
          </div>

          <div className="mt-8 space-y-3" data-reveal style={{ transitionDelay: '150ms' }}>
            {friendshipActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1C1E2A]">
                      <strong>{activity.user.name}</strong>
                      {activity.users && activity.users.length > 1 && (
                        <span className="text-gray-400"> + {activity.users.length - 1} friends</span>
                      )}
                      {' '}
                      <span className="text-gray-400">
                        {activity.type === 'rsvp' || activity.type === 'group_rsvp'
                          ? 'are going to'
                          : activity.type === 'review'
                            ? 'reviewed'
                            : 'attended'}
                      </span>
                      {' '}
                      <strong className="text-[#E8553A]">{getEventTitle(activity.eventId)}</strong>
                    </p>
                    {activity.review && (
                      <p className="mt-1.5 text-xs italic text-gray-400">
                        &ldquo;{activity.review.text.slice(0, 100)}...&rdquo;
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span>{formatRelativeTime(activity.timestamp)}</span>
                      <span className="flex items-center gap-1">
                        <Flame size={12} className="text-[#E8553A]" /> {activity.kudosCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6" data-reveal style={{ transitionDelay: '250ms' }}>
            <Link
              href="/activity"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#E8553A] hover:underline"
            >
              See the activity feed
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          11. TESTIMONIAL
          ================================================================ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center" data-reveal>
          <div className="mx-auto h-16 w-16 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
              alt="Sarah K."
              className="h-full w-full object-cover"
            />
          </div>
          <blockquote className="mt-6 font-display text-xl font-bold leading-snug text-[#1C1E2A] sm:text-2xl">
            &ldquo;I moved to Irvine knowing nobody. Within a month on Clubd I had a running group, a pottery class, and actual friends to call on a Friday night. It changed everything.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-[#1C1E2A]">Sarah K.</p>
          <p className="text-xs text-gray-400">Member since 2024 &middot; Irvine, CA</p>
        </div>
      </section>

      {/* ================================================================
          12. FINAL CTA — Dual path
          ================================================================ */}
      <section className="relative overflow-hidden bg-[#1C1E2A] py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-[#E8553A] opacity-[0.06] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center" data-reveal>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl leading-tight">
            Ready to find your people?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/40">
            Join thousands of people discovering free events, building friendships, and growing communities across Southern California.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="rounded-full bg-[#E8553A] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E8553A]/25 transition-all hover:bg-[#D4432A] hover:shadow-xl active:scale-95"
            >
              Join Clubd — it&apos;s free
            </Link>
            <Link
              href="/host/create"
              className="group flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              Host an event
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          13. FOOTER
          ================================================================ */}
      <footer className="bg-[#15161F] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
            {/* Brand */}
            <div>
              <span className="font-display text-xl font-bold text-white">Clubd</span>
              <p className="mt-1 text-sm text-white/40">The community platform<br />for Southern California.</p>
            </div>

            {/* For Members */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/30">For members</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-white/40">
                <Link href="/explore" className="hover:text-white/70 transition-colors">Explore events</Link>
                <Link href="/discover" className="hover:text-white/70 transition-colors">Discover map</Link>
                <Link href="/activity" className="hover:text-white/70 transition-colors">Activity feed</Link>
                <Link href="/spots" className="hover:text-white/70 transition-colors">Popular spots</Link>
              </div>
            </div>

            {/* For Hosts */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/30">For hosts</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-white/40">
                <Link href="/host/create" className="hover:text-white/70 transition-colors">Create an event</Link>
                <Link href="/host/dashboard" className="hover:text-white/70 transition-colors">Host dashboard</Link>
                <Link href="/host/create" className="hover:text-white/70 transition-colors">Grow your community</Link>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-white/20">
            &copy; {new Date().getFullYear()} Clubd. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Scroll reveal styles */}
      <style jsx global>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-reveal].revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
