import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc/init";
import { db } from "../db";
import { users } from "../db/schema";

export const authRouter = router({
  demoLogin: publicProcedure.mutation(async () => {
    if (process.env.DEMO_LOGIN_ENABLED !== "true") {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const demoUser = await db.query.users.findFirst({
      where: eq(users.phoneNumber, "+10000000000"),
    });

    if (!demoUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Demo user not found. Run npm run db:seed first.",
      });
    }

    return {
      userId: demoUser.id,
      name: demoUser.name,
      displayName: demoUser.displayName,
    };
  }),
});
