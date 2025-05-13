import logger from "#utils/logger.js";
import express from "express";
import { reportUploadSchema } from "./schema/report.schema";
import { validateReqSchema } from "#middlewares/schemaValidator.middleware.js";
import { upload } from "#utils/multer.js";

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

export default router;
