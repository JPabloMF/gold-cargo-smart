import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount the routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () =>
  console.log(`🚀 Services backend running on http://localhost:${PORT}`),
);
