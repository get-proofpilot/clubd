"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { events, users } from "@/lib/mock-data";
import type { EventCategory } from "@/lib/types";
import FriendAvatarStack from "./FriendAvatarStack";

const featuredIds = ["e1", "e2", "e3", "e5"];
const featuredEvents = featuredIds
  .map((id) => events.find((e) => e.id === id)!)
  .filter(Boolean);

const categoryLabels: Record<EventCategory, string> = {
  fitness: "Fitness",
  wellness: "Wellness",
  social: "Social",
  outdoor: "Outdoor",
  "food-drink": "Food & Drink",
  creative: "Creative",
  family: "Family",
  community: "Community",
};

export default function FeaturedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).offsetWidth
      : 1;
    const gap = 16; // gap-4 = 16px
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, featuredEvents.length - 1));
  }, []);

  return (
    <section className="flex flex-col gap-3">
      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex gap-4 overflow-x-auto px-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {featuredEvents.map((event, i) => {
          const isActive = i === activeIndex;
          const formattedDate = new Date(event.date).toLocaleDateString(
            "en-US",
            {
              weekday: "short",
              month: "short",
              day: "numeric",
            }
          );

          return (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className={`relative w-[85vw] max-w-[600px] shrink-0 overflow-hidden rounded-[var(--radius-card)] transition-all duration-300 ${
                isActive ? "shadow-elevated scale-100" : "scale-[0.97] opacity-90"
              }`}
              style={{
                scrollSnapAlign: "start",
                aspectRatio: "16 / 9",
              }}
            >
              {/* Cover image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.coverImage}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="gradient-overlay-bottom absolute inset-0 pointer-events-none" />

              {/* Category badge */}
              <span
                className={`badge-${event.category} absolute top-3.5 left-3.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider text-white uppercase`}
                style={{ boxShadow: "var(--shadow-pill)" }}
              >
                {categoryLabels[event.category]}
              </span>

              {/* Overlaid content */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4">
                <h3 className="font-display text-xl font-bold leading-snug text-white drop-shadow-sm line-clamp-2">
                  {event.title}
                </h3>

                <div className="flex items-center gap-3 text-[13px] text-white/80">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} strokeWidth={2} />
                    <span className="truncate max-w-[160px]">
                      {event.location.name}
                    </span>
                  </div>
                  <span className="h-1 w-1 rounded-full bg-white/50" />
                  <span>
                    {formattedDate} &middot; {event.time}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {event.friendsGoing.length > 0 && (
                    <div className="[&_span]:text-white/80">
                      <FriendAvatarStack
                        users={event.friendsGoing}
                        label="going"
                        maxShow={3}
                        size="sm"
                      />
                    </div>
                  )}

                  <button
                    className="btn-press ml-auto rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Going
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2">
        {featuredEvents.map((event, i) => (
          <button
            key={event.id}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 bg-[var(--color-primary)]"
                : "w-1.5 bg-[var(--color-border)]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
