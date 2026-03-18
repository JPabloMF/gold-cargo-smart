import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
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
      required: true,
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
