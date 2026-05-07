import mongoose from "mongoose";

const fclRateSchema = new mongoose.Schema(
  {
    data: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FclRate", fclRateSchema);
