const Trades = require("../DB/Models/trades.model");
const Account = require("../DB/Models/trades.model");

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

async function processAndUploadTrades({ accountId, trades }) {
  // fetch account
  const account = await Account.findById(accountId);
  if (!account) throw new Error("Account not found");

  // only closed trades

  let virtualBalance = account.current_balance || account.starting_balance;

  // attach accountId and compute riskPercent
  const processedTrades = trades.map((trade) => {
    const riskPercent = calculateRiskPercent({
      stopLoss: trade.stopLoss,
      entry_price: trade.entry_price,
      size: trade.size,
      accountBalance: virtualBalance,
    });

    // update virtual balance with pnl
    virtualBalance += trade.pnl;

    return {
      ...trade,
      accountId,
      riskPercent,
      status: "Closed",
    };
  });

  // batch insert
  const BATCH_SIZE = 1000;

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < processedTrades.length; i += BATCH_SIZE) {
    const batch = processedTrades.slice(i, i + BATCH_SIZE);

    try {
      const result = await Trades.insertMany(batch, { ordered: false });

      successCount += result.length;
    } catch (err) {
      const inserted = err.insertedDocs?.length || 0;
      const failed = err.writeErrors?.length || 0;

      successCount += inserted;
      failedCount += failed;
    }
  }

  // update account balance once
  account.current_balance = virtualBalance;
  await account.save();

  return {
    successCount,
    failedCount,
  };
}

module.exports = {
  createTrade,
  getTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
  processAndUploadTrades,
};
