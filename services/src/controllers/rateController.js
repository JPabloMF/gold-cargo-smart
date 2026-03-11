import Rate from "../models/Rate.js";

export const getRatesByContinent = async (req, res) => {
  try {
    const { continent } = req.params;
    const rate = await Rate.findOne({ continent });
    
    if (!rate) {
      return res.json({ success: true, data: [] });
    }
    
    res.json({ success: true, data: rate.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRatesByContinent = async (req, res) => {
  try {
    const { continent } = req.params;
    const { data } = req.body;
    
    // Upsert the rates for this continent
    const rate = await Rate.findOneAndUpdate(
      { continent },
      { 
        continent, 
        data,
        updatedBy: "admin" // Hardcoded for now, should come from auth
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, message: `Rates for ${continent} updated successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};