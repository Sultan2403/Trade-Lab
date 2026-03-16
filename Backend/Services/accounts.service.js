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

const getAccountProfile = async ({ accountId, userId }) => {
  // Fetch account first
  const account = await Account.findOne({ _id: accountId, userId: userId });
  if (!account) throw new Error("Account not found");

  // Aggregate trades for dashboard metrics
  
  const tradesMetrics = await Trade.aggregate([
    { $match: { accountId: account._id } }, // only this account's trades
    {
      $group: {
        _id: null,
        totalTrades: { $sum: 1 },
        totalWins: { $sum: { $cond: [{ $gt: ["$pnl", 0] }, 1, 0] } },
        totalLosses: { $sum: { $cond: [{ $lt: ["$pnl", 0] }, 1, 0] } },
        netPnL: { $sum: "$pnl" },
        grossWins: { $sum: { $cond: [{ $gt: ["$pnl", 0] }, "$pnl", 0] } },
        grossLosses: { $sum: { $cond: [{ $lt: ["$pnl", 0] }, "$pnl", 0] } },
        avgRR: { $avg: "$riskReward" }, // assuming you store riskReward per trade
        bestTrade: { $max: "$pnl" },
        worstTrade: { $min: "$pnl" },
        activeDaysSet: {
          $addToSet: {
            $dateToString: { format: "%Y-%m-%d", date: "$dateOpened" },
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
        bestTrade: 1,
        worstTrade: 1,
        activeDays: { $size: "$activeDaysSet" }, // count of unique active days
      },
    },
  ]);

  // Return combined response
  return {
    account,
    tradesMetrics:
      tradesMetrics.length !== 0
        ? tradesMetrics[0]
        : {
            totalTrades: 0,
            winRate: 0,
            netPnL: 0,
            profitFactor: null,
            avgRR: null,
            bestTrade: null,
            worstTrade: null,
            activeDays: 0,
          },
  };
};

const getAllUserAccounts = async ({ userId }) => {
  const accounts = await Account.find({ userId });

  return accounts;
};

module.exports = { createAccount, getAccountProfile, getAllUserAccounts };
