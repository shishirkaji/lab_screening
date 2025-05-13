import express from "express";
import uploadRouter from "./routes/upload";
import fileUpload from "express-fileupload";
import expressErrorHandler from "#utils/errorHandler.js";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/upload", uploadRouter);

app.use(expressErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
