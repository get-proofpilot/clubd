# Clubd — Platform Planning Document

## The Problem

Finding local social events is broken. Run clubs, pilates meetups, dad walk groups, matcha & yoga sessions — these communities are exploding, but discovery is fragmented across:

- Random Instagram stories and reels
- Word of mouth from friends
- Linktree pages buried behind social profiles
- Facebook groups (dying platform for this demographic)
- Individual studio email lists that don't talk to each other

For consumers: You have to look in 20 places or get lucky. You miss events you'd love because you never heard about them.

For hosts (studios, organizers, clubs): No single platform to list events, manage signups, send reminders, and promote. They're stitching together Instagram + Linktree + Google Forms + Mailchimp + Canva. Most don't have a marketing team. Many give up on events they'd otherwise run.

---

## The "Seal Release" Problem

Real example that defines the core problem: A marine shelter in Dana Point hosted a seal release event. Someone posted about it on their Instagram story the day of. By the time you saw it, the event had already happened. You would have gone. You didn't even get the chance.

This captures three distinct failure modes in event discovery today:

1. **Too late**: You hear about events AFTER they happen, through someone's story or recap post. Discovery arrives after the window to act has closed.

2. **Too narrow**: The marine shelter probably posted about it on their own Instagram a week earlier. But unless you already followed them, you never saw it. The reach of a small org's social post is tiny compared to the number of people nearby who'd attend.

3. **No planning window**: Even when you hear about something in time, there's no system to save it, get reminded, or see if friends are going. It's a passive scroll-by moment, not an actionable discovery.

These failure modes apply to every type of community event: the run club you'd join if you knew it existed, the dad walk group three blocks from your house, the charity beach cleanup, the popup dinner. The events exist. The demand exists. The connection between them is broken.

Clubd fixes this by creating a persistent, searchable, social layer where events are discoverable BEFORE they happen, not after.

---

## The Insight

The real discovery engine for events is social proof. People don't search "pilates events near me." They see a friend went to something cool and think "I want to try that." This behavior already happens on Instagram stories, but it's passive, ephemeral, and not actionable.

Clubd makes the social graph around events the core product. Not a social network in the Instagram/Twitter sense (no feeds of content, no posts, no likes on photos). Social in the sense of: who went where, what did they think, what are they going to next, and what do we have in common.

---

## Core Users

### 1. Event-Goers (Consumers)
- 22-40 year olds, urban/suburban
- Already interested in wellness, community, socializing
- Pain: "I want to do more stuff but I never know what's happening"
- Behavior: Currently discovers events through friends' stories, word of mouth

### 2. Event Hosts (Organizers)
- Pilates studios, run club leaders, yoga instructors, community organizers, dad group founders, nonprofits (marine shelters, animal rescues, conservation groups), local farms, community gardens, art collectives, popup restaurants, local breweries
- Small teams (often 1-3 people), no dedicated marketing person
- Pain: "I want to host events but managing promotion, signups, and reminders is a mess"
- Behavior: Currently uses Instagram + a patchwork of free tools

### 3. Brands & Sponsors
- Lululemon, local coffee shops, athleisure brands, wellness products
- Want to reach the community-event audience authentically
- Pain: "We want to sponsor/partner on events but there's no scalable way to find and connect with hosts"

---

## Product Architecture

### Consumer Experience

**Discovery (the "what's happening" layer)**
- Location-based event feed (not algorithmic content feed — event cards)
- Category filters: fitness, wellness, social, outdoor, food & drink, creative, family, nightlife, community/volunteer, arts, nightlife
- "Happening this weekend" / "Happening tonight" / "New in your area" / "Coming up this month" sections
- Search by activity type, neighborhood, vibe, price range
- "Notify me" subscriptions: follow a host, category, or area and get a push notification when new events drop (solves the seal release problem — you would have known about it two weeks early)
- Event planning horizon: events show up in discovery as soon as hosts post them, not when they're imminent. Emphasis on "save for later" and advance discovery so users have time to plan

**Social Graph (the "who's going" layer)**
This is the differentiator. The social layer is built around events, not content.

