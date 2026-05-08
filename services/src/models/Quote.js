import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    customer: { type: String, default: "—" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    annotations: { type: String, default: "" },
    grandTotal: { type: Number, default: null },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Quote", quoteSchema);
