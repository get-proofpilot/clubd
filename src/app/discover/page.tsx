'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, SlidersHorizontal, Crosshair } from 'lucide-react';
import { events } from '@/lib/mock-data';
import { EventCategory } from '@/lib/types';
import type { Event } from '@/lib/types';
import BottomNav from '@/components/BottomNav';

// ---------------------------------------------------------------------------
// Category color map (matches CategoryFilter.tsx)
// ---------------------------------------------------------------------------
const categoryColors: Record<EventCategory, string> = {
  [EventCategory.Fitness]: '#C44B3F',
  [EventCategory.Wellness]: '#5A9E6F',
  [EventCategory.Social]: '#E8553A',
  [EventCategory.Outdoor]: '#3478A7',
  [EventCategory.FoodDrink]: '#C88B2E',
  [EventCategory.Creative]: '#7B5EA7',
  [EventCategory.Family]: '#D47B8E',
  [EventCategory.Community]: '#2E8E8E',
};

// ---------------------------------------------------------------------------
// Date formatter
// ---------------------------------------------------------------------------
function formatDate(iso: string): string {
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
  if (isTomorrow) return 'Tomorrow';

  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DiscoverPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const carouselRef = useRef<HTMLDivElement>(null);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [goingSet, setGoingSet] = useState<Set<string>>(new Set());

  // -----------------------------------------------------------------------
  // Scroll carousel to the selected card
  // -----------------------------------------------------------------------
  const scrollToCard = useCallback((eventId: string) => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelector(`[data-event-id="${eventId}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []);

  // -----------------------------------------------------------------------
  // Initialize Leaflet map
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Inject Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    let map: L.Map | null = null;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      if (!mapContainerRef.current || mapRef.current) return;

      map = L.map(mapContainerRef.current, {
        center: [33.65, -117.83],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Attribution bottom-left (compact)
      L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

      mapRef.current = map;

      // ------------------------------------------------------------------
      // Add markers for each event
      // ------------------------------------------------------------------
      events.forEach((event) => {
        const color = categoryColors[event.category] || '#E8553A';

        const icon = L.divIcon({
          className: 'clubd-marker',
          html: `<div style="
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: ${color};
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          " data-marker-id="${event.id}"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const marker = L.marker([event.location.lat, event.location.lng], { icon }).addTo(map!);

        marker.on('click', () => {
          setSelectedEventId(event.id);
          scrollToCard(event.id);
        });

        markersRef.current.set(event.id, marker);
      });
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
      link.remove();
    };
  }, [scrollToCard]);

  // -----------------------------------------------------------------------
  // Update marker styles when selection changes
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    markersRef.current.forEach((marker, eventId) => {
      const el = marker.getElement();
      if (!el) return;
      const dot = el.querySelector('[data-marker-id]') as HTMLElement | null;
      if (!dot) return;

      if (eventId === selectedEventId) {
        dot.style.transform = 'scale(1.6)';
        dot.style.boxShadow = '0 3px 10px rgba(0,0,0,0.45)';
        dot.style.zIndex = '1000';
      } else {
        dot.style.transform = 'scale(1)';
        dot.style.boxShadow = '0 2px 6px rgba(0,0,0,0.35)';
        dot.style.zIndex = '';
      }
    });

    // Pan map to selected event
    if (selectedEventId && mapRef.current) {
      const event = events.find((e) => e.id === selectedEventId);
      if (event) {
        mapRef.current.panTo([event.location.lat, event.location.lng], { animate: true });
      }
    }
  }, [selectedEventId]);

  // -----------------------------------------------------------------------
  // Handle carousel scroll-snap to sync selection
  // -----------------------------------------------------------------------
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const cards = carousel.querySelectorAll('[data-event-id]');
        const containerRect = carousel.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestId: string | null = null;
        let closestDist = Infinity;

        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = Math.abs(cardCenter - containerCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestId = card.getAttribute('data-event-id');
          }
        });

        if (closestId && closestId !== selectedEventId) {
          setSelectedEventId(closestId);
        }
      }, 80);
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      carousel.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [selectedEventId]);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------
  const handleToggleGoing = (eventId: string) => {
    setGoingSet((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 14, { animate: true });
      },
      () => {
        // Silently fail - stay on default view
      },
    );
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* ---------- Floating header ---------- */}
      <header className="absolute top-0 left-0 right-0 z-30 px-4 pt-[env(safe-area-inset-top,12px)]">
        <div className="mt-2 flex items-center justify-between gap-3">
          {/* Location pill */}
          <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5 card-shadow">
            <MapPin size={16} className="text-[var(--color-primary)]" />
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              Orange County, CA
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter button */}
            <button className="glass flex h-10 w-10 items-center justify-center rounded-full card-shadow btn-press">
              <SlidersHorizontal size={18} className="text-[var(--color-text-secondary)]" />
            </button>

            {/* My location button */}
            <button
              onClick={handleMyLocation}
              className="glass flex h-10 w-10 items-center justify-center rounded-full card-shadow btn-press"
            >
              <Crosshair size={18} className="text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Floating event card carousel ---------- */}
      <div className="absolute bottom-[72px] left-0 right-0 z-30">
        <div
          ref={carouselRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 pt-1"
          style={{ scrollPaddingInline: '16px' }}
        >
          {events.map((event) => {
            const isSelected = event.id === selectedEventId;
            const isGoing = goingSet.has(event.id);
            const color = categoryColors[event.category] || '#E8553A';

            return (
              <div
                key={event.id}
                data-event-id={event.id}
                onClick={() => {
                  setSelectedEventId(event.id);
                }}
                className={`flex w-[300px] shrink-0 snap-center cursor-pointer items-start gap-3 rounded-2xl p-3 transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 scale-[1.02]'
                    : 'ring-0'
                }`}
                style={{
                  backgroundColor: 'var(--color-card)',
                  boxShadow: isSelected ? 'var(--shadow-elevated)' : 'var(--shadow-card)',
                  outline: isSelected ? `2px solid ${color}` : 'none',
                  outlineOffset: '-1px',
                }}
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  {/* Category dot */}
                  <div
                    className="absolute top-1 left-1 h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color, border: '1.5px solid white' }}
                  />
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3 className="truncate text-sm font-semibold text-[var(--color-text-primary)] font-display">
                    {event.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {formatDate(event.date)} &middot; {event.time}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">
                    {event.location.name}
                  </p>

                  {/* Going button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleGoing(event.id);
                    }}
                    className="btn-press mt-1 self-start rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200"
                    style={
                      isGoing
                        ? {
                            backgroundColor: color,
                            color: 'white',
                            boxShadow: `0 2px 8px ${color}40`,
                          }
                        : {
                            backgroundColor: 'transparent',
                            color: color,
                            border: `1.5px solid ${color}`,
                          }
                    }
                  >
                    {isGoing ? 'Going' : 'Going'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- Bottom navigation ---------- */}
      <BottomNav />

      {/* ---------- Global marker style override ---------- */}
      <style jsx global>{`
        .clubd-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
