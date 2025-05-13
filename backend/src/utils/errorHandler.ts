import { ErrorRequestHandler } from "express";
import logger from "./logger";

const expressErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
): void => {
  if (err.message === "INVALID_FILE_TYPE") {
    logger.error("Invalid file type");

    res.status(400).json({
      message: "Invalid file type",
    });
    return;
  }

  res.status(500).json({ message: "server error" });
};

export default expressErrorHandler;
