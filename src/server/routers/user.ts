import { eq } from "drizzle-orm";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc/init";
import { db } from "../db";
import { users } from "../db/schema";
import { interestsSchema } from "@/lib/validators/auth";

const completeOnboardingInput = z.object({
  location: z.string().min(1, "Location is required"),
  interests: interestsSchema.refine(
    (arr) => arr.length >= 2,
    "Select at least 2 interests",
  ),
});

export const userRouter = router({
  completeOnboarding: protectedProcedure
    .input(completeOnboardingInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await db
        .update(users)
        .set({
          locationLabel: input.location,
          interests: input.interests,
          onboardingComplete: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),
});
