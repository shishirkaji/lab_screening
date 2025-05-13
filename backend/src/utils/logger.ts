import winston, { LeveledLogMethod } from "winston";
import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { asyncLocalStorage } from "#middlewares/logger.middleware.js";

const rquidFormatter = winston.format((info) => {
  const rquid = asyncLocalStorage.getStore()?.get("rquid");

  return { ...info, rquid };
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(rquidFormatter(), winston.format.json()),
});

export default logger;
