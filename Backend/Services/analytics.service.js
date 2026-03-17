const Account = require("../DB/Models/accounts.model")
const Trades = require("../DB/Models/trades.model")

const getEquityCurve = async ({ accountId, timeframe = 30 }) => {
  // Fetch the account
  const account = await Account.findOne({ _id: accountId });
  if (!account) throw new Error("Account not found");

  // Determine start and end dates based on timeframe
  const endDate = new Date(); // now
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - timeframe);

  // Fetch trades for this account within timeframe (closed trades)
  const trades = await Trades.find({
    accountId: account._id,
    closedAt: { $gte: startDate, $lte: endDate },
  }).sort({ closedAt: 1 }); // chronological order

  if (trades.length === 0) {
    // no trades, return a flat equity
    return [
      { date: startDate, equity: account.current_balance || 0 },
      { date: endDate, equity: account.current_balance || 0 },
    ];
  }

  // Initialize reverse loop
  let runningBalance = account.current_balance || 0;
  const equitySnapshots = [];

  // Loop in reverse chronological order
  for (let i = trades.length - 1; i >= 0; i--) {
    const trade = trades[i];
    runningBalance -= trade.pnl; // subtract P&L to get previous balance
    equitySnapshots.unshift({
      date: trade.closedAt,
      equity: runningBalance,
    });
  }

  // Add current balance as the last snapshot (optional)
  equitySnapshots.push({
    date: endDate,
    equity: account.current_balance || 0,
  });

  return equitySnapshots;
};

module.exports = { getEquityCurve };
