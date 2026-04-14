import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    customer: { type: String, default: "—" },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Quote", quoteSchema);
