const { getInsights } = require("../Services/insights.service");

const getInsightsController = async (req, res) => {
  try {
    // Hook up insights logic here...
    const { accountId, timeframe } = req.query;
    const data = await getInsights({accountId, timeframe})

    res.status(200).json({
      success: true,
      message: "Insights generated successfully",
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occured" });
  }
};

module.exports = { getInsightsController };
