'use client';

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Users,
  Star,
  Flame,
  CheckCircle2,
  ChevronDown,
  Dumbbell,
  Leaf,
  PartyPopper,
  Mountain,
  UtensilsCrossed,
  Palette,
  Heart,
  HandHeart,
} from 'lucide-react';

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
  { name: 'Fitness', color: '#C44B3F', icon: Dumbbell, desc: 'Sunrise yoga, beach runs, pickup basketball' },
  { name: 'Wellness', color: '#5A9E6F', icon: Leaf, desc: 'Meditation circles, sound baths, breathwork' },
  { name: 'Social', color: '#E8553A', icon: PartyPopper, desc: 'Rooftop mixers, game nights, happy hours' },
  { name: 'Outdoor', color: '#3478A7', icon: Mountain, desc: 'Group hikes, surf sessions, kayak meetups' },
  { name: 'Food & Drink', color: '#C88B2E', icon: UtensilsCrossed, desc: 'Taco crawls, coffee tastings, potlucks' },
  { name: 'Creative', color: '#7B5EA7', icon: Palette, desc: 'Open mics, paint nights, film screenings' },
  { name: 'Family', color: '#D47B8E', icon: Heart, desc: 'Kids playdates, family hikes, storytime' },
  { name: 'Community', color: '#2E8E8E', icon: HandHeart, desc: 'Beach cleanups, volunteering, town halls' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const containerRef = useScrollReveal();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (email.trim()) setSubmitted(true);
    },
    [email],
  );

  // -----------------------------------------------------------------------
  // Email capture component (reused in hero + final CTA)
  // -----------------------------------------------------------------------
  const EmailCapture = ({ dark = false }: { dark?: boolean }) => {
    if (submitted) {
      return (
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-5 py-3 text-emerald-400">
          <CheckCircle2 size={20} />
          <span className="font-semibold text-sm">You&apos;re on the list. We&apos;ll be in touch.</span>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2 flex-col sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex-1 rounded-full px-5 py-3.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[#E8553A]/50 ${
            dark
              ? 'bg-white/10 text-white placeholder:text-white/40 border border-white/15'
              : 'bg-white text-[#1C1E2A] placeholder:text-gray-400 border border-gray-200 shadow-sm'
          }`}
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-[#E8553A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E8553A]/25 transition-all hover:bg-[#D4432A] hover:shadow-xl hover:shadow-[#E8553A]/30 active:scale-95"
        >
          Get Early Access
        </button>
      </form>
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden">
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#1C1E2A] px-6 text-center">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#E8553A] opacity-[0.07] blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#F4A261] opacity-[0.05] blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Badge */}
          <div
            className={`mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 transition-all duration-700 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Now in Orange County &amp; LA
          </div>

          {/* Headline */}
          <h1
            className={`font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tight text-white transition-all duration-700 delay-150 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Free events near you.
            <br />
            <span className="bg-gradient-to-r from-[#E8553A] to-[#F4A261] bg-clip-text text-transparent">
              Friends to go with.
            </span>
          </h1>

          {/* Subhead */}
          <p
            className={`mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/50 sm:text-xl transition-all duration-700 delay-300 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Discover local events happening in Southern California,
            <br className="hidden sm:block" />
            see where your friends are going, and get more social.
          </p>

          {/* Email capture */}
          <div
            className={`mt-10 flex justify-center transition-all duration-700 delay-[450ms] ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <EmailCapture dark />
          </div>

          {/* Social proof */}
          <p
            className={`mt-6 text-sm text-white/30 transition-all duration-700 delay-[600ms] ${
              heroLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Join 2,400+ people discovering their city &mdash; always free
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/20">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* ================================================================
          STATS BAR
          ================================================================ */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-6 sm:gap-16">
          {[
            { value: '500+', label: 'Free Events' },
            { value: '8', label: 'Categories' },
            { value: '2.4K+', label: 'Members' },
            { value: '4.8★', label: 'Avg Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center" data-reveal>
              <div className="text-2xl font-extrabold text-[#1C1E2A] font-display sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs font-medium tracking-wide text-gray-400 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          PROBLEM — "Sound familiar?"
          ================================================================ */}
      <section className="bg-[#F7F4EF] py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center" data-reveal>
            <h2 className="font-display text-3xl font-bold text-[#1C1E2A] sm:text-4xl">Sound familiar?</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-500">
              You live in one of the best places on earth. So why is it so hard to find things to do?
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                emoji: '📱',
                title: 'New to the area?',
                text: 'Moving somewhere new is exciting — until Friday night hits and your contact list is empty.',
              },
              {
                emoji: '🔁',
                title: 'Same old routine?',
                text: 'You love SoCal but somehow end up at the same three places every weekend.',
              },
              {
                emoji: '😬',
                title: 'Going solo feels weird?',
                text: "You want to try that pottery class or beach volleyball league but going alone feels… awkward.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                data-reveal
                style={{ transitionDelay: `${i * 120}ms` }}
                className="rounded-2xl border border-gray-200/60 bg-white p-7 shadow-sm"
              >
                <span className="text-3xl">{card.emoji}</span>
                <h3 className="mt-4 text-lg font-bold text-[#1C1E2A] font-display">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{card.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-14 text-center text-xl font-bold text-[#1C1E2A] font-display" data-reveal>
            Clubd fixes all of this.
          </p>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS
          ================================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center" data-reveal>
            <h2 className="font-display text-3xl font-bold text-[#1C1E2A] sm:text-4xl">
              Three steps to better weekends
            </h2>
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {[
              {
                step: '01',
                icon: MapPin,
                color: '#E8553A',
                title: 'Browse',
                text: 'Swipe through free events happening near you — from sunrise yoga to rooftop mixers to beach cleanups.',
              },
              {
                step: '02',
                icon: Users,
                color: '#3478A7',
                title: "See who\u2019s going",
                text: "Your friends already RSVP\u2019d. Three people from your gym are interested. Two coworkers went last week and loved it.",
              },
              {
                step: '03',
                icon: Star,
                color: '#C88B2E',
                title: 'Show up',
                text: "That\u2019s it. No tickets. No cover charge. No awkward solo arrival. Just show up and find your people.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                data-reveal
                style={{ transitionDelay: `${i * 120}ms` }}
                className="text-center"
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  <item.icon size={28} style={{ color: item.color }} />
                </div>

                <div
                  className="mt-5 text-xs font-bold tracking-widest uppercase"
                  style={{ color: item.color }}
                >
                  Step {item.step}
                </div>

                <h3 className="mt-2 text-xl font-bold text-[#1C1E2A] font-display">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES — What makes Clubd different
          ================================================================ */}
      <section className="bg-[#F7F4EF] py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center" data-reveal>
            <h2 className="font-display text-3xl font-bold text-[#1C1E2A] sm:text-4xl">
              Not another event app
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              Eventbrite sells tickets. Meetup charges hosts. Clubd is built for the stuff that&apos;s already free.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: '🆓',
                title: 'Always free',
                text: "Every single event on Clubd is free. We don\u2019t sell tickets. We help you find the free stuff that already exists in your city.",
                accent: '#5A9E6F',
              },
              {
                icon: '🔥',
                title: 'The social layer',
                text: "Like Strava, but for your social life. See friend activity, give kudos, track your streak. Your weekend just got a leaderboard.",
                accent: '#E8553A',
              },
              {
                icon: '⭐',
                title: 'Real reviews from real people',
                text: "Not influencer posts. Not sponsored content. Reviews from people who actually showed up and have opinions.",
                accent: '#C88B2E',
              },
              {
                icon: '🗺️',
                title: 'Map-first discovery',
                text: "See everything happening around you on a live map. Zoom in on your neighborhood. Tap a dot. Show up tonight.",
                accent: '#3478A7',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
                className="flex gap-5 rounded-2xl border border-gray-200/60 bg-white p-7 shadow-sm"
              >
                <span className="mt-0.5 text-3xl shrink-0">{feature.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-[#1C1E2A] font-display">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          ACTIVITY FEED PREVIEW
          ================================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            {/* Left — copy */}
            <div data-reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8553A]/10 px-3 py-1 text-xs font-bold text-[#E8553A] uppercase tracking-wide">
                <Flame size={14} /> Social Feed
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-[#1C1E2A] sm:text-4xl leading-tight">
                See what your <br className="hidden sm:block" />friends are up to
              </h2>
              <p className="mt-4 max-w-md text-gray-500 leading-relaxed">
                Like Strava&apos;s activity feed — but for your social life. See who RSVP&apos;d, who went where,
                read their reviews, and give kudos. No more &ldquo;what did you do this weekend?&rdquo; — you already know.
              </p>
              <Link
                href="/activity"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#E8553A] hover:underline"
              >
                See the feed <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right — mock feed cards */}
            <div data-reveal className="space-y-3" style={{ transitionDelay: '150ms' }}>
              {[
                {
                  avatar: '🧑‍🦰',
                  name: 'Sarah K.',
                  action: 'is going to',
                  event: 'Sunset Beach Yoga',
                  time: '2h ago',
                  kudos: 12,
                },
                {
                  avatar: '👨‍🦱',
                  name: 'Marcus T.',
                  action: 'attended',
                  event: 'Laguna Art Walk',
                  time: '5h ago',
                  kudos: 8,
                  review: '\u2605\u2605\u2605\u2605\u2605 "Incredible local artists. Going back next month."',
                },
                {
                  avatar: '👩‍🦳',
                  name: 'Priya M. + 3 friends',
                  action: 'are going to',
                  event: 'Irvine Food Truck Roundup',
                  time: '1d ago',
                  kudos: 24,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1C1E2A]">
                        <strong>{item.name}</strong>{' '}
                        <span className="text-gray-400">{item.action}</span>{' '}
                        <strong className="text-[#E8553A]">{item.event}</strong>
                      </p>
                      {item.review && (
                        <p className="mt-1.5 text-xs italic text-gray-400">{item.review}</p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                        <span>{item.time}</span>
                        <span className="flex items-center gap-1">
                          <Flame size={12} className="text-[#E8553A]" /> {item.kudos}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CATEGORIES
          ================================================================ */}
      <section className="bg-[#F7F4EF] py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center" data-reveal>
            <h2 className="font-display text-3xl font-bold text-[#1C1E2A] sm:text-4xl">
              8 categories, infinite possibilities
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              From sunrise workouts to late-night open mics — whatever you&apos;re into, it&apos;s happening near you.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat, i) => (
              <div
                key={cat.name}
                data-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
                className="group cursor-default rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <cat.icon size={20} style={{ color: cat.color }} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#1C1E2A] font-display">{cat.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          EXPLORE CTA — link into the app
          ================================================================ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6 text-center" data-reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400">See it in action</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-[#1C1E2A] sm:text-3xl">
            Explore the demo right now
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Browse Events', href: '/explore' },
              { label: 'Discover Map', href: '/discover' },
              { label: 'Activity Feed', href: '/activity' },
              { label: 'Popular Spots', href: '/spots' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1C1E2A] shadow-sm transition-all hover:border-[#E8553A]/30 hover:shadow-md"
              >
                {link.label}
                <ArrowRight
                  size={14}
                  className="text-gray-400 transition-all group-hover:text-[#E8553A] group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
          ================================================================ */}
      <section className="relative overflow-hidden bg-[#1C1E2A] py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-[#E8553A] opacity-[0.06] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center" data-reveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl leading-tight">
            Your next favorite thing <br className="hidden sm:block" />
            is happening this weekend
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/40">
            Free events. Real people. Your neighborhood. Get early access to Clubd and stop missing out.
          </p>
          <div className="mt-10 flex justify-center">
            <EmailCapture dark />
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="bg-[#15161F] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <span className="font-display text-xl font-bold text-white">Clubd</span>
              <p className="mt-1 text-xs text-white/30">Find your people in Southern California.</p>
            </div>
            <div className="flex gap-6 text-sm text-white/40">
              <Link href="/explore" className="hover:text-white/70 transition-colors">Explore</Link>
              <Link href="/discover" className="hover:text-white/70 transition-colors">Discover</Link>
              <Link href="/activity" className="hover:text-white/70 transition-colors">Activity</Link>
              <Link href="/spots" className="hover:text-white/70 transition-colors">Spots</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-white/20">
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
