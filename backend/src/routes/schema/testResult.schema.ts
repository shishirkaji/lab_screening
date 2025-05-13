import z from "zod";

export const getResultSchema = z.object({
  params: z.object({
    reportId: z.string().uuid(),
  }),
});
