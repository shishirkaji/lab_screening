import { z } from "zod";

export const TestReportSchema = z.object({
  reportId: z.string(),
  patient: z.object({
    id: z.string(),
    evaluatedTestResults: z.array(
      z.object({
        id: z.string().optional(),
        diagnosisCode: z.string().optional(),
        testCode: z.string().optional(),
        testEverLabHigh: z.number(),
        testEverLabLow: z.number(),
        unit: z.string(),
        standardHigh: z.number(),
        standardLow: z.number(),
        value: z.number(),
        isEverlabResultsNormal: z.boolean(),
        isStandardResultsNormal: z.boolean(),
      })
    ),
  }),
});

export type TestReport = z.infer<typeof TestReportSchema>;