- See which friends are attending or interested in an event
- "People like you also went to..." recommendations based on event overlap
- Event activity feed: "[Friend] is going to Saturday Morning Run Club" or "[Friend] went to Rooftop Yoga and rated it 4.5"
- Common events indicator: When viewing someone's profile, see overlap ("You've both been to 3 events")
- Follow people whose event taste you trust (not to see their posts — to see their event activity)
- "Going / Interested / Went" status on events (lightweight engagement, no pressure to post content)
- "Interested" is the key early signal: when 3 friends mark "interested" on the seal release two weeks out, it surfaces in your feed with social proof BEFORE the event, giving you time to plan and commit
- Post-event "wish I went" or "bookmarked for next time" action: feeds the recommendation engine and tells the host there's latent demand for future events

**Profiles (event-centric, not content-centric)**
- Your event history (public or private, your choice)
- Categories you're into (auto-generated from history, editable)
- Upcoming events
- Friends / people you follow
- No bio essays, no photo grids — your profile IS your event history
- Optional: short reviews/ratings after attending ("Great vibe, 20 people showed up, well organized")

**RSVP & Signup Flow**
- One-tap RSVP from the event card
- Integrated payment for paid events (Stripe)
- Calendar integration (add to Google Cal, Apple Cal with one tap)
- Automatic reminders: 1 week, 1 day, 2 hours before
- Post-event: prompt for rating/review, suggest similar upcoming events

### Host Experience

**Event Creation**
- Simple event builder: title, description, date/time, location (map pin), category, capacity, price (free or paid), recurring option
- Photo/cover image upload
- Co-host tagging (multiple organizers)
- Recurring event templates (every Saturday, every first Friday, etc.)
- Clone past events

**Attendee Management**
- Real-time RSVP count and attendee list
- Waitlist when capacity is hit
- Check-in tool (QR code at the door)
- Message all attendees (announcements, updates, cancellations)
- Export attendee data

**Booking Engine (built-in payment processing)**
- Integrated Stripe checkout for paid events — one-tap purchase from event card
- Clubd takes 5-8% commission on every transaction
- Tiered tickets, early bird pricing, group discounts, promo codes
- Host payout dashboard with consolidated reporting and tax docs
- Saved payment methods for repeat attendees
- Free events remain free to list — booking engine only applies to paid events

**Promotion Tools (self-serve monetization)**
- Promote event: boost visibility in the discovery feed (paid, $50-500/event)
- Share link generator (optimized for Instagram stories, texts, etc.)
- Auto-generated promotional graphics (Canva-like but dead simple, templated to the event)
- Analytics dashboard: views, RSVPs, conversion rate, attendee demographics

**Marketing Services (managed service — "agency-in-a-box")**
- Event Graphics Package ($99-199): Professional social graphics, story templates, flyers
- Ad Campaign Management ($199-499/campaign): Clubd runs Instagram/Facebook/TikTok ads for the host
- Full Marketing Retainer ($499-999/mo): Ongoing social media, email, content, and ad management
- Solves the #1 host pain: "I don't have a marketing team" — Clubd IS that team
- High-margin services revenue that deepens host retention

### Brand / Sponsor Experience

**Sponsored Events**
- Brands can sponsor existing events (co-branding, swag bags, product sampling)
- Brands can create their own branded events hosted through partner studios/organizers
- Sponsor badge on event cards ("Presented by Lululemon")
- Sponsor marketplace: organizers can browse brands looking to sponsor events in their category

**Organic Upsells**
- Contextual product offers tied to event type ("Going to Saturday Run Club? Grab the hydration kit from [Brand]" — feels like a recommendation, not an ad)
- Co-branded merchandise or bundles tied to events
- Post-event offers ("Thanks for coming to Sunset Yoga. Here's 15% off [Brand] yoga mats")
- These should feel like perks, not interruptions

**Brand Analytics**
- Impressions, engagement, redemption rates
- Audience insights (who attends events they sponsor)
- ROI tracking on sponsored events vs. organic

---

## Monetization Model (5 Revenue Engines)

