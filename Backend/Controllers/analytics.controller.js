const { getEquityCurve, computeAnalytics } = require("../Services/analytics.service");

const equityCurveController = async (req, res) => {
  const { accountId, timeframe } = req.query;
  try {
    const data = await getEquityCurve({
      accountId,
      timeframe: Number(timeframe) || 30,
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getAnalytics = async (req, res) =>{
  try {
    const { accountId } = req.query;

    if (!accountId) {
      return res.status(400).json({ error: "accountId is required" });
    }

    const data = await computeAnalytics(accountId);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

module.exports = { equityCurveController, getAnalytics };
