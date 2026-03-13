const Trades = require("../DB/Models/trades.model");

const createTrade = async ({ accountId, tradeData }) => {
  const metadata = {
    source: "manual-entry",
  };
  const trade = await Trades.create({
    ...tradeData,
    accountId,
    metadata,
  });

  return trade;
};

const getTrades = async ({ accountId, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const trades = await Trades.find({ accountId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Trades.countDocuments({ accountId });

  return {
    trades,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

const getTradeById = async ({ accountId, tradeId }) => {
  const trade = await Trades.findOne({
    _id: tradeId,
    accountId,
  });

  if (!trade) {
    throw new Error("Trade not found");
  }

  return trade;
};

const updateTrade = async ({ accountId, tradeId, update }) => {
  const trade = await Trades.findOneAndUpdate(
    { _id: tradeId, accountId },
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

const deleteTrade = async ({ accountId, tradeId }) => {
  const trade = await Trades.findOneAndDelete({
    _id: tradeId,
    accountId,
  });

  if (!trade) {
    throw new Error("Trade not found");
  }

  return trade;
};

const uploadTrades = async (trades) => {
  const BATCH_SIZE = 1000;
  let data

  for (let i = 0; i < trades.length; i += BATCH_SIZE) {
    const batch = trades.slice(i, i + BATCH_SIZE);
     data = await Trades.insertMany(batch, { ordered: true });
    console.log(data);
  }
  return data;
};

module.exports = {
  createTrade,
  getTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
  uploadTrades,
};