### Revenue Stream 1: Promoted Events (Primary, Near-Term) — Target: 30% of revenue
Hosts and brands pay to boost event visibility. Think Google Ads but for the event discovery feed.
- Per-impression or per-click pricing
- Budget tiers (small studios spend $50, brands spend $500+)
- Self-serve ad creation in the host dashboard
- Category sponsorships and featured placements

### Revenue Stream 2: Clubd Pro — Full Booking Software (Primary, Near-Term) — Target: 25% of revenue
SaaS subscription that turns Clubd into the host's complete event booking platform. Not just analytics — the entire event operations stack.
- **Starter ($29/mo):** Recurring event templates, attendee CRM, basic analytics, co-host tools
- **Growth ($59/mo):** Advanced analytics, waitlist management, custom branding, email campaigns, QR check-in
- **Business ($99/mo):** Multi-event management, API access, white-label event pages, team seats, priority support
- Hosts consolidate Instagram + Linktree + Google Forms + Mailchimp + Canva into one platform
- The booking software is what makes Clubd sticky — once hosts run their operations through it, switching costs are high

### Revenue Stream 3: Booking Engine Commission (Primary, Near-Term) — Target: 20% of revenue
Clubd is the payment processor for paid events. Every ticket sold through the platform generates commission revenue.
- 5-8% platform fee on all paid event transactions (on top of Stripe processing fees passed to host)
- Free events remain free to list (critical for adoption and discovery flywheel)
- Integrated checkout: one-tap purchase from event card, saved payment methods
- Supports tiered tickets, early bird pricing, group discounts, promo codes
- Commission scales with platform GMV — as more paid events list on Clubd, this becomes the largest revenue engine
- Hosts get faster payouts, consolidated reporting, and tax documentation through the platform

### Revenue Stream 4: Marketing Services (Medium-Term) — Target: 15% of revenue
On-platform marketing team that hosts can hire to promote their events. Think "agency-in-a-box" built into the platform.
- **Event Graphics Package ($99-199):** Professional social media graphics, Instagram story templates, event flyers — designed by Clubd's creative team, branded to the host
- **Ad Campaign Management ($199-499/campaign):** Clubd runs paid ads (Instagram, Facebook, TikTok) on behalf of the host to drive RSVPs. Host sets budget, Clubd handles targeting, creative, and optimization
- **Full Marketing Retainer ($499-999/mo):** Ongoing social media management, email campaigns, content creation, and ad management for hosts with recurring events
- This solves the #1 host pain point: "I don't have a marketing person." Clubd becomes that team
- High-margin services revenue that also deepens host retention and proves value of the platform
- Long-term: productize the most common services into self-serve tools (AI-generated graphics, automated ad campaigns)

### Revenue Stream 5: Venue & Sponsor Partnerships (Long-Term) — Target: 10% of revenue
Matchmaking between brands, venues, and event organizers.
- Verified venue profiles with booking integrations
- Referral revenue from venues filling off-peak hours with community events ($199-999/mo for premium venue listings)
- Sponsor marketplace: brands pay to co-brand events, provide swag, or run product sampling
- Contextual product offers tied to event type (organic-feeling, not banner ads)
- Brand analytics: impressions, engagement, audience insights, ROI tracking

---

## What Makes Clubd Different from Existing Platforms

| Platform | What They Do | Where They Fall Short |
|----------|-------------|----------------------|
| Eventbrite | Ticketing and event management | Transactional. No social layer. No discovery. Nobody opens Eventbrite to browse. |
| Meetup | Group-based event discovery | Dated UX, skews older/tech. No social graph. Feels like a directory, not a community. |
| Facebook Events | Event discovery through social graph | Platform is dying for 22-35 demo. Algorithm buries events. No host tools. |
| Instagram | Where events actually get promoted today | Not built for events. Ephemeral stories disappear. No RSVP. No reminders. No management tools. |
| Partiful | Event invitations | Invite-only model. No public discovery. Great for private parties, wrong for community events. |
| Luma | Event pages and registration | Clean but no social discovery. Skews professional/tech events. |
| Apple Events (new) | Event creation on iPhone | Apple ecosystem only. No social graph. No host marketing tools. No monetization layer. |

**Clubd's wedge: Social discovery + host tools + brand marketplace, all in one platform, designed specifically for the community/wellness event boom.**

