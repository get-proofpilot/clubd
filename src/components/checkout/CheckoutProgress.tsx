'use client';

import { Check } from 'lucide-react';
import type { CheckoutStep } from '@/lib/types';

const steps: { key: CheckoutStep; label: string }[] = [
  { key: 'selection', label: 'Select' },
  { key: 'details', label: 'Details' },
  { key: 'confirmation', label: 'Confirm' },
];

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-0 px-4 py-4">
      {steps.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isComplete
                    ? 'bg-[var(--color-primary)] text-white'
                    : isCurrent
                      ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary-muted)] text-[var(--color-primary)]'
                      : 'border-2 border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
              >
                {isComplete ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-semibold ${
                  isCurrent ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`mx-3 h-0.5 w-12 rounded-full ${
                  isComplete ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
