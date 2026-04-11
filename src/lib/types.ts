export enum EventCategory {
  Fitness = 'fitness',
  Wellness = 'wellness',
  Social = 'social',
  Outdoor = 'outdoor',
  FoodDrink = 'food-drink',
  Creative = 'creative',
  Family = 'family',
  Community = 'community',
}

export type HostType = 'studio' | 'individual' | 'organization';

export interface Host {
  id: string;
  name: string;
  avatar: string;
  type: HostType;
  verified: boolean;
  followerCount: number;
  eventCount: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  eventsAttended: number;
  following: boolean;
}

export interface EventLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export type PricingType = 'free' | 'free_with_upsell' | 'paid';

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  priceInCents: number;
  originalPriceInCents?: number;
  capacity?: number;
  soldCount: number;
  sortOrder: number;
  isPopular: boolean;
  perks: string[];
  salesStartAt?: string;
  salesEndAt?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: EventLocation;
  category: EventCategory;
  capacity: number;
  attendeeCount: number;
  interestedCount: number;
  coverImage: string;
  host: Host;
  pricingType: PricingType;
  serviceFeePercent?: number;
  ticketTiers?: TicketTier[];
  isRecurring: boolean;
  friendsGoing: User[];
  friendsInterested: User[];
}

export type RSVPStatus = 'going' | 'interested' | 'attended' | 'cancelled';

export interface RSVP {
  userId: string;
  eventId: string;
  status: RSVPStatus;
}

export interface OrderItem {
  id: string;
  ticketTierId: string;
  tierName: string;
  quantity: number;
  unitPriceInCents: number;
}

export interface OrderSummary {
  id: string;
  eventId: string;
  items: OrderItem[];
  subtotalInCents: number;
  serviceFeeInCents: number;
  discountInCents: number;
  totalInCents: number;
  status: 'pending' | 'completed' | 'refunded' | 'cancelled';
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  tierName?: string;
  qrCodeHash: string;
  status: 'active' | 'used' | 'cancelled' | 'transferred';
  checkedInAt?: string;
  createdAt: string;
}

export interface PromoCodeValidation {
  valid: boolean;
  code: string;
  discountType?: 'percentage' | 'fixed_amount';
  discountValue?: number;
  message?: string;
}

export type CheckoutStep = 'selection' | 'details' | 'confirmation';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  eventId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Activity Feed
// ---------------------------------------------------------------------------

export type ActivityType =
  | 'rsvp'
  | 'attended'
  | 'review'
  | 'milestone'
  | 'group_rsvp'
  | 'followed_host';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  user: User;
  users?: User[];
  eventId?: string;
  review?: Review;
  host?: Host;
  milestone?: { count: number; label: string; icon: string };
  timestamp: string;
  kudosCount: number;
  commentCount: number;
}