---

## Data Model (Simplified)

### Core Entities
- **User** — id, name, location, categories, friends, events_attended, events_upcoming
- **Event** — id, title, description, host_id, location, datetime, category, capacity, price, recurring, status
- **Host** — id (links to user or org), name, type (studio/individual/brand), events, followers, verified
- **RSVP** — user_id, event_id, status (going/interested/waitlisted/attended), created_at
- **Review** — user_id, event_id, rating, text, created_at
- **Friendship** — user_a, user_b, created_at
- **Promotion** — event_id, sponsor_id, budget, impressions, clicks, status
- **Sponsorship** — brand_id, event_id, type, terms, status

### Key Relationships
- Users attend Events (many-to-many through RSVP)
- Users follow Users (directed graph — not mutual by default)
- Hosts create Events (one-to-many)
- Brands sponsor Events (many-to-many through Sponsorship)
- Events belong to Categories (many-to-many)
- Events have a Location (geocoded for proximity search)

### Recommendation Engine Inputs
- Events you've attended (category, location, host, time-of-day patterns)
- Events your friends are attending
- Events attended by people with similar event histories (collaborative filtering)
- Trending events in your area (velocity of RSVPs)
- New events from hosts you follow

---

## Technical Architecture (High-Level for Prototyping)

### Frontend
- React Native (iOS + Android) or start web-first with Next.js for faster iteration
- Map integration (Mapbox or Google Maps) for location-based discovery
- Real-time updates for RSVP counts, friend activity

### Backend
- Node.js or Python (FastAPI) API
- PostgreSQL for relational data (users, events, RSVPs)
- Redis for caching (trending events, feed generation)
- Elasticsearch or Typesense for event search
- PostGIS for geospatial queries (events near me)

### Key Integrations
- Stripe for payments (paid events, promoted events)
- Google Calendar / Apple Calendar for event sync
- Push notifications (Firebase Cloud Messaging / APNs)
- Image processing for event graphics (auto-resize, templates)
- Social sharing (deep links for Instagram stories, iMessage, etc.)

### Auth
- Phone number + OTP (low friction, matches the demographic)
- Apple Sign In / Google Sign In as alternatives
- No passwords

---

## Go-to-Market Thinking

### Phase 1: Single City Launch
Pick one city (Austin, LA, Miami — wherever the community event scene is hottest).
- Manually onboard 20-30 active event hosts (run clubs, yoga studios, social clubs)
- Seed the platform with their existing events
- Consumer launch: "Every cool event in [City], one place"
- Word of mouth is the primary growth channel (event attendees invite friends)

### Phase 2: Social Loop Kicks In
- Friends see friends going to events → they sign up → they go to events → their friends see
- The viral loop is: Attend event → Show on profile → Friend discovers → Friend attends → Repeat
- Cross-pollination: Someone in a run club sees a friend went to a ceramics night → tries it

### Phase 3: Host Tools Become Sticky
- Hosts realize Clubd gives them better reach than Instagram alone
- Attendee management saves them hours
- They stop using Google Forms + Mailchimp and consolidate into Clubd
- Hosts become evangelists because their events fill up faster

### Phase 4: Brand Marketplace
- Once there's a critical mass of events and attendees, brands want in
- Start with local sponsors (coffee shops, boutiques near event venues)
- Scale to national brands (Lululemon, Alo Yoga, Allbirds) as platform grows

---

## MVP Feature Set (What to Build First)

### Must Have (V1)
1. User signup/login (phone + OTP)
2. Event discovery feed (location-based, category filters)
3. Event detail page (description, time, location, host info, attendee count)
4. RSVP (free events only for V1)
5. Friend connections (find by contacts, add/follow)
6. "Friends going" indicator on event cards
7. User profile with event history
8. Host event creation (simple form)
9. Host attendee list
10. Push notification reminders (1 day before, 2 hours before)

### Nice to Have (V1.5)
- Paid events with Stripe integration (booking engine foundation)
- Calendar sync
- Event search
- Post-event reviews/ratings
- Share to Instagram stories (deep link with event card image)
- "Interested" button (lighter than RSVP)

