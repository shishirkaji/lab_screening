import logger from "#utils/logger.js";
import express from "express";
import {
  diagnosisUploadSchema,
  getDiagnosisSchema,
} from "./schema/diagnosis.schema";
import { validateReqSchema } from "#middlewares/schemaValidator.middleware.js";
import { upload } from "#utils/multer.js";
import { getDiagnosisReport } from "#controllers/getDiagnosis.controller.js";

const router = express.Router();

router.post(
  "/upload",
  upload.single("patient_record"),
  validateReqSchema(diagnosisUploadSchema),
  (req, res) => {
    logger.info("file uploadded successfully", req.body);

    res.status(200).json({
      message: "File uploaded successfully",
      fileId: req.body.fileId,
    });
  }
);

router.get(
  "/:fileId",
  validateReqSchema(getDiagnosisSchema),
  async (req, res) => {
    const result = await getDiagnosisReport(req.params.fileId);

    if (result.outcome === "FAILURE") {
      res.status(400).json({ message: result.reason });
      return;
    }

    res.status(200).json({ result });
  }
);

export default router;
