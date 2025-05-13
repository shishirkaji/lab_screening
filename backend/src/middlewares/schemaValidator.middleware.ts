import logger from "#utils/logger.js";
import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export const validateReqSchema =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (result.data) {
      next();
      return;
    }

    if (result.error && result.error instanceof ZodError) {
      const errorMessages = result.error.errors.map(
        (issue) => `${issue.path.join(".")} is ${issue.message}`
      );
      res
        .status(400)
        .json({ message: "VALIDATION_ERROR", errors: errorMessages });
      return;
    }

    if (result.error) {
      logger.error("Server error", { result });

      res.status(500).json("Server error");
      return;
    }
  };
