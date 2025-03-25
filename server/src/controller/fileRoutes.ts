import express from "express";
import { gfs } from "../config/db";

const router = express.Router();

router.get("/file/:filename", (req, res) => {
  const { filename } = req.params;

  try {
    const downloadStream = gfs.openDownloadStreamByName(filename);
    
    res.set("Content-Type", "application/octet-stream");

    downloadStream.pipe(res);

    downloadStream.on("error", (err: Error) => {
      console.error("Error streaming file:", err);
      res.status(500).json({ error: "Error retrieving file" });
    });
  } catch (error) {
    console.error("File retrieval error:", error);
    res.status(404).json({ error: "File not found" });
  }
});

export default router;
