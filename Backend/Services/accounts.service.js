const Account = require("../DB/Models/accounts.model");
const Trade = require("../DB/Models/trades.model");

const createAccount = async ({ accountData, userId }) => {
  try {
    const current_balance = accountData.starting_balance;
    const account = await Account.create({
      userId,
      ...accountData,
      current_balance,
    });

    return account;
  } catch (err) {
    throw err;
  }
};

const getAccountProfile = async ({ accountId, userId, timeframe = 30 }) => {
  const account = await Account.findOne({ _id: accountId, userId });
  if (!account) throw new Error("Account not found");

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - timeframe);

  const prevEndDate = new Date(startDate);
  const prevStartDate = new Date(prevEndDate);
  prevStartDate.setDate(prevEndDate.getDate() - timeframe);

  const aggregateMetrics = async (start, end) => {
    const metrics = await Trade.aggregate([
      {
        $match: {
          accountId: account._id,
          closedAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: 1 },
          totalWins: { $sum: { $cond: [{ $gt: ["$pnl", 0] }, 1, 0] } },
          totalLosses: { $sum: { $cond: [{ $lt: ["$pnl", 0] }, 1, 0] } },
          netPnL: { $sum: "$pnl" },
          grossWins: { $sum: { $cond: [{ $gt: ["$pnl", 0] }, "$pnl", 0] } },
          grossLosses: { $sum: { $cond: [{ $lt: ["$pnl", 0] }, "$pnl", 0] } },
          avgRR: { $avg: "$riskToReward" },
          activeDaysSet: {
            $addToSet: {
              $dateToString: { format: "%Y-%m-%d", date: "$openedAt" },
            },
          },
          largestWinTrade: {
            $max: {
              pnl: "$pnl",
              id: "$_id",
            },
          },
          largestLossTrade: {
            $min: {
              pnl: "$pnl",
              id: "$_id",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalTrades: 1,
          winRate: {
            $cond: [
              { $eq: ["$totalTrades", 0] },
              0,
              { $multiply: [{ $divide: ["$totalWins", "$totalTrades"] }, 100] },
            ],
          },
          netPnL: 1,
          profitFactor: {
            $cond: [
              { $eq: ["$grossLosses", 0] },
              null,
              { $divide: ["$grossWins", { $abs: "$grossLosses" }] },
            ],
          },
          avgRR: 1,
          activeDays: { $size: "$activeDaysSet" },
          largestWin: {
            id: "$largestWinTrade.id",
            value: "$largestWinTrade.pnl",
          },
          largestLoss: {
            id: "$largestLossTrade.id",
            value: "$largestLossTrade.pnl",
          },
        },
      },
    ]);

    return (
      metrics[0] || {
        totalTrades: 0,
        winRate: 0,
        netPnL: 0,
        profitFactor: null,
        avgRR: null,
        largestWin: { id: null, value: null },
        largestLoss: { id: null, value: null },
      }
    );
  };

  const current = await aggregateMetrics(startDate, endDate);
  const previous = await aggregateMetrics(prevStartDate, prevEndDate);

  const computeDelta = (currentVal, prevVal) =>
    prevVal ? ((currentVal - prevVal) / Math.abs(prevVal)) * 100 : null;

  const tradesMetrics = {
    totalTrades: {
      value: current.totalTrades,
      delta: computeDelta(current.totalTrades, previous.totalTrades),
    },
    winRate: {
      value: current.winRate,
      delta: computeDelta(current.winRate, previous.winRate),
    },
    activeDays: {
      value: current.activeDays,
    },
    netPnL: {
      value: current.netPnL,
      delta: computeDelta(current.netPnL, previous.netPnL),
    },
    profitFactor: {
      value: current.profitFactor,
      delta: computeDelta(current.profitFactor, previous.profitFactor),
    },
    avgRR: {
      value: current.avgRR,
      delta: computeDelta(current.avgRR, previous.avgRR),
    },
    largestWin: current.largestWin, // id + value, no delta
    largestLoss: current.largestLoss, // id + value, no delta
  };

  return { account, tradesMetrics };
};

const getAllUserAccounts = async ({ userId }) => {
  const accounts = await Account.find({ userId });

  return accounts;
};

module.exports = { createAccount, getAccountProfile, getAllUserAccounts };
