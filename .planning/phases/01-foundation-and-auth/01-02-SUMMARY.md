---
phase: "01"
plan: "02"
title: "Login and Onboarding Flow Integration"
subsystem: auth-flow
tags: [auth, phone-otp, social-signin, onboarding, trpc]
dependency-graph:
  requires: ["01-01"]
  provides: ["auth-login-flow", "onboarding-persistence", "user-router"]
  affects: ["login-page", "onboarding-page", "trpc-router"]
tech-stack:
  added: []
  patterns: ["Better Auth React hooks", "tRPC protected mutations", "E.164 phone formatting"]
key-files:
  created:
    - src/server/routers/user.ts
  modified:
    - src/app/login/page.tsx
    - src/app/onboarding/page.tsx
    - src/server/trpc/router.ts
key-decisions:
  - "Phone OTP uses two-step flow: send OTP then verify, not password-based sign-in"
  - "Social sign-in callback redirects to /onboarding for new users"
  - "Onboarding persists via tRPC protectedProcedure mutation (server-side auth check)"
  - "Interest IDs use underscore format (food_drink) matching DB enum and validators"
metrics:
  duration: "~10 minutes"
  completed: "2026-03-09"
  tasks-completed: 2
  tasks-total: 3
  checkpoint-reached: true
---

# Phase 01 Plan 02: Login and Onboarding Flow Integration Summary

Phone OTP two-step auth flow (send + verify via Better Auth + Twilio Verify), Apple/Google social sign-in, and tRPC-backed onboarding persistence that updates user location, interests, and onboardingComplete flag.

## What Was Built

### Task 1: Login Page Auth Integration (a0df10b)

Replaced the stub `router.push('/onboarding')` handlers on the login page with real Better Auth API calls:

- **Phone OTP flow:** Three-step UI (method selection -> phone input -> OTP verify). Phone input formats as `(555) 123-4567` with `+1` prefix fixed. Sends OTP via `authClient.phoneNumber.sendOtp()`. Verifies via `authClient.phoneNumber.verify()`. On success, checks if user needs onboarding and redirects accordingly.
- **Apple Sign In:** Calls `authClient.signIn.social({ provider: "apple", callbackURL: "/onboarding" })`.
- **Google Sign In:** Calls `authClient.signIn.social({ provider: "google", callbackURL: "/onboarding" })`.
- **UX:** Loading spinners on all async actions. Error display banner. Back navigation between steps. Resend code button. Input validation using existing Zod schemas.

### Task 2: Onboarding Persistence (dd50d10)

Created a tRPC mutation to persist user onboarding preferences:

- **User router** (`src/server/routers/user.ts`): `completeOnboarding` mutation protected by auth session. Accepts `{ location: string, interests: string[] }`. Updates `locationLabel`, `interests`, `onboardingComplete = true` in users table via Drizzle ORM.
- **Router registration:** Added `user: userRouter` to the app router in `src/server/trpc/router.ts`.
- **Onboarding page update:** Calls `trpc.user.completeOnboarding.mutate()` on "Get Started" click. Uses `authClient.useSession()` hook for session-aware welcome message. Shows loading spinner during mutation. Displays errors on failure.
- **Data consistency fix:** Changed interest ID `food-drink` to `food_drink` to match the Zod validator enum and DB event category enum.

### Task 3: End-to-End Verification (CHECKPOINT)

Awaiting human verification of the complete auth flow.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed interest ID mismatch (food-drink vs food_drink)**
- **Found during:** Task 2
- **Issue:** Original onboarding page used `food-drink` with a hyphen but the validator enum and DB schema use `food_drink` with an underscore.
- **Fix:** Changed the INTERESTS array to use `food_drink` consistently.
- **Files modified:** `src/app/onboarding/page.tsx`
- **Commit:** dd50d10

**2. [Rule 3 - Blocking] Avoided @nanostores/react dependency**
- **Found during:** Task 2
- **Issue:** Initial implementation used `useStore` from `@nanostores/react` which is not installed. Since `auth-client.ts` imports from `better-auth/react`, `useSession` is already a React hook.
- **Fix:** Changed from `useStore(authClient.useSession)` to `authClient.useSession()`.
- **Files modified:** `src/app/onboarding/page.tsx`
- **Commit:** dd50d10

## Decisions Made

1. Phone OTP uses the two-step send/verify flow rather than password-based `signIn.phoneNumber`, since Clubd is a passwordless auth system.
2. Social sign-in callbackURL set to `/onboarding` so new social users go through onboarding. Returning users who already completed onboarding will be handled by future middleware.
3. Interest IDs standardized to underscore format (`food_drink`) matching the DB enum.

## Checkpoint State

Task 3 (`checkpoint:human-verify`) has been reached. The plan is paused pending visual/functional verification of the auth flow.

## Self-Check: PASSED

- All 4 source files verified present on disk
- Both task commits (a0df10b, dd50d10) verified in git history
- SUMMARY.md created in correct directory
