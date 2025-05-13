import express from "express";

import diagnosisRouter from "./routes/diagnosis";

import expressErrorHandler from "#utils/errorHandler.js";
import { loggerMiddleWare } from "#middlewares/logger.middleware.js";

const startServer = () => {
  const app = express();
  const PORT = 3000;

  app.use(loggerMiddleWare);

  app.get("/", (req, res) => {
    res.send("Server up!");
  });

  app.use("/api/diagnosis", diagnosisRouter);

  app.use(expressErrorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
