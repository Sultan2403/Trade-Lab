const { getEquityCurve } = require("../Services/analytics.service");

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

module.exports = { equityCurveController };
