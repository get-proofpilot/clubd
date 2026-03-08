import {
  ActivityItem,
  Event,
  EventCategory,
  Host,
  RSVP,
  Review,
  User,
} from './types';

// ---------------------------------------------------------------------------
// Helpers – relative dates anchored to "today" so the demo always looks fresh
// ---------------------------------------------------------------------------

function daysFromNow(days: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Users (friends)
// ---------------------------------------------------------------------------

export const users: User[] = [
  {
    id: 'u1',
    name: 'Jordan Rivera',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    eventsAttended: 14,
    following: true,
  },
  {
    id: 'u2',
    name: 'Maya Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    eventsAttended: 22,
    following: true,
  },
  {
    id: 'u3',
    name: 'Carlos Gutierrez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    eventsAttended: 9,
    following: true,
  },
  {
    id: 'u4',
    name: 'Priya Nair',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    eventsAttended: 31,
    following: false,
  },
  {
    id: 'u5',
    name: 'Tyler Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tyler',
    eventsAttended: 7,
    following: true,
  },
  {
    id: 'u6',
    name: 'Sophie Tran',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    eventsAttended: 18,
    following: true,
  },
  {
    id: 'u7',
    name: 'Marcus Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    eventsAttended: 5,
    following: false,
  },
  {
    id: 'u8',
    name: 'Elena Ruiz',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    eventsAttended: 12,
    following: true,
  },
];

// ---------------------------------------------------------------------------
// Hosts
// ---------------------------------------------------------------------------

export const hosts: Host[] = [
  {
    id: 'h1',
    name: 'OC Run Collective',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=OCRun',
    type: 'organization',
    verified: true,
    followerCount: 2340,
    eventCount: 87,
  },
  {
    id: 'h2',
    name: 'Soulful Movement Studio',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Soulful',
    type: 'studio',
    verified: true,
    followerCount: 1870,
    eventCount: 142,
  },
  {
    id: 'h3',
    name: 'SoCal Dad Squad',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=DadSquad',
    type: 'organization',
    verified: false,
    followerCount: 560,
    eventCount: 23,
  },
  {
    id: 'h4',
    name: 'Zen Den Laguna',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=ZenDen',
    type: 'studio',
    verified: true,
    followerCount: 920,
    eventCount: 64,
  },
  {
    id: 'h5',
    name: 'OC Coastkeepers',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Coastkeepers',
    type: 'organization',
    verified: true,
    followerCount: 4210,
    eventCount: 156,
  },
  {
    id: 'h6',
    name: 'Noodle Lab',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=NoodleLab',
    type: 'individual',
    verified: false,
    followerCount: 1130,
    eventCount: 18,
  },
  {
    id: 'h7',
    name: 'Clay + Co Studio',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=ClayCo',
    type: 'studio',
    verified: true,
    followerCount: 780,
    eventCount: 52,
  },
  {
    id: 'h8',
    name: 'Trail Tribe OC',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=TrailTribe',
    type: 'organization',
    verified: false,
    followerCount: 1560,
    eventCount: 39,
  },
  {
    id: 'h9',
    name: 'Ritmo Collective',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Ritmo',
    type: 'organization',
    verified: true,
    followerCount: 3100,
    eventCount: 74,
  },
  {
    id: 'h10',
    name: 'Swallows Farm',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=SwallowsFarm',
    type: 'organization',
    verified: true,
    followerCount: 690,
    eventCount: 31,
  },
  {
    id: 'h11',
    name: 'Dawn Patrol Crew',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=DawnPatrol',
    type: 'individual',
    verified: false,
    followerCount: 410,
    eventCount: 15,
  },
  {
    id: 'h12',
    name: 'The LAB Anti-Mall',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=TheLAB',
    type: 'organization',
    verified: true,
    followerCount: 5200,
    eventCount: 210,
  },
  {
    id: 'h13',
    name: 'Pacific Marine Mammal Center',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=PMMC',
    type: 'organization',
    verified: true,
    followerCount: 8900,
    eventCount: 48,
  },
];

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export const events: Event[] = [
  // -- TODAY (tonight) --
  {
    id: 'e1',
    title: 'Popup Ramen Night',
    description:
      'Chef Taka brings his legendary tonkotsu to the 4th Street Market courtyard for one night only. Vegan and gluten-free options available. First come, first served.',
    date: daysFromNow(0, 19, 0),
    time: '7:00 PM',
    location: {
      name: '4th Street Market',
      address: '201 E 4th St, Santa Ana, CA 92701',
      lat: 33.7477,
      lng: -117.8678,
    },
    category: EventCategory.FoodDrink,
    capacity: 40,
    attendeeCount: 34,
    interestedCount: 52,
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    host: hosts[5],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[1], users[5]],
    friendsInterested: [users[2]],
  },
  {
    id: 'e2',
    title: 'Rooftop Salsa Social',
    description:
      'Beginner lesson at 7, open dancing 8-11. No partner needed. Stunning skyline views from the DTLA rooftop. Water and light snacks provided.',
    date: daysFromNow(0, 19, 30),
    time: '7:30 PM',
    location: {
      name: 'Perch Rooftop',
      address: '448 S Hill St, Los Angeles, CA 90013',
      lat: 34.0488,
      lng: -118.2538,
    },
    category: EventCategory.Social,
    capacity: 80,
    attendeeCount: 61,
    interestedCount: 95,
    coverImage: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80',
    host: hosts[8],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[3], users[7]],
    friendsInterested: [users[0], users[4]],
  },

  // -- THIS WEEKEND (Saturday) --
  {
    id: 'e3',
    title: 'Saturday Morning Run Club',
    description:
      'Join us for a 5K through the Back Bay trail. All paces welcome. We regroup every mile. Coffee meetup after at Kean Coffee.',
    date: daysFromNow(
      (() => {
        const today = new Date().getDay();
        return today <= 6 ? (6 - today) || 7 : 1;
      })(),
      7,
      0,
    ),
    time: '7:00 AM',
    location: {
      name: 'Upper Newport Bay Nature Preserve',
      address: '2301 University Dr, Costa Mesa, CA 92627',
      lat: 33.6381,
      lng: -117.8856,
    },
    category: EventCategory.Fitness,
    capacity: 45,
    attendeeCount: 32,
    interestedCount: 18,
    coverImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    host: hosts[0],
    isFree: true,
    isRecurring: true,
    friendsGoing: [users[0], users[2], users[5]],
    friendsInterested: [users[4]],
  },
  {
    id: 'e4',
    title: 'Sunset Yoga at the Bluffs',
    description:
      'Vinyasa flow overlooking the Pacific as the sun dips below the horizon. Bring your own mat. Suitable for all levels. Arrive 15 minutes early to find your spot.',
    date: daysFromNow(
      (() => {
        const today = new Date().getDay();
        return today <= 6 ? (6 - today) || 7 : 1;
      })(),
      17,
      30,
    ),
    time: '5:30 PM',
    location: {
      name: 'Dana Point Headlands',
      address: '34551 Verde Dr, Dana Point, CA 92629',
      lat: 33.4594,
      lng: -117.7123,
    },
    category: EventCategory.Wellness,
    capacity: 30,
    attendeeCount: 28,
    interestedCount: 41,
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    host: hosts[1],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[1], users[7]],
    friendsInterested: [users[3]],
  },

  // -- THIS WEEKEND (Sunday) --
  {
    id: 'e5',
    title: 'Family Farm Day',
    description:
      'Spend a Sunday morning at the historic farm. Kids can feed animals, pick seasonal vegetables, and enjoy live bluegrass. Perfect for the whole family.',
    date: daysFromNow(
      (() => {
        const today = new Date().getDay();
        return today === 0 ? 7 : 7 - today;
      })(),
      10,
      0,
    ),
    time: '10:00 AM',
    location: {
      name: "Zoomars at the Old Mission",
      address: '31791 Los Rios St, San Juan Capistrano, CA 92675',
      lat: 33.5017,
      lng: -117.6625,
    },
    category: EventCategory.Family,
    capacity: 50,
    attendeeCount: 37,
    interestedCount: 24,
    coverImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
    host: hosts[9],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[2]],
    friendsInterested: [users[6], users[7]],
  },

  // -- THIS WEEK --
  {
    id: 'e6',
    title: 'Dad Walk Group - Irvine',
    description:
      'A weekly stroller-friendly walk for dads around Irvine Great Park. Casual, low-key, and a great way to connect with other dads in the area. Dogs welcome.',
    date: daysFromNow(3, 9, 0),
    time: '9:00 AM',
    location: {
      name: 'Irvine Great Park',
      address: '8000 Great Park Blvd, Irvine, CA 92618',
      lat: 33.6694,
      lng: -117.7622,
    },
    category: EventCategory.Social,
    capacity: 20,
    attendeeCount: 11,
    interestedCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80',
    host: hosts[2],
    isFree: true,
    isRecurring: true,
    friendsGoing: [users[4]],
    friendsInterested: [users[0]],
  },
  {
    id: 'e7',
    title: 'Matcha & Meditation',
    description:
      'Start your morning with a 30-minute guided meditation followed by a ceremonial-grade matcha tasting. Limited spots for an intimate experience.',
    date: daysFromNow(4, 8, 0),
    time: '8:00 AM',
    location: {
      name: 'Zen Den Laguna',
      address: '320 N Coast Hwy, Laguna Beach, CA 92651',
      lat: 33.5453,
      lng: -117.7834,
    },
    category: EventCategory.Wellness,
    capacity: 15,
    attendeeCount: 13,
    interestedCount: 19,
    coverImage: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800&q=80',
    host: hosts[3],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[1]],
    friendsInterested: [users[5], users[7]],
  },
  {
    id: 'e8',
    title: 'Open Mic Night',
    description:
      'Poets, musicians, comedians, storytellers welcome. Sign up starts at 6:30, performances at 7. Supportive crowd, good vibes, great acoustics in the outdoor courtyard.',
    date: daysFromNow(5, 19, 0),
    time: '7:00 PM',
    location: {
      name: 'The LAB Anti-Mall',
      address: '2930 Bristol St, Costa Mesa, CA 92626',
      lat: 33.6832,
      lng: -117.8853,
    },
    category: EventCategory.Creative,
    capacity: 60,
    attendeeCount: 42,
    interestedCount: 35,
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    host: hosts[11],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[3], users[6]],
    friendsInterested: [users[1]],
  },

  // -- THIS MONTH --
  {
    id: 'e9',
    title: 'Beach Cleanup Volunteer Day',
    description:
      'Help keep our coastline beautiful. Gloves and bags provided. Volunteers get a free smoothie from Nekter after. Great for community service hours.',
    date: daysFromNow(10, 8, 0),
    time: '8:00 AM',
    location: {
      name: 'Huntington Beach Pier',
      address: '1 Main St, Huntington Beach, CA 92648',
      lat: 33.6553,
      lng: -117.9988,
    },
    category: EventCategory.Community,
    capacity: 100,
    attendeeCount: 67,
    interestedCount: 88,
    coverImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80',
    host: hosts[4],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[0], users[5], users[7]],
    friendsInterested: [users[2], users[4]],
  },
  {
    id: 'e10',
    title: 'Ceramics Night Out',
    description:
      'Throw your own bowl on the wheel with step-by-step guidance. No experience needed. Pieces are kiln-fired and ready for pickup the following week. BYOB.',
    date: daysFromNow(14, 19, 0),
    time: '7:00 PM',
    location: {
      name: 'Clay + Co Studio',
      address: '456 E 4th St, Long Beach, CA 90802',
      lat: 33.7701,
      lng: -118.1872,
    },
    category: EventCategory.Creative,
    capacity: 12,
    attendeeCount: 10,
    interestedCount: 27,
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    host: hosts[6],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[1], users[5]],
    friendsInterested: [users[3]],
  },
  {
    id: 'e11',
    title: 'Full Moon Hike',
    description:
      'A moderate 4-mile loop through Aliso & Wood Canyons under the full moon. Headlamps recommended but not required. Meet at the trailhead parking lot.',
    date: daysFromNow(16, 19, 30),
    time: '7:30 PM',
    location: {
      name: 'Aliso & Wood Canyons Wilderness Park',
      address: '28373 Alicia Pkwy, Laguna Niguel, CA 92677',
      lat: 33.5308,
      lng: -117.7253,
    },
    category: EventCategory.Outdoor,
    capacity: 25,
    attendeeCount: 22,
    interestedCount: 31,
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    host: hosts[7],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[0], users[4]],
    friendsInterested: [users[2], users[6]],
  },
  {
    id: 'e12',
    title: 'Morning Surf + Coffee',
    description:
      'Dawn session at T-Street followed by pour-over coffee on the bluff. All skill levels welcome. Boards available to borrow if you DM ahead.',
    date: daysFromNow(9, 6, 0),
    time: '6:00 AM',
    location: {
      name: 'T-Street Beach',
      address: 'T St, San Clemente, CA 92672',
      lat: 33.4228,
      lng: -117.6227,
    },
    category: EventCategory.Outdoor,
    capacity: 15,
    attendeeCount: 9,
    interestedCount: 14,
    coverImage: 'https://images.unsplash.com/photo-1502680390548-bdbac40ae4e7?w=800&q=80',
    host: hosts[10],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[2]],
    friendsInterested: [users[0], users[5]],
  },
  {
    id: 'e13',
    title: 'Seal Release Watch Party',
    description:
      'Watch rehabilitated seals and sea lions return to the ocean. The Pacific Marine Mammal Center releases recovered animals back into the wild. Educational talks, family-friendly, and one of the most heartwarming things you can see in OC.',
    date: daysFromNow(18, 10, 0),
    time: '10:00 AM',
    location: {
      name: 'Pacific Marine Mammal Center',
      address: '20612 Laguna Canyon Rd, Laguna Beach, CA 92651',
      lat: 33.5322,
      lng: -117.7643,
    },
    category: EventCategory.Community,
    capacity: 200,
    attendeeCount: 143,
    interestedCount: 312,
    coverImage: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=800&q=80',
    host: hosts[12],
    isFree: true,
    isRecurring: false,
    friendsGoing: [users[0], users[1], users[5], users[7]],
    friendsInterested: [users[2], users[3], users[4]],
  },
];

