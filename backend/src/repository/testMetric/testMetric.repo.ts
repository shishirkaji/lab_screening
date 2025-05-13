import csvToJson from "convert-csv-to-json";
import logger from "#utils/logger.js";

const testMetricMap = new Map<string, TestMetric>();
export type TestMetricMap = typeof testMetricMap;

export type TestMetricDB = {
  diagnostic: string;
  diagnostic_groups: string;
  everlab_higher: string;
  everlab_lower: string;
  gender: string;
  max_age: string;
  min_age: string;
  name: string;
  oru_sonic_codes: string;
  oru_sonic_units: string;
  standard_higher: string;
  standard_lower: string;
  units: string;
};

export type TestMetric = {
  diagnostic: string;
  diagnosticGroups: string;
  everlabHigher: number;
  everlabLower: number;
  gender: string;
  maxAge: number;
  minAge: number;
  name: string;
  oruSonicCodes: string;
  oruSonicUnits: string;
  standardHigher: number;
  standardLower: number;
  units: string;
};
const transformMetricTableToObject = (metric: TestMetricDB): TestMetric => {
  return {
    diagnostic: metric.diagnostic,
    diagnosticGroups: metric.diagnostic_groups,
    everlabHigher: parseInt(metric.everlab_higher),
    everlabLower: parseInt(metric.everlab_lower),
    gender: metric.gender,
    maxAge: parseInt(metric.max_age),
    minAge: parseInt(metric.min_age),
    name: metric.name,
    oruSonicCodes: metric.oru_sonic_codes,
    oruSonicUnits: metric.oru_sonic_units,
    standardHigher: parseInt(metric.standard_higher),
    standardLower: parseInt(metric.standard_lower),
    units: metric.units,
  };
};

export const loadMetrics = () => {
  try {
    const metrics = csvToJson
      .fieldDelimiter(",")
      .getJsonFromCsv(__dirname + "/diagnostic_metrics.csv");

    metrics.forEach((metric: TestMetricDB) => {
      const codes = metric.oru_sonic_codes?.split(";");
      const units = metric.oru_sonic_units?.split(";");

      codes?.forEach((metricCode) => {
        units?.forEach((unit) => {
          testMetricMap.set(
            `${metricCode}-${unit}`,
            transformMetricTableToObject(metric)
          );
        });
      });
    });

    // test csv loaded
    const test1 = testMetricMap.get("Ferritin-ug/L");
    const test2 = testMetricMap.get("Ferritin-ng/mL");
    const test3 = testMetricMap.get("S Ferritin:-ug/L");
    const test4 = testMetricMap.get("S Ferritin:-ng/mL");

    if (!test1 || !test2 || !test3 || !test4) {
      logger.error("Failed to load data", { test1, test2, test3, test4 });
      throw Error("data loading failed");
    }

    logger.info("successfully loaded metrics");
  } catch (error) {
    logger.error("error loading db", error);
  }
};

export const metricsRepository = {
  getTestMetricsByCode: (code: string): TestMetric | undefined => {
    return testMetricMap.get(code);
  },

  getAllTestMetrics: () => {
    return testMetricMap;
  },
};
