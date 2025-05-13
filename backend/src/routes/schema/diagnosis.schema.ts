import z from "zod";

export const diagnosisUploadSchema = z.object({
  body: z.object({
    fileId: z.string().uuid(),
  }),
});

export const getDiagnosisSchema = z.object({
  params: z.object({
    fileId: z.string().uuid(),
  }),
});
