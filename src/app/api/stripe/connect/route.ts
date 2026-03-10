import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { getStripe } from '@/server/stripe';
import { auth } from '@/server/auth';
import { headers } from 'next/headers';

/**
 * Stripe Connect onboarding callback.
 *
 * After completing (or retrying) the Stripe onboarding flow, the user is
 * redirected here. We verify the account status and update the user record.
 *
 * Query params:
 *   stripe=complete  ->  check charges_enabled, update DB, redirect to dashboard
 *   stripe=retry     ->  redirect to dashboard with retry message
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stripeStatus = searchParams.get('stripe');
  const baseUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';

  if (stripeStatus === 'retry') {
    return NextResponse.redirect(
      `${baseUrl}/host/dashboard?stripe=retry`,
    );
  }

  if (stripeStatus === 'complete') {
    try {
      // Get session from Better Auth
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user?.id) {
        return NextResponse.redirect(
          `${baseUrl}/login`,
        );
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
      });

      if (!user?.stripeAccountId) {
        return NextResponse.redirect(
          `${baseUrl}/host/dashboard?stripe=error`,
        );
      }

      // Verify account status with Stripe
      const stripe = getStripe();
      const account = await stripe.accounts.retrieve(user.stripeAccountId);

      await db
        .update(users)
        .set({
          stripeAccountEnabled: account.charges_enabled ?? false,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));

      return NextResponse.redirect(
        `${baseUrl}/host/dashboard?stripe=complete`,
      );
    } catch {
      return NextResponse.redirect(
        `${baseUrl}/host/dashboard?stripe=error`,
      );
    }
  }

  // No recognized action -- redirect to dashboard
  return NextResponse.redirect(`${baseUrl}/host/dashboard`);
}
