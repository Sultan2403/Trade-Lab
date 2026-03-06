const Trade = require("../models/trade.model");

const createTrade = async ({ userId, tradeData }) => {
  const trade = await Trade.create({
    ...tradeData,
    userId,
  });

  return trade;
};

const getTrades = async ({ userId, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const trades = await Trade.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Trade.countDocuments({ userId });

  return {
    trades,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

const getTradeById = async ({ userId, tradeId }) => {
  const trade = await Trade.findOne({
    _id: tradeId,
    userId,
  });

  if (!trade) {
    throw new Error("Trade not found");
  }

  return trade;
};

const updateTrade = async ({ userId, tradeId, update }) => {
  const trade = await Trade.findOneAndUpdate({ _id: tradeId, userId }, update, {
    new: true,
  });

  if (!trade) {
    throw new Error("Trade not found");
  }

  return trade;
};

const deleteTrade = async ({ userId, tradeId }) => {
  const trade = await Trade.findOneAndDelete({
    _id: tradeId,
    userId,
  });

  if (!trade) {
    throw new Error("Trade not found");
  }

  return trade;
};

module.exports = {
  createTrade,
  getTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
};
