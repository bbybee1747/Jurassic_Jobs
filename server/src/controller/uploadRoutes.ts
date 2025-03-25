import express from "express";
import multer from "multer";
import { gfs } from "../config/db";

const router = express.Router();

// Use memory storage so that the file buffer is available in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req: express.Request, res: express.Response): void => {
  // Log file details and gfs instance for debugging
  console.log("Request file:", req.file);
  console.log("gfs instance:", gfs);

  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  // Create a unique filename using the fieldname, current timestamp, and original name
  const filename = `${req.file.fieldname}-${Date.now()}-${req.file.originalname}`;

  // Open an upload stream to GridFSBucket with the computed filename and set the content type
  let uploadStream;
  try {
    uploadStream = gfs.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });
  } catch (err) {
    console.error("Error opening upload stream:", err);
    res.status(500).json({ error: "Error initializing file upload" });
  }

  if (!uploadStream) {
    res.status(500).json({ error: "Upload stream could not be initialized" });
    return;
  }

  // Handle errors during the upload process
  uploadStream.on("error", (err) => {
    console.error("Error uploading file to GridFS:", err);
    return res.status(500).json({ error: "Error uploading file" });
  });

  // When the upload is finished, return a URL that can be used to retrieve the file
  uploadStream.on("finish", (file: { filename: string }) => {
    const fileUrl: string = `${req.protocol}://${req.get("host")}/api/file/${file.filename}`;
    console.log("File uploaded successfully:", fileUrl);
    return res.json({ url: fileUrl });
  });

  // End the stream by passing in the file buffer
  uploadStream.end(req.file.buffer);
});

export default router;