### V2 — Booking Engine & Clubd Pro
- **Booking engine:** Full payment processing for paid events with 5-8% commission
- Tiered ticketing, early bird pricing, group discounts, promo codes
- Host payout dashboard with consolidated reporting
- **Clubd Pro Starter ($29/mo):** Recurring event templates, attendee CRM, basic analytics
- **Clubd Pro Growth ($59/mo):** Advanced analytics, waitlist management, custom branding, email campaigns
- **Clubd Pro Business ($99/mo):** Multi-event management, API access, white-label pages, team seats
- QR check-in tool
- Waitlist when capacity is hit
- Host attendee export

### V3 — Marketing Services & Promoted Events
- **Promoted events:** Self-serve ad creation, per-impression/per-click pricing
- **Event Graphics Package ($99-199):** Professional graphics designed by Clubd creative team
- **Ad Campaign Management ($199-499):** Clubd runs paid ads on behalf of hosts
- **Full Marketing Retainer ($499-999/mo):** Ongoing social, email, content, and ad management
- AI-generated event graphics (productized from services learnings)
- Automated ad campaign templates

### V4 — Sponsor Marketplace & Scale
- Sponsor marketplace: brands browse and sponsor events
- Contextual product offers tied to events
- Brand analytics dashboard
- Venue partnership program
- Recommendation engine
- Multi-city expansion toolkit

---

## Key Metrics to Track

**Consumer Health**
- MAU / WAU (monthly/weekly active users)
- Events discovered per session
- RSVPs per user per month
- Friend connections per user
- Retention: % of users who RSVP to a second event within 30 days

**Host Health**
- Events created per host per month
- Average RSVPs per event
- Host retention (% creating events month over month)
- Time from signup to first event created

**Marketplace Health**
- Promoted event spend per host
- Sponsor deals brokered
- Revenue per event

**Social Graph Health**
- Average friend count per user
- % of RSVPs influenced by friend activity (saw friend going before RSVP)
- Cross-category discovery rate (attended event in new category via friend)

---

## Risks and Open Questions

1. **Cold start problem**: Events need attendees, attendees need events. City-by-city launch with manual host onboarding is the answer, but it's slow.

2. **Host adoption friction**: Studios already have their workflow. Clubd needs to be 10x easier, not just marginally better. The pitch is "more attendees" not "better tools."

3. **Social graph density**: The social layer only works if your friends are on it. Early on, the discovery feed has to carry the experience until the social graph fills in.

4. **Competing with Instagram**: Hosts will still promote on Instagram. Clubd needs to be the RSVP/management layer that Instagram links TO, not a replacement for Instagram promotion.

5. **Monetization timing**: Charging too early kills growth. Free for hosts in V1 is essential. Monetization kicks in once hosts are seeing real value (more attendees than they'd get alone).

6. **Content moderation**: Events could range from wholesome run clubs to events Clubd doesn't want to be associated with. Need clear guidelines and review process.

7. **Apple Events overlap**: Apple just launched event features. This validates the category but could become a competitive threat if Apple builds social discovery. Clubd's advantage is platform-agnostic and deeper host/brand tools.

8. **Category breadth vs. focus**: The seal release example shows demand goes far beyond fitness/wellness (nonprofits, nature, community service, arts, food). Broader category coverage means larger TAM but harder to market with a clear identity. Consider launching with a broad platform but marketing through specific verticals (wellness in one city, community/outdoors in another) to test which categories drive the most organic growth.

---

## Summary

Clubd is a social event discovery platform where the social graph around events IS the product. Consumers find events through friends and similar attendees, not search. Hosts get an all-in-one tool to create, promote, and manage events. Brands get authentic access to community-driven audiences.

The wedge is community/wellness events (run clubs, yoga, social meetups). The moat is the social graph and host tooling. The business model has five engines: promoted events (30%), Clubd Pro booking software (25%), booking engine commission on paid events (20%), managed marketing services (15%), and venue/sponsor partnerships (10%).

Build the MVP around discovery + RSVP + friend activity. Launch in one city. Let the social loop drive growth. Layer monetization once the flywheel is spinning.
