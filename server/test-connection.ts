import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose"; // Using ES6 import style for consistency

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  console.error("MONGO_URI is not defined in your environment variables.");
  process.exit(1);
}

mongoose
  .connect(dbUri)
  .then(() => {
    console.log("Connected to the database!");
    process.exit(0);
  })
  .catch((err: unknown) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  });
