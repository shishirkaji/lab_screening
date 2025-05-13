import logger from "#utils/logger.js";
import express from "express";
import {
  diagnosisUploadSchema,
  getDiagnosisSchema,
} from "./schema/diagnosis.schema";
import { validateReqSchema } from "#middlewares/schemaValidator.middleware.js";
import { upload } from "#utils/multer.js";

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

router.get("/:fileId", validateReqSchema(getDiagnosisSchema), (req, res) => {
  logger.info("parsed the diagnosis file");
  // read from the file.

  res.send(200);
});

export default router;
