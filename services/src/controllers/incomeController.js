import Income from "../models/Income.js";

export const createIncome = async (req, res) => {
  try {
    const { radicacionBL, gastosEnDestino, collectFee, emisionEnDestinoBL } = req.body;
    const createdBy = req.user?.email || "Unknown";

    console.log(`[Income] Creating income entry by ${createdBy}`);

    const income = await Income.create({
      radicacionBL,
      gastosEnDestino,
      collectFee,
      emisionEnDestinoBL,
      createdBy,
    });

    console.log(`[Income] Income entry created with id ${income._id}`);
    res.status(201).json({ success: true, data: income });
  } catch (error) {
    console.error("[Income] Error creating income entry:", error);
    res.status(500).json({ success: false, message: "Error creating income entry", error: error.message });
  }
};

export const getIncomes = async (req, res) => {
  try {
    console.log("[Income] Fetching all income entries");
    const incomes = await Income.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: incomes });
  } catch (error) {
    console.error("[Income] Error fetching income entries:", error);
    res.status(500).json({ success: false, message: "Error fetching income entries", error: error.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { radicacionBL, gastosEnDestino, collectFee, emisionEnDestinoBL } = req.body;
    const updatedBy = req.user?.email || "Unknown";

    console.log(`[Income] Updating income entry ${id} by ${updatedBy}`);

    const income = await Income.findByIdAndUpdate(
      id,
      { radicacionBL, gastosEnDestino, collectFee, emisionEnDestinoBL },
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ success: false, message: "Income entry not found" });
    }

    console.log(`[Income] Income entry ${id} updated successfully`);
    res.json({ success: true, data: income });
  } catch (error) {
    console.error(`[Income] Error updating income entry ${req.params?.id}:`, error);
    res.status(500).json({ success: false, message: "Error updating income entry", error: error.message });
  }
};
