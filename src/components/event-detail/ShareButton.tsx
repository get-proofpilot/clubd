"use client";

import { useCallback, useState, useEffect } from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url: string;
  onShareTracked?: () => void;
}

export default function ShareButton({
  title,
  url,
  onShareTracked,
}: ShareButtonProps) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleShare = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          text: `Check out ${title} on Clubd`,
          url,
        });
        setToast("Shared!");
        onShareTracked?.();
      } else {
        await navigator.clipboard.writeText(url);
        setToast("Link copied!");
        onShareTracked?.();
      }
    } catch {
      // User cancelled share dialog -- not an error
      // Try clipboard as fallback if share was rejected (not cancelled)
      try {
        await navigator.clipboard.writeText(url);
        setToast("Link copied!");
        onShareTracked?.();
      } catch {
        // Both failed -- silently ignore
      }
    }
  }, [title, url, onShareTracked]);

  return (
    <>
      <button
        onClick={handleShare}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-sm text-[var(--color-text-primary)] hover:bg-white transition-colors"
        aria-label="Share event"
      >
        <Share2 className="h-4 w-4" strokeWidth={1.8} />
      </button>

      {toast && (
        <div className="absolute inset-x-0 bottom-24 z-50 flex justify-center px-4 animate-fade-up pointer-events-none">
          <div className="rounded-xl glass-panel border border-gray-100 px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-[var(--shadow-soft)]">
            {toast}
          </div>
        </div>
      )}
    </>
  );
}
