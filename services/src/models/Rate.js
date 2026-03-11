import mongoose from "mongoose";

const rateSchema = new mongoose.Schema(
  {
    continent: {
      type: String,
      required: true,
      index: true,
    },
    // The raw data from Excel converted to JSON
    // We'll store it as an array of objects
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

// Add unique index per continent to only keep latest rates for each
rateSchema.index({ continent: 1 }, { unique: true });

export default mongoose.model("Rate", rateSchema);