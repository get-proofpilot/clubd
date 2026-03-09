import { betterAuth } from "better-auth";
import { phoneNumber } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import twilio from "twilio";
import { db } from "./db";

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token || !sid.startsWith("AC")) {
    throw new Error("Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
  }
  return twilio(sid, token);
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(db, { provider: "pg" }),
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5-minute cookie cache to reduce DB reads
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
      appBundleIdentifier: process.env.APPLE_BUNDLE_ID,
    },
  },
  trustedOrigins: ["https://appleid.apple.com"],
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber: phone }) => {
        // IGNORE Better Auth's generated code.
        // Delegate OTP generation + delivery to Twilio Verify.
        await getTwilioClient().verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
          .verifications.create({
            to: phone,
            channel: "sms",
          });
      },
      verifyOTP: async ({ phoneNumber: phone, code }) => {
        // Delegate verification to Twilio Verify.
        const client = getTwilioClient();
        const check = await client.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
          .verificationChecks.create({
            to: phone,
            code,
          });
        return check.status === "approved";
      },
    }),
    nextCookies(), // Must be last plugin
  ],
});

export type Session = typeof auth.$Infer.Session;
