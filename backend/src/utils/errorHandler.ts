import { ErrorRequestHandler } from "express";
import logger from "./logger";

const expressErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
): void => {
  if (error.message === "INVALID_FILE_TYPE") {
    logger.error("Invalid file type");

    res.status(400).json({
      message: error.message,
    });
    return;
  }
  logger.error("Server error", error);

  res.status(500).json({ message: "SERVER_ERROR" });
};

export default expressErrorHandler;
