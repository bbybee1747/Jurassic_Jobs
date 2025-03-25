import express from "express";
import multer from "multer";
import { gfs } from "../config/db";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req: express.Request, res: express.Response): void => {
  console.log("Request file:", req.file);
  console.log("gfs instance:", gfs);

  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const filename = `${req.file.fieldname}-${Date.now()}-${req.file.originalname}`;

  let uploadStream;
  try {
    uploadStream = gfs.openUploadStream(filename, { contentType: req.file.mimetype });
  } catch (err) {
    console.error("Error opening upload stream:", err);
    res.status(500).json({ error: "Error initializing file upload" });
    return;
  }

  uploadStream.on("error", (err) => {
    console.error("Error uploading file to GridFS:", err);
    res.status(500).json({ error: "Error uploading file" });
  });

  uploadStream.on("finish", (file: { filename: string }) => {
    const fileUrl = `${req.protocol}://${req.get("host")}/api/file/${file.filename}`;
    console.log("File uploaded successfully:", fileUrl);
    res.json({ url: fileUrl });
  });

  uploadStream.end(req.file.buffer);
});

export default router;
