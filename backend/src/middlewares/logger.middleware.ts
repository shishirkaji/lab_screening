import logger from "#utils/logger.js";
import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

let numberOfRequests = 0;

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

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
          statusCode: res.statusCode,
        });
      });

      next();
    });
  }, 10);
};
