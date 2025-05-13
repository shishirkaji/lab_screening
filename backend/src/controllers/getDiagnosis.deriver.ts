import {
  TestMetric,
  TestMetricMap,
} from "#repository/testMetric/testMetric.repo.js";
import logger from "#utils/logger.js";

export type Report = {
  reportId: string;
  patient: {
    id: string;
    evaluatedTestResults: {
      id?: string;
      diagnosisCode?: string;
      testCode?: string;
      testEverLabHigh: number;
      testEverLabLow: number;
      unit: string;
      standardHigh: number;
      standardLow: number;
      value: number;
      isEverlabResultsNormal: boolean;
      isStandardResultsNormal: boolean;
    }[];
  };
};

type DeriveReportOutcome =
  | {
      outcome: "SUCCESS";
      report: Report;
    }
  | {
      outcome: "FAILED_TO_EXTRACT_DATA_FROM_REPORT";
    };
export const deriveReport = (
  hl7: {
    transform: () => void;
    transformed: any;
    // transformed: { OBX: { data: Record<`OBX.${number}`, string | number> }[] };
  },
  testMetrics: TestMetricMap
): Report => {
  hl7.transform();

  const transformed = hl7.transformed;

  const evaluatedTestResults: Report["patient"]["evaluatedTestResults"] = [];

  transformed?.OBX?.forEach((result: any) => {
    let observedValue: number;
    let resultIdCode: string;
    let resultUnit: string;

    try {
      observedValue = parseInt(result.data["OBX.5"]);
      resultIdCode = result.data["OBX.3"]["OBX.3.2"];
      resultUnit = result.data["OBX.6"]["OBX.6.1"];
    } catch (error) {
      logger.error("Failed when extracting data from hl7 format", transformed);

      return { outcome: "FAILED_TO_EXTRACT_DATA_FROM_REPORT" };
    }

    const metric = testMetrics.get(`${resultIdCode}-${resultUnit}`);

    const canBeEvaluated = metric && observedValue;

    if (canBeEvaluated) {
      const evaluatedResult = {
        diagnosisCode: metric.diagnostic,
        testCode: resultIdCode,
        testEverLabHigh: metric.everlabHigher,
        testEverLabLow: metric.everlabLower,
        unit: metric.units,
        standardHigh: metric.standardHigher,
        standardLow: metric.standardLower,
        value: observedValue,
        isStandardResultsNormal: false,
        isEverlabResultsNormal: false,
      };

      if (isNormal(metric, observedValue, "EVERLAB")) {
        evaluatedResult.isEverlabResultsNormal = true;
      }
      if (isNormal(metric, observedValue, "STANDARD")) {
        evaluatedResult.isStandardResultsNormal = true;
      }

      evaluatedTestResults.push(evaluatedResult);
    }
  });

  return { reportId: "asdf", patient: { id: "sdfds", evaluatedTestResults } };
};

const isNormal = (
  metric: TestMetric,
  observedValue: number,
  method: "EVERLAB" | "STANDARD"
) => {
  const higherBand =
    method === "EVERLAB" ? metric.everlabHigher : metric.standardHigher;

  const lowerBand =
    method === "EVERLAB" ? metric.everlabLower : metric.standardLower;

  if (higherBand && lowerBand) {
    return observedValue > lowerBand && observedValue < higherBand;
  }

  if (!higherBand && !lowerBand) {
    return undefined;
  }

  if (higherBand && !lowerBand) {
    return observedValue < higherBand;
  }

  if (!higherBand && lowerBand) {
    return observedValue > lowerBand;
  }

  return undefined;
};
