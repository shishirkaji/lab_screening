import express from "express";
import { validateReqSchema } from "#middlewares/schemaValidator.middleware.js";
import { getReport } from "#controllers/getTestResult.controller.js";
import { getResultSchema } from "./schema/testResult.schema";

const router = express.Router();

router.get(
  "/:reportId",
  validateReqSchema(getResultSchema),
  async (req, res) => {
    const result = await getReport(req.params.reportId);

    if (result.outcome === "FAILURE") {
      res.status(400).json({ message: result.reason });
      return;
    }

    res.status(200).json({ result });
  }
);

export default router;
