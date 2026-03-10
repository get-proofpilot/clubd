import { router } from "./init";
import { authRouter } from "../routers/auth";
import { userRouter } from "../routers/user";
import { eventRouter } from "../routers/event";
import { hostRouter } from "../routers/host";
import { rsvpRouter } from "../routers/rsvp";
import { checkoutRouter } from "../routers/checkout";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  event: eventRouter,
  host: hostRouter,
  rsvp: rsvpRouter,
  checkout: checkoutRouter,
});

export type AppRouter = typeof appRouter;
