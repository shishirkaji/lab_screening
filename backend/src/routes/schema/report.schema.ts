import z from "zod";

export const reportUploadSchema = z.object({
  body: z.object({
    fileId: z.string().uuid(),
  }),
});

export const getReportSchema = z.object({
  params: z.object({
    reportId: z.string().uuid(),
  }),
});
