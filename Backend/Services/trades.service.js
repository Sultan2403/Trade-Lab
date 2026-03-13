const Trades = require("../DB/Models/trades.model");

const createTrade = async ({ userId, tradeData }) => {
  const metadata = {
    source: "manual-entry",
  };
  const trade = await Trades.create({
    ...tradeData,
    userId,
    metadata,
  });

  return trade;
};

const getTrades = async ({ userId, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const trades = await Trades.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Trades.countDocuments({ userId });

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
  const trade = await Trades.findOne({
    _id: tradeId,
    userId,
  });

  if (!trade) {
    throw new Error("Trade not found");
  }

  return trade;
};

const updateTrade = async ({ userId, tradeId, update }) => {
  const trade = await Trades.findOneAndUpdate(
    { _id: tradeId, userId },
    update,
    {
      new: true,
    },
  );

  if (!trade) {
    throw new Error("Trade not found");
  }

  return trade;
};

const deleteTrade = async ({ userId, tradeId }) => {
  const trade = await Trades.findOneAndDelete({
    _id: tradeId,
    userId,
  });

  if (!trade) {
    throw new Error("Trade not found");
  }

  return trade;
};

const uploadTrades = async (trades) => {
  const BATCH_SIZE = 1000;

  for (let i = 0; i < trades.length; i += BATCH_SIZE) {
    const batch = trades.slice(i, i + BATCH_SIZE);
    await Trades.insertMany(batch, { ordered: false });
  }
};

module.exports = {
  createTrade,
  getTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
  uploadTrades,
};
