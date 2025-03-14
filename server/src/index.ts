import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import purchaseRoutes from "./routes/purchase";




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/purchases", purchaseRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
