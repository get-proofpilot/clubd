import { z } from "zod";

export const phoneNumberSchema = z
  .string()
  .regex(/^\+1\d{10}$/, "Phone number must be in E.164 format (e.g., +12125551234)");

export const otpCodeSchema = z
  .string()
  .regex(/^\d{6}$/, "OTP code must be exactly 6 digits");

export const interestsSchema = z.array(
  z.enum([
    "fitness",
    "wellness",
    "social",
    "outdoor",
    "food_drink",
    "creative",
    "family",
    "community",
  ]),
);
