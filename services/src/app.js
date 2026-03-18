import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import rateRoutes from "./routes/rateRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gold-cargo";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increase limit for large Excel files

// Mount the routes
app.use("/api/auth", authRoutes);
app.use("/api/rates", rateRoutes);
app.use("/api/income", incomeRoutes);

app.listen(PORT, () =>
  console.log(`🚀 Services backend running on http://localhost:${PORT}`)
);