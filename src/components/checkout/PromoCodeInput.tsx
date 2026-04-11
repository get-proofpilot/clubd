'use client';

import { useState, useCallback } from 'react';
import { Tag, X, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface PromoCodeInputProps {
  eventId: string;
  appliedCode?: string;
  onApplied: (code: string, discountInCents: number) => void;
  onRemoved: () => void;
}

export default function PromoCodeInput({
  eventId,
  appliedCode,
  onApplied,
  onRemoved,
}: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = useCallback(async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await trpc.checkout.validatePromoCode.query({
        code: code.trim(),
        eventId,
      });

      if (result.valid && result.discountType && result.discountValue) {
        // For now, calculate a placeholder discount. Real calculation happens server-side.
        onApplied(code.trim().toUpperCase(), result.discountValue);
        setCode('');
      } else {
        setError(result.message || 'Invalid code');
      }
    } catch {
      setError('Failed to validate code');
    } finally {
      setLoading(false);
    }
  }, [code, eventId, onApplied]);

  if (appliedCode) {
    return (
      <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-success-muted)] px-3 py-2">
        <Tag className="h-4 w-4 text-[var(--color-success)]" />
        <span className="flex-1 text-sm font-semibold text-[var(--color-success)]">
          {appliedCode}
        </span>
        <button onClick={onRemoved} className="text-[var(--color-success)] hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="Promo code"
          className="flex-1 rounded-[var(--radius-md)] border-2 border-[var(--color-border)] bg-transparent px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
