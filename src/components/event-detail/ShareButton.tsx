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
        className="absolute right-4 top-[max(env(safe-area-inset-top),16px)] z-10 flex h-10 w-10 items-center justify-center rounded-full glass-dark border border-white/10"
        aria-label="Share event"
      >
        <Share2 className="h-5 w-5 text-white" strokeWidth={1.8} />
      </button>

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-5 animate-fade-up">
          <div className="rounded-[var(--radius-md)] glass-white border border-[var(--color-border-subtle)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] card-shadow">
            {toast}
          </div>
        </div>
      )}
    </>
  );
}
