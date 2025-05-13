import winston, { LeveledLogMethod } from "winston";
import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

const rquidFormatter = winston.format((info) => {
  const rquid = asyncLocalStorage.getStore()?.get("rquid");

  return { ...info, rquid };
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(rquidFormatter(), winston.format.json()),
});
let numberOfRequests = 0;

export const loggerMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const reqStartTime = Date.now();
  const rquid = randomUUID();

  const store = new Map<string, string>().set("rquid", rquid);

  // Had to set timeout to 10ms in order for the asyncLocalStorage to run correctly ??
  setTimeout(() => {
    asyncLocalStorage.run(store, () => {
      logger.info("Start request", {
        route: req.route,
      });

      res.header({ rquid });

      res.on("finish", () => {
        logger.info("Finish request", {
          responseTimeMs: Date.now() - reqStartTime,
          attempt: numberOfRequests++,
        });
      });

      next();
    });
  }, 10);
};

export default logger;
