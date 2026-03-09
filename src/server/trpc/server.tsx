import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { appRouter } from "./router";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "@/lib/trpc";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: async () => {
    const heads = await headers();
    return createTRPCContext({ headers: heads });
  },
  router: appRouter,
  queryClient: getQueryClient,
});