// ---------------------------------------------------------------------------
// Current User
// ---------------------------------------------------------------------------

export const currentUser: User = {
  id: 'current-user',
  name: 'Alex Rivera',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  eventsAttended: 12,
  following: false,
};

// ---------------------------------------------------------------------------
// RSVPs
// ---------------------------------------------------------------------------

export const rsvps: RSVP[] = [
  // Current user RSVPs (could represent the logged-in user)
  { userId: 'current-user', eventId: 'e3', status: 'going' },
  { userId: 'current-user', eventId: 'e13', status: 'interested' },
  { userId: 'current-user', eventId: 'e9', status: 'going' },

  // Friend RSVPs
  { userId: 'u1', eventId: 'e3', status: 'going' },
  { userId: 'u1', eventId: 'e9', status: 'going' },
  { userId: 'u1', eventId: 'e11', status: 'going' },
  { userId: 'u1', eventId: 'e13', status: 'going' },
  { userId: 'u2', eventId: 'e1', status: 'going' },
  { userId: 'u2', eventId: 'e4', status: 'going' },
  { userId: 'u2', eventId: 'e7', status: 'going' },
  { userId: 'u2', eventId: 'e10', status: 'going' },
  { userId: 'u2', eventId: 'e13', status: 'going' },
  { userId: 'u3', eventId: 'e1', status: 'interested' },
  { userId: 'u3', eventId: 'e3', status: 'going' },
  { userId: 'u3', eventId: 'e5', status: 'going' },
  { userId: 'u3', eventId: 'e12', status: 'going' },
  { userId: 'u4', eventId: 'e2', status: 'going' },
  { userId: 'u4', eventId: 'e4', status: 'interested' },
  { userId: 'u4', eventId: 'e8', status: 'going' },
  { userId: 'u5', eventId: 'e3', status: 'interested' },
  { userId: 'u5', eventId: 'e6', status: 'going' },
  { userId: 'u5', eventId: 'e11', status: 'going' },
  { userId: 'u6', eventId: 'e1', status: 'going' },
  { userId: 'u6', eventId: 'e3', status: 'going' },
  { userId: 'u6', eventId: 'e9', status: 'going' },
  { userId: 'u6', eventId: 'e10', status: 'going' },
  { userId: 'u6', eventId: 'e13', status: 'going' },
  { userId: 'u7', eventId: 'e5', status: 'interested' },
  { userId: 'u7', eventId: 'e8', status: 'going' },
  { userId: 'u8', eventId: 'e2', status: 'going' },
  { userId: 'u8', eventId: 'e4', status: 'going' },
  { userId: 'u8', eventId: 'e9', status: 'going' },
  { userId: 'u8', eventId: 'e13', status: 'going' },
];

