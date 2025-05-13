import express from "express";
import cors from "cors";

import reportRouter from "#routes/report.js";
import testResultRouter from "#routes/testResult.js";
import expressErrorHandler from "#utils/errorHandler.js";
import { loggerMiddleWare } from "#middlewares/logger.middleware.js";
import { loadMetrics } from "#repository/testMetric/testMetric.repo.js";
import logger from "#utils/logger.js";

const startServer = () => {
  const app = express();
  const PORT = 3000;
  app.use(cors());

  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
  app.use(loggerMiddleWare);

  app.get("/", (req, res) => {
    res.send("Server up!");
  });

  app.use("/api/report", reportRouter);
  app.use("/api/result", testResultRouter);

  app.use(expressErrorHandler);

  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();

loadMetrics();
