import z from "zod";

export const reportUploadSchema = z.object({
  body: z.object({
    fileId: z.string().uuid(),
  }),
});
