import { ErrorRequestHandler } from "express";
import logger from "./logger";

const expressErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
): void => {
  res.header({ rquid: 123 });

  if (err.message === "INVALID_FILE_TYPE") {
    logger.error("Invalid file type", { rquid: "123" });

    res.status(400).json({
      message: "Invalid file type",
    });
    return;
  }

  res.status(500).json({ message: "server error" });
};

export default expressErrorHandler;
