import express from "express";
import { gfs } from "../config/db";

const router = express.Router();

router.get("/file/:filename", (req: express.Request, res: express.Response) => {
  const { filename } = req.params;
  if (!filename) {
    res.status(400).json({ error: "Filename is required" });
    return;
  }

  try {
    const downloadStream = gfs.openDownloadStreamByName(filename);

    downloadStream.on("error", (err) => {
      console.error("Error downloading file:", err);
      return res.status(404).json({ error: "File not found" });
    });

    res.set("Content-Type", "application/octet-stream");
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).json({ error: "Error retrieving file" });
  }
});

export default router;
