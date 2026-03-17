const mongoose = require("mongoose");
const Trades = require("../DB/Models/trades.model");
const Account = require("../DB/Models/accounts.model");
const { calculateRiskPercent, calculateRiskToReward } = require("../Helpers/calculations.helpers");

const createTrade = async ({ accountId, tradeData }) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const account = await Account.findById(accountId).session(session);
    if (!account) {
      throw new Error("Account not found");
    }

    const trade = await Trades.create(
      [
        {
          ...tradeData,
          accountId,
          metadata: { source: "manual-entry" },
        },
      ],
      { session },
    );

    if (tradeData.status === "Closed") {
      account.current_balance += tradeData.pnl;
      await account.save({ session });
    }

    await session.commitTransaction();

    return trade[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
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

  let virtualBalance = account.current_balance;

  // attach accountId and compute riskPercent
  const processedTrades = trades.map((trade) => {
    const riskPercent = calculateRiskPercent({
      stopLoss: trade.stopLoss,
      entry_price: trade.entry_price,
      size: trade.size,
      accountBalance: virtualBalance,
    });

    const riskToReward = calculateRiskToReward(trade);

    // update virtual balance with pnl
    virtualBalance += trade.pnl;

    return {
      ...trade,
      accountId,
      riskPercent,
      riskToReward,
      status: "Closed",
      outcome: trade.pnl > 0 ? "Win" : trade.pnl < 0 ? "Loss" : "Breakeven",
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
