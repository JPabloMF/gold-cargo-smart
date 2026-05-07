import FclRate from "../models/FclRate.js";

export const getFclRates = async (req, res) => {
  try {
    console.log("[FclRates] Fetching FCL rates");
    const record = await FclRate.findOne({});
    if (!record) {
      return res.json({ success: true, data: [] });
    }
    console.log(`[FclRates] FCL rates fetched successfully (${record.data.length} rows)`);
    res.json({ success: true, data: record.data });
  } catch (error) {
    console.error("[FclRates] Error fetching FCL rates:", error);
    res.status(500).json({ success: false, message: "Error fetching FCL rates", error: error.message });
  }
};

export const updateFclRates = async (req, res) => {
  try {
    const { data } = req.body;
    const updatedByEmail = req.user?.email || "Unknown";

    console.log(`[FclRates] Updating FCL rates (by ${updatedByEmail})`);

    await FclRate.findOneAndUpdate(
      {},
      { data, updatedBy: updatedByEmail },
      { upsert: true, new: true }
    );

    console.log("[FclRates] FCL rates updated successfully");
    res.json({ success: true, message: "FCL rates updated successfully" });
  } catch (error) {
    console.error("[FclRates] Error updating FCL rates:", error);
    res.status(500).json({ success: false, message: "Error updating FCL rates", error: error.message });
  }
};
