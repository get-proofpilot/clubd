import { Event, EventCategory } from './types';

/**
 * Format an ISO date string to "Sat, Mar 14" style.
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Format a time string for display (pass-through for already formatted strings).
 */
export function formatTime(time: string): string {
  return time;
}

/**
 * Determine which time section an event falls into relative to today.
 */
export function getTimeSection(
  date: string,
): 'tonight' | 'this-weekend' | 'this-week' | 'this-month' | 'later' {
  const now = new Date();
  const eventDate = new Date(date);

  // Strip time for day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
  );

  const diffMs = eventDay.getTime() - today.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Tonight: same day
  if (diffDays === 0) {
    return 'tonight';
  }

  // This weekend: upcoming Saturday or Sunday within the current week
  const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  const daysUntilSunday = daysUntilSaturday + 1;

  if (diffDays > 0 && diffDays <= daysUntilSunday) {
    const eventDayOfWeek = eventDay.getDay();
    if (eventDayOfWeek === 0 || eventDayOfWeek === 6) {
      return 'this-weekend';
    }
  }

  // This week: within the next 7 days
  if (diffDays > 0 && diffDays <= 7) {
    return 'this-week';
  }

  // This month: within the next 30 days
  if (diffDays > 7 && diffDays <= 30) {
    return 'this-month';
  }

  return 'later';
}

/**
 * Human-readable label for a category.
 */
export function getCategoryLabel(category: EventCategory): string {
  const labels: Record<EventCategory, string> = {
    [EventCategory.Fitness]: 'Fitness',
    [EventCategory.Wellness]: 'Wellness',
    [EventCategory.Social]: 'Social',
    [EventCategory.Outdoor]: 'Outdoor',
    [EventCategory.FoodDrink]: 'Food & Drink',
    [EventCategory.Creative]: 'Creative',
    [EventCategory.Family]: 'Family',
    [EventCategory.Community]: 'Community',
  };
  return labels[category];
}

/**
 * Tailwind color class for each category.
 */
export function getCategoryColor(category: EventCategory): string {
  const colors: Record<EventCategory, string> = {
    [EventCategory.Fitness]: 'badge-fitness',
    [EventCategory.Wellness]: 'badge-wellness',
    [EventCategory.Social]: 'badge-social',
    [EventCategory.Outdoor]: 'badge-outdoor',
    [EventCategory.FoodDrink]: 'badge-food-drink',
    [EventCategory.Creative]: 'badge-creative',
    [EventCategory.Family]: 'badge-family',
    [EventCategory.Community]: 'badge-community',
  };
  return colors[category];
}

/**
 * Lucide icon name for each category.
 */
export function getCategoryIcon(category: EventCategory): string {
  const icons: Record<EventCategory, string> = {
    [EventCategory.Fitness]: 'dumbbell',
    [EventCategory.Wellness]: 'heart',
    [EventCategory.Social]: 'users',
    [EventCategory.Outdoor]: 'mountain',
    [EventCategory.FoodDrink]: 'utensils',
    [EventCategory.Creative]: 'palette',
    [EventCategory.Family]: 'baby',
    [EventCategory.Community]: 'hand-helping',
  };
  return icons[category];
}

/**
 * Filter events by category.
 */
export function getEventsByCategory(
  events: Event[],
  category: EventCategory,
): Event[] {
  return events.filter((e) => e.category === category);
}

/**
 * Filter events by time section.
 */
export function getEventsByTimeSection(
  events: Event[],
  section: 'tonight' | 'this-weekend' | 'this-week' | 'this-month' | 'later',
): Event[] {
  return events.filter((e) => getTimeSection(e.date) === section);
}

/**
 * Return all events with a date >= today, sorted chronologically.
 */
export function getUpcomingEvents(events: Event[]): Event[] {
  const now = new Date();
  return events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
