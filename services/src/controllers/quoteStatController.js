import QuoteStat from "../models/QuoteStat.js";

export const getQuoteCount = async (req, res) => {
  try {
    const stat = await QuoteStat.findOne({ key: "global" });
    res.json({ success: true, totalQuotes: stat?.totalQuotes ?? 0 });
  } catch (error) {
    console.error("[QuoteStat] Error fetching quote count:", error);
    res.status(500).json({ success: false, message: "Error fetching quote count", error: error.message });
  }
};

export const incrementQuoteCount = async (req, res) => {
  try {
    const stat = await QuoteStat.findOneAndUpdate(
      { key: "global" },
      { $inc: { totalQuotes: 1 } },
      { upsert: true, new: true }
    );
    console.log(`[QuoteStat] Quote count incremented to ${stat.totalQuotes}`);
    res.json({ success: true, totalQuotes: stat.totalQuotes });
  } catch (error) {
    console.error("[QuoteStat] Error incrementing quote count:", error);
    res.status(500).json({ success: false, message: "Error incrementing quote count", error: error.message });
  }
};
