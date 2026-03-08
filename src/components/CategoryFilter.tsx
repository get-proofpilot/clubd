"use client";

import {
  Dumbbell,
  Heart,
  Users,
  TreePine,
  UtensilsCrossed,
  Palette,
  Baby,
  Building2,
  Sparkles,
} from "lucide-react";
import { EventCategory } from "@/lib/types";

interface CategoryFilterProps {
  selectedCategory: EventCategory | "all";
  onCategoryChange: (category: EventCategory | "all") => void;
}

interface CategoryItem {
  key: EventCategory | "all";
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const categories: CategoryItem[] = [
  { key: "all", label: "All", icon: Sparkles, color: "#E8553A" },
  { key: EventCategory.Fitness, label: "Fitness", icon: Dumbbell, color: "#C44B3F" },
  { key: EventCategory.Wellness, label: "Wellness", icon: Heart, color: "#5A9E6F" },
  { key: EventCategory.Social, label: "Social", icon: Users, color: "#E8553A" },
  { key: EventCategory.Outdoor, label: "Outdoor", icon: TreePine, color: "#3478A7" },
  { key: EventCategory.FoodDrink, label: "Food & Drink", icon: UtensilsCrossed, color: "#C88B2E" },
  { key: EventCategory.Creative, label: "Creative", icon: Palette, color: "#7B5EA7" },
  { key: EventCategory.Family, label: "Family", icon: Baby, color: "#D47B8E" },
  { key: EventCategory.Community, label: "Community", icon: Building2, color: "#2E8E8E" },
];

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-2">
      {categories.map((cat, i) => {
        const isActive = selectedCategory === cat.key;
        const Icon = cat.icon;

        return (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            className={`animate-scale-in tap-target flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
              isActive
                ? "text-white"
                : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
            }`}
            style={
              isActive
                ? { "--stagger": i, backgroundColor: cat.color, boxShadow: `0 2px 12px ${cat.color}40` } as React.CSSProperties
                : { "--stagger": i, boxShadow: "var(--shadow-xs)" } as React.CSSProperties
            }
          >
            <Icon size={15} className={isActive ? "text-white" : "text-[var(--color-text-muted)]"} />
            <span className="whitespace-nowrap">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
