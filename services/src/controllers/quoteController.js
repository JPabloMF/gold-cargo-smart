import Quote from "../models/Quote.js";
import QuoteStat from "../models/QuoteStat.js";

export const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json({ success: true, data: quotes });
  } catch (error) {
    console.error("[Quote] Error fetching quotes:", error);
    res.status(500).json({ success: false, message: "Error fetching quotes", error: error.message });
  }
};

export const createQuote = async (req, res) => {
  try {
    const { customer, origin, destination, type } = req.body;
    const quote = await Quote.create({ customer, origin, destination, type });

    // Increment the global counter as a side effect
    await QuoteStat.findOneAndUpdate(
      { key: "global" },
      { $inc: { totalQuotes: 1 } },
      { upsert: true }
    );

    res.status(201).json({ success: true, data: quote });
  } catch (error) {
    console.error("[Quote] Error creating quote:", error);
    res.status(500).json({ success: false, message: "Error creating quote", error: error.message });
  }
};
