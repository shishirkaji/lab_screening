import logger from "#utils/logger.js";
import express from "express";
import { reportUploadSchema, getReportSchema } from "./schema/report.schema";
import { validateReqSchema } from "#middlewares/schemaValidator.middleware.js";
import { upload } from "#utils/multer.js";
import { getReport } from "#controllers/getReport.controller.js";

const router = express.Router();

router.post(
  "/upload",
  upload.single("patient_record"),
  validateReqSchema(reportUploadSchema),
  (req, res) => {
    logger.info("file uploadded successfully", req.body);

    res.status(200).json({
      message: "File uploaded successfully",
      fileId: req.body.fileId,
    });
  }
);

router.get(
  "/:reportId",
  validateReqSchema(getReportSchema),
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
