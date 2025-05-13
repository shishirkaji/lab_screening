import { metricsRepository } from "#repository/testMetric/testMetric.repo.js";
import logger from "#utils/logger.js";
import fs from "fs/promises";
// @ts-ignore
import HL7 from "hl7-standard";
import { deriveReport, Report } from "./getDiagnosis.deriver";

type Result =
  | {
      outcome: "SUCCESS";
      report: Report;
    }
  | {
      outcome: "FAILURE";
      reason: "FAILED_TO_PARSE" | "FAILED_TO_GET_REPORT";
    };

export const getDiagnosisReport = async (
  diagnosisFileId: string
): Promise<Result> => {
  // read file
  let data: string;

  try {
    data = await fs.readFile("uploads/" + diagnosisFileId + ".txt", {
      encoding: "utf8",
    });
  } catch (error) {
    logger.error("error while reading file", error, diagnosisFileId);

    return { outcome: "FAILURE", reason: "FAILED_TO_GET_REPORT" };
  }

  // parse file
  let hl7;

  try {
    hl7 = new HL7(data);
  } catch (error) {
    logger.error("error while reading file", error, diagnosisFileId);

    return { outcome: "FAILURE", reason: "FAILED_TO_PARSE" };
  }

  const diagnosisMetrics = metricsRepository.getAllTestMetrics();

  const result = deriveReport(hl7, diagnosisMetrics);

  const report: Report = result;

  return { outcome: "SUCCESS", report };
};
