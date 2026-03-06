const tradeService = require("../services/trade.service");

const createTrade = async (req, res) => {
  try {
    const trade = await tradeService.createTrade(req.user.id, req.body);

    res.status(201).json({ succes: true, trade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTrades = async (req, res) => {
  try {
    const { userId } = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const trades = await tradeService.getTrades({
      userId,
      page,
      limit,
    });

    res.json({ success: true, trades });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTrade = async (req, res) => {
  try {
    const { userId } = req.user;
    const tradeId = req.params.id;

    const trade = await tradeService.getTradeById({
      userId,
      tradeId,
    });

    res.json({ success: true, trade });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateTrade = async (req, res) => {
  try {
    const { userId } = req.user;
    const tradeId = req.params.id;
    const update = req.body;
    const trade = await tradeService.updateTrade({ userId, tradeId, update });

    res.json({ success: true, trade });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteTrade = async (req, res) => {
  try {
    await tradeService.deleteTrade(req.user.id, req.params.id);

    res.json({ success: true, message: "Trade deleted" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTrade,
  getTrades,
  getTrade,
  updateTrade,
  deleteTrade,
};