// ---------------------------------------------------------------------------
// Reviews (for past/recurring events)
// ---------------------------------------------------------------------------

export const reviews: Review[] = [
  {
    id: 'r1',
    userId: 'u2',
    userName: 'Maya Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    eventId: 'e3',
    rating: 5,
    text: 'Best run club in OC. Super inclusive pace groups, and the coffee after is such a nice touch. I look forward to this every Saturday.',
    createdAt: daysAgo(7),
  },
  {
    id: 'r2',
    userId: 'u1',
    userName: 'Jordan Rivera',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    eventId: 'e4',
    rating: 5,
    text: 'Watching the sunset while doing yoga on the bluffs was genuinely magical. The instructor was calm and encouraging. Will definitely come back.',
    createdAt: daysAgo(14),
  },
  {
    id: 'r3',
    userId: 'u5',
    userName: 'Tyler Kim',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tyler',
    eventId: 'e6',
    rating: 4,
    text: 'Great group of dads. My toddler loved it. Only reason for 4 stars is parking was a bit tricky, but the walk itself was perfect.',
    createdAt: daysAgo(3),
  },
  {
    id: 'r4',
    userId: 'u6',
    userName: 'Sophie Tran',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    eventId: 'e1',
    rating: 5,
    text: 'The tonkotsu was absolutely ridiculous. Rich, creamy, perfect noodles. I cannot believe this was free. Chef Taka is a legend.',
    createdAt: daysAgo(21),
  },
  {
    id: 'r5',
    userId: 'u8',
    userName: 'Elena Ruiz',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    eventId: 'e13',
    rating: 5,
    text: 'We watched three seals waddle back into the ocean. My kids were screaming with joy. Truly one of the best things to do in Laguna.',
    createdAt: daysAgo(60),
  },
  {
    id: 'r6',
    userId: 'u3',
    userName: 'Carlos Gutierrez',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    eventId: 'e9',
    rating: 4,
    text: 'Feels good to give back. Well organized, and the free smoothie after was a nice bonus. Brought my kids and they picked up trash like it was a game.',
    createdAt: daysAgo(30),
  },
  {
    id: 'r7',
    userId: 'current-user',
    userName: 'Alex Rivera',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    eventId: 'e3',
    rating: 5,
    text: 'My favorite weekend ritual. The trail is gorgeous and the group is so welcoming. Coffee after is always a highlight.',
    createdAt: daysAgo(5),
  },
  {
    id: 'r8',
    userId: 'current-user',
    userName: 'Alex Rivera',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    eventId: 'e9',
    rating: 4,
    text: 'Really well organized cleanup. Made a real difference on the beach and met some great people doing it.',
    createdAt: daysAgo(25),
  },
];

