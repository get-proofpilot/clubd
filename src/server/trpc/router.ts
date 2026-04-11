import { router } from "./init";
import { authRouter } from "../routers/auth";
import { userRouter } from "../routers/user";
import { eventRouter } from "../routers/event";
import { hostRouter } from "../routers/host";
import { rsvpRouter } from "../routers/rsvp";
import { checkoutRouter } from "../routers/checkout";
import { communityRouter } from "../routers/community";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  event: eventRouter,
  host: hostRouter,
  rsvp: rsvpRouter,
  checkout: checkoutRouter,
  community: communityRouter,
});

export type AppRouter = typeof appRouter;
