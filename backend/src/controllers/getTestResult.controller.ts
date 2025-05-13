import { metricsRepository } from "#repository/testMetric/testMetric.repo.js";
import logger from "#utils/logger.js";
import fs from "fs/promises";
// @ts-ignore
import HL7 from "hl7-standard";
import { deriveReport, TestResult } from "./getTestResult.deriver";

type Result =
  | {
      outcome: "SUCCESS";
      result: TestResult;
    }
  | {
      outcome: "FAILURE";
      reason: "FAILED_TO_PARSE" | "FAILED_TO_GET_REPORT";
    };

export const getReport = async (testReportId: string): Promise<Result> => {
  // read file
  let data: string;

  try {
    data = await fs.readFile("uploads/" + testReportId + ".txt", {
      encoding: "utf8",
    });
  } catch (error) {
    logger.error("error while reading file", error, testReportId);

    return { outcome: "FAILURE", reason: "FAILED_TO_GET_REPORT" };
  }

  // parse file
  let hl7;

  try {
    hl7 = new HL7(data);
  } catch (error) {
    logger.error("error while reading file", error, testReportId);

    return { outcome: "FAILURE", reason: "FAILED_TO_PARSE" };
  }

  const testMetrics = metricsRepository.getAllTestMetrics();

  const derivedOutcome = deriveReport(hl7, testMetrics);

  const result =
    derivedOutcome.outcome === "SUCCESS"
      ? { outcome: "SUCCESS" as const, result: derivedOutcome.report }
      : {
          outcome: "FAILURE" as const,
          reason: "FAILED_TO_GET_REPORT" as const,
        };

  return result;
};
