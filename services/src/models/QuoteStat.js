import mongoose from "mongoose";

// Single-document counter — always upsert by the fixed key "global"
const quoteStatSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    totalQuotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("QuoteStat", quoteStatSchema);
