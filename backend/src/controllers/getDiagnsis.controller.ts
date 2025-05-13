import logger from "#utils/logger.js";
import fs from "fs/promises";
// @ts-ignore
import HL7 from "hl7-standard";

type Report = {
  reportId: string;
  patients: {
    oru_test_result: {
      id: string;
      diagnosisCode?: string;
      testCode?: string;
      test_everLab_high: number;
      test_everLab_low: number;
      unit: string;
      standard_high: number;
      standard_low: number;
      value: number;
      code: string;
      isAbnormal: boolean;
    }[];
  }[];
};

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

  try {
    const hl7 = new HL7(data);
    hl7.transform();

    logger.info("parsed hl7", hl7.transformed);
    // code here
  } catch (error) {
    logger.error("error while reading file", error, diagnosisFileId);

    return { outcome: "FAILURE", reason: "FAILED_TO_PARSE" };
  }

  const report: Report = {
    reportId: "sdfs",
    patients: [],
  };

  return { outcome: "SUCCESS", report };
};
