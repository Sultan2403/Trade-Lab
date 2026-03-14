const tradeService = require("../Services/trades.service");

const createTrade = async (req, res) => {
  try {
    const { tradeData, accountId } = req.body;
    const trade = await tradeService.createTrade({ accountId, tradeData });

    res.status(201).json({ succes: true, trade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTrades = async (req, res) => {
  try {
    const { accountId } = req.body;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const trades = await tradeService.getTrades({
      accountId,
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
    const { accountId } = req.body;
    const tradeId = req.params.id;

    const trade = await tradeService.getTradeById({
      accountId,
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
    const { accountId } = req.body;
    const tradeId = req.params.id;
    const update = req.body;
    const trade = await tradeService.updateTrade({
      accountId,
      tradeId,
      update,
    });

    res.json({ success: true, trade });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteTrade = async (req, res) => {
  try {
    const accountId = req.body;
    const tradeId = req.params.id;

    await tradeService.deleteTrade({ accountId, tradeId });

    res.json({ success: true, message: "Trade deleted" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

const trade_Upload_Controller = async (req, res) => {
  try {
    const trades = req.trades;
    const { accountId } = req.body;

    const data = await tradeService.processAndUploadTrades({
      accountId,
      trades,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTrade,
  getTrades,
  getTrade,
  updateTrade,
  deleteTrade,
  trade_Upload_Controller,
};
