import Rate from "../models/Rate.js";

export const getRatesByContinent = async (req, res) => {
  try {
    const { continent } = req.params;
    console.log(`[Rates] Fetching rates for continent: ${continent}`);
    
    const rate = await Rate.findOne({ continent });
    
    if (!rate) {
      console.log(`[Rates] No rates found for continent: ${continent}`);
      return res.json({ success: true, data: [] });
    }
    
    console.log(`[Rates] Rates fetched successfully for ${continent}`);
    res.json({ success: true, data: rate.data });
  } catch (error) {
    console.error(`[Rates] Error fetching rates for ${req.params?.continent}:`, error);
    res.status(500).json({ success: false, message: "Error fetching rates", error: error.message });
  }
};

export const updateRatesByContinent = async (req, res) => {
  try {
    const { continent } = req.params;
    const { data } = req.body;
    
    // Safety check for req.user
    const updatedByEmail = req.user?.email || "Unknown";
    
    console.log(`[Rates] Updating rates for continent: ${continent} (by ${updatedByEmail})`);
    
    // Upsert the rates for this continent
    const rate = await Rate.findOneAndUpdate(
      { continent },
      { 
        continent, 
        data,
        updatedBy: updatedByEmail 
      },
      { upsert: true, new: true }
    );
    
    console.log(`[Rates] Rates for ${continent} updated successfully`);
    res.json({ success: true, message: `Rates for ${continent} updated successfully` });
  } catch (error) {
    console.error(`[Rates] Error updating rates for ${req.params?.continent}:`, error);
    res.status(500).json({ success: false, message: "Error updating rates", error: error.message });
  }
};