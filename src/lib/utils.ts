import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const categoryLabels: Record<string, string> = {
  fitness: "Fitness",
  wellness: "Wellness",
  social: "Social",
  outdoor: "Outdoor",
  food_drink: "Food & Drink",
  creative: "Creative",
  family: "Family",
  community: "Community",
};

const categoryColors: Record<string, string> = {
  fitness: "bg-red-100 text-red-800",
  wellness: "bg-purple-100 text-purple-800",
  social: "bg-blue-100 text-blue-800",
  outdoor: "bg-green-100 text-green-800",
  food_drink: "bg-orange-100 text-orange-800",
  creative: "bg-pink-100 text-pink-800",
  family: "bg-yellow-100 text-yellow-800",
  community: "bg-teal-100 text-teal-800",
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category;
}

export function getCategoryColor(category: string): string {
  return categoryColors[category] || "bg-gray-100 text-gray-800";
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEventsByCategory(events: any[], category: string): any[] {
  return events.filter((e) => e.category === category);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEventsByTimeSection(events: any[], section: string): any[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events.filter((e) => {
    const dateStr = e.startsAt ?? e.date;
    if (!dateStr) return false;
    const eventDate = typeof dateStr === "string" ? new Date(dateStr) : dateStr as Date;

    switch (section) {
      case "tonight": {
        const endOfDay = new Date(today);
        endOfDay.setDate(endOfDay.getDate() + 1);
        return eventDate >= now && eventDate < endOfDay;
      }
      case "this-weekend": {
        const dayOfWeek = now.getDay();
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + (6 - dayOfWeek));
        const monday = new Date(saturday);
        monday.setDate(saturday.getDate() + 2);
        return eventDate >= saturday && eventDate < monday;
      }
      case "this-month": {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return eventDate >= now && eventDate <= endOfMonth;
      }
      default:
        return true;
    }
  });
}
