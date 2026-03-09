import crypto from "node:crypto";
import { db } from "./index";
import { users } from "./schema";

async function seed() {
  const demoUserId = crypto.randomUUID();

  await db.insert(users).values({
    id: demoUserId,
    name: "Demo User",
    email: "demo@clubd.app",
    emailVerified: false,
    phoneNumber: "+10000000000",
    phoneNumberVerified: true,
    displayName: "Demo",
    bio: "Demo account for testing Clubd",
    locationLat: "33.6461",
    locationLng: "-117.9187",
    locationLabel: "Costa Mesa",
    interests: ["social", "outdoor", "fitness"],
    onboardingComplete: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`Demo user seeded with ID: ${demoUserId}`);
  console.log("Phone: +10000000000");
  console.log("Location: Costa Mesa, CA");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
