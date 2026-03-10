import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/server/auth";

const f = createUploadthing();

export const uploadRouter = {
  eventImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
