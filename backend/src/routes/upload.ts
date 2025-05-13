import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import multer from "multer";

const router = express.Router();

const storagePath = "uploads/";
const maxFileSize = 500 * 1024; // 500 KB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storagePath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: maxFileSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["text/plain"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("INVALID_FILE_TYPE"));
    }
  },
});

router.post("/", upload.single("patient_record"), (req, res) => {
  if (!req.file) {
    console.log("NO FILE");
    res.status(400).json({
      message: "No file provided",
    });
    return;
  }

  res.status(200).json({
    message: "File uploaded successfully",
  });
});

export default router;
