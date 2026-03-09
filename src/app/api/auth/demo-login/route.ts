import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { sessions } from "@/server/db/schema/sessions";

export async function POST() {
  if (process.env.DEMO_LOGIN_ENABLED !== "true") {
    return NextResponse.json({ error: "Demo login disabled" }, { status: 404 });
  }

  const demoUser = await db.query.users.findFirst({
    where: eq(users.phoneNumber, "+10000000000"),
  });

  if (!demoUser) {
    return NextResponse.json(
      { error: "Demo user not found. Run npm run db:seed first." },
      { status: 404 },
    );
  }

  // Create a session directly in the database
  const sessionToken = crypto.randomUUID();
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.insert(sessions).values({
    id: sessionId,
    userId: demoUser.id,
    token: sessionToken,
    expiresAt,
    ipAddress: "127.0.0.1",
    userAgent: "demo-login",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Set the session cookie matching Better Auth's expected format
  const response = NextResponse.json({ success: true });
  response.cookies.set("better-auth.session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return response;
}
