---
phase: "02"
plan: "02"
title: "Wire Create Event and Host Dashboard to tRPC Backend"
subsystem: host-frontend
tags: [host, events, trpc, dashboard, create-event, auth-guard]
dependency-graph:
  requires: ["02-01"]
  provides: ["host-dashboard", "create-event-flow", "host-auth-guards"]
  affects: ["host-create-page", "homepage-footer-links", "host-create-layout"]
tech-stack:
  added: []
  patterns: ["trpcReact.useMutation for form submission", "trpcReact.useQuery for data fetching", "authClient.useSession for auth guards", "trpcReact.useUtils for cache invalidation"]
key-files:
  created:
    - src/app/host/dashboard/page.tsx
    - src/app/host/dashboard/layout.tsx
  modified:
    - src/app/host/create/page.tsx
    - src/app/host/create/layout.tsx
    - src/app/page.tsx
key-decisions:
  - "Category values use DB enum format (food_drink) directly instead of TypeScript EventCategory enum (food-drink)"
  - "Co-host input removed from create form; co-hosts added post-creation via dashboard actions"
  - "Auth guard uses client-side redirect pattern (useSession + router.push) consistent with 01-02 approach"
  - "Dashboard invalidates myEvents query on publish/cancel for instant UI refresh"
metrics:
  duration: "~4 minutes"
  completed: "2026-03-09"
  tasks-completed: 3
  tasks-total: 3
---

# Phase 02 Plan 02: Wire Create Event and Host Dashboard to tRPC Backend Summary

Create event form wired to host.createEvent tRPC mutation with validation and loading states; host dashboard built with real data from host.myEvents query, publish/cancel actions, and proper auth guards.

## What Was Built

### Task 1: Create Event Form Integration (1602b4e)

Replaced the stub `handleSubmit` in the create event page with a real tRPC mutation:

- **tRPC mutation:** Uses `trpcReact.host.createEvent.useMutation()` to submit event data. Constructs ISO datetime from separate date/time inputs. Maps form fields to the `createEventInput` validator schema.
- **Validation:** Client-side validation requires title (3+ chars), category, date, and time before submission. Shows inline error messages below invalid fields.
- **Loading/error states:** Spinner and "Creating..." text during mutation. Disabled submit button while loading. Error banner on mutation failure. Success banner with auto-redirect to `/host/dashboard`.
- **Auth guard:** `authClient.useSession()` check redirects unauthenticated users to `/login`. Loading spinner shown while session resolves.
- **Category fix:** Uses DB enum values directly (`food_drink`) instead of the TypeScript `EventCategory` enum (`food-drink`) to match validator schema.
- **Removed co-host input:** Co-hosts are managed post-creation via the dashboard, not during the create flow.

### Task 2: Host Dashboard (6a9b23a)

Built a new host dashboard page showing the authenticated user's events:

- **Data fetching:** `trpcReact.host.myEvents.useQuery()` fetches upcoming and past events, only enabled when session exists.
- **Event cards:** Each card displays title, date/time, status badge (draft/published/cancelled with icons), RSVP count, location name, and category.
- **Actions:** Publish button for drafts (calls `host.publishEvent`), Cancel button for active events (calls `host.cancelEvent`), Edit link pointing to `/host/create?edit={id}`.
- **Cache invalidation:** Both publish and cancel mutations invalidate the `myEvents` query via `trpcReact.useUtils()` for instant UI refresh.
- **Empty state:** Shows a "No events yet" illustration with a Create Event CTA.
- **Status badges:** Color-coded (amber for draft, green for published, red for cancelled) with matching icons.
- **Layout:** Dashboard layout with proper metadata for SEO.

### Task 3: Auth Guards and Navigation (38e5577)

- **Metadata fix:** Updated create event layout from "Create a Host Profile" to "Create Event".
- **Navigation:** Fixed homepage footer "Host dashboard" link to point to `/host/dashboard` instead of `/host/create`.
- **Auth guards:** Already implemented in Tasks 1 and 2 on both create and dashboard pages.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed EventCategory enum mismatch for form submission**
- **Found during:** Task 1
- **Issue:** The TypeScript `EventCategory` enum uses `food-drink` (hyphen) but the Zod validator and DB schema use `food_drink` (underscore). Using `EventCategory` values in the create form would cause validation errors.
- **Fix:** Used DB enum values directly as a const array instead of importing from `EventCategory`. This matches the validator schema and avoids the mismatch.
- **Files modified:** `src/app/host/create/page.tsx`
- **Commit:** 1602b4e

## Decisions Made

1. Category values use DB enum format (`food_drink`) directly instead of the TypeScript `EventCategory` enum to avoid the known hyphen/underscore mismatch.
2. Co-host input removed from the create form since the backend `addCoHost` mutation requires an existing event ID -- co-hosts are managed post-creation.
3. Auth guards use the client-side `useSession()` + `router.push('/login')` redirect pattern, consistent with the approach established in Phase 01.
4. Dashboard uses `useUtils().host.myEvents.invalidate()` for instant cache refresh after publish/cancel actions.

## Self-Check: PASSED

- src/app/host/create/page.tsx: FOUND
- src/app/host/dashboard/page.tsx: FOUND
- src/app/host/dashboard/layout.tsx: FOUND
- src/app/host/create/layout.tsx: FOUND
- Commit 1602b4e: FOUND
- Commit 6a9b23a: FOUND
- Commit 38e5577: FOUND
