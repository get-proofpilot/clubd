"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface EventGalleryProps {
  images: Array<{ url: string; sortOrder: number }>;
  title: string;
}

export default function EventGallery({ images, title }: EventGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRefs = useRef<Map<number, IntersectionObserver>>(new Map());

  const setItemRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      // Clean up old observer for this index
      const existing = observerRefs.current.get(index);
      if (existing) {
        existing.disconnect();
        observerRefs.current.delete(index);
      }

      if (!el || sorted.length <= 1) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveIndex(index);
            }
          });
        },
        { root: scrollRef.current, threshold: 0.5 },
      );
      observer.observe(el);
      observerRefs.current.set(index, observer);
    },
    [sorted.length],
  );

  useEffect(() => {
    return () => {
      observerRefs.current.forEach((obs) => obs.disconnect());
      observerRefs.current.clear();
    };
  }, []);

  if (sorted.length === 0) {
    return (
      <div className="h-72 w-full bg-[var(--color-surface-subtle)] sm:h-96" />
    );
  }

  // Single image hero
  if (sorted.length === 1) {
    return (
      <div className="relative h-72 w-full overflow-hidden sm:h-96">
        <img
          src={sorted[0].url}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="gradient-overlay-top absolute inset-x-0 top-0 h-24" />
        <div className="gradient-overlay-bottom absolute inset-x-0 bottom-0 h-36" />
      </div>
    );
  }

  // Multi-image gallery with CSS scroll-snap
  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {sorted.map((img, i) => (
          <div
            key={img.url}
            ref={(el) => setItemRef(el, i)}
            className="relative h-72 w-full shrink-0 overflow-hidden sm:h-96"
            style={{ scrollSnapAlign: "start" }}
          >
            <img
              src={img.url}
              alt={`${title} - image ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="gradient-overlay-top absolute inset-x-0 top-0 h-24" />
            <div className="gradient-overlay-bottom absolute inset-x-0 bottom-0 h-36" />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {sorted.map((_, i) => (
          <span
            key={i}
            className={`block h-1.5 rounded-full transition-all duration-200 ${
              i === activeIndex
                ? "w-4 bg-white"
                : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
