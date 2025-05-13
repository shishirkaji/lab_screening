import { randomUUID } from "crypto";
import multer from "multer";

const storagePath = "uploads/";
const maxFileSize = 500 * 1024; // 500 KB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storagePath);
  },

  filename: (req, file, cb) => {
    const fileId = randomUUID();
    const fileName = fileId + "." + file.originalname?.split(".")[1];

    req.body.fileId = fileId;

    cb(null, fileName);
  },
});

export const upload = multer({
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
