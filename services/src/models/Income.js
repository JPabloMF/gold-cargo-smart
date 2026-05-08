import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lcl", "fcl"],
      required: true,
    },
    radicacionBL: {
      type: Number,
      required: true,
    },
    gastosEnDestino: {
      type: Number,
      required: true,
    },
    collectFee: {
      type: Number,
    },
    emisionEnDestinoBL: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Income", incomeSchema);