// ---------------------------------------------------------------------------
// Helper: hours ago
// ---------------------------------------------------------------------------

function hoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Activity Feed
// ---------------------------------------------------------------------------

export const activities: ActivityItem[] = [
  // Group RSVP — social proof
  {
    id: 'act-1',
    type: 'group_rsvp',
    user: users[0],
    users: [users[0], users[2], users[5]],
    eventId: 'e3',
    timestamp: hoursAgo(1),
    kudosCount: 8,
    commentCount: 2,
  },
  // Review
  {
    id: 'act-2',
    type: 'review',
    user: users[1],
    eventId: 'e3',
    review: reviews[0],
    timestamp: hoursAgo(3),
    kudosCount: 14,
    commentCount: 3,
  },
  // RSVP
  {
    id: 'act-3',
    type: 'rsvp',
    user: users[3],
    eventId: 'e2',
    timestamp: hoursAgo(4),
    kudosCount: 3,
    commentCount: 0,
  },
  // Milestone
  {
    id: 'act-4',
    type: 'milestone',
    user: users[1],
    milestone: { count: 20, label: 'events attended', icon: '🏆' },
    timestamp: hoursAgo(6),
    kudosCount: 22,
    commentCount: 5,
  },
  // Attended
  {
    id: 'act-5',
    type: 'attended',
    user: users[5],
    eventId: 'e1',
    timestamp: hoursAgo(8),
    kudosCount: 6,
    commentCount: 1,
  },
  // Review
  {
    id: 'act-6',
    type: 'review',
    user: users[4],
    eventId: 'e6',
    review: reviews[2],
    timestamp: hoursAgo(12),
    kudosCount: 9,
    commentCount: 2,
  },
  // Followed host
  {
    id: 'act-7',
    type: 'followed_host',
    user: users[7],
    host: hosts[4],
    timestamp: hoursAgo(14),
    kudosCount: 2,
    commentCount: 0,
  },
  // RSVP
  {
    id: 'act-8',
    type: 'rsvp',
    user: users[4],
    eventId: 'e11',
    timestamp: hoursAgo(18),
    kudosCount: 5,
    commentCount: 1,
  },
  // Attended
  {
    id: 'act-9',
    type: 'attended',
    user: users[2],
    eventId: 'e5',
    timestamp: hoursAgo(22),
    kudosCount: 11,
    commentCount: 3,
  },
  // Group RSVP
  {
    id: 'act-10',
    type: 'group_rsvp',
    user: users[0],
    users: [users[0], users[1], users[5], users[7]],
    eventId: 'e13',
    timestamp: hoursAgo(26),
    kudosCount: 17,
    commentCount: 4,
  },
  // Review
  {
    id: 'act-11',
    type: 'review',
    user: users[5],
    eventId: 'e1',
    review: reviews[3],
    timestamp: hoursAgo(30),
    kudosCount: 19,
    commentCount: 6,
  },
  // Milestone
  {
    id: 'act-12',
    type: 'milestone',
    user: users[3],
    milestone: { count: 30, label: 'events attended', icon: '👑' },
    timestamp: hoursAgo(36),
    kudosCount: 31,
    commentCount: 8,
  },
  // RSVP
  {
    id: 'act-13',
    type: 'rsvp',
    user: users[6],
    eventId: 'e8',
    timestamp: hoursAgo(40),
    kudosCount: 4,
    commentCount: 0,
  },
  // Review
  {
    id: 'act-14',
    type: 'review',
    user: users[7],
    eventId: 'e13',
    review: reviews[4],
    timestamp: hoursAgo(48),
    kudosCount: 24,
    commentCount: 7,
  },
  // Attended
  {
    id: 'act-15',
    type: 'attended',
    user: users[0],
    eventId: 'e9',
    timestamp: hoursAgo(52),
    kudosCount: 7,
    commentCount: 2,
  },
  // Followed host
  {
    id: 'act-16',
    type: 'followed_host',
    user: users[2],
    host: hosts[0],
    timestamp: hoursAgo(60),
    kudosCount: 3,
    commentCount: 0,
  },
  // Milestone — streak
  {
    id: 'act-17',
    type: 'milestone',
    user: users[5],
    milestone: { count: 4, label: 'week streak', icon: '🔥' },
    timestamp: hoursAgo(72),
    kudosCount: 15,
    commentCount: 3,
  },
];
