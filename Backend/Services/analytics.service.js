const Account = require("../DB/Models/accounts.model");
const Trades = require("../DB/Models/trades.model");
const mongoose = require("mongoose");

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

async function computeAnalytics(accountId) {
  if (!accountId) throw new Error("accountId is required");

  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const accountObjectId = new mongoose.Types.ObjectId(accountId);

  const matchStage = {
    $match: {
      accountId: accountObjectId,
      status: "Closed",
      outcome: { $in: ["Win", "Loss", "Breakeven"] },
      closedAt: { $ne: null },
    },
  };

  // 1️⃣ Trades Outcomes
  const tradeOutcomesAgg = await Trades.aggregate([
    matchStage,
    {
      $group: {
        _id: "$outcome",
        count: { $sum: 1 },
      },
    },
  ]);

  const tradeOutcomes = tradeOutcomesAgg.reduce(
    (acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    },
    { win: 0, loss: 0, breakEven: 0 },
  );

  // 2️⃣ Monthly Performance
  const monthlyPerformanceAgg = await Trades.aggregate([
    matchStage,
    { $match: { closedAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$closedAt" },
          month: { $month: "$closedAt" },
        },
        netPnL: { $sum: "$pnl" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthlyPerformance = monthlyPerformanceAgg.map((m) => ({
    month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
    netPnL: m.netPnL,
  }));

  // 3️⃣ Performance by Instrument
  const performanceByInstrumentAgg = await Trades.aggregate([
    matchStage,
    {
      $group: {
        _id: "$pair",
        trades: { $sum: 1 },
        win: {
          $sum: { $cond: [{ $eq: ["$outcome", "Win"] }, 1, 0] },
        },
        netPnL: { $sum: "$pnl" },
        avgPnL: { $avg: "$pnl" },
      },
    },
    { $sort: { trades: -1 } },
    { $limit: 5 },
  ]);

  const performanceByInstrument = performanceByInstrumentAgg.map((i) => ({
    symbol: i._id,
    trades: i.trades,
    winRate: i.trades ? Math.round((i.win / i.trades) * 100) : 0,
    netPnL: i.netPnL,
    avgPnL: i.avgPnL,
  }));

  // 4️⃣ P&L Distribution
  const allPnL = await Trades.find(
    { accountId: accountObjectId },
    { pnl: 1, _id: 0 },
  );

  const plMap = {};
  allPnL.forEach(({ pnl }) => {
    const base = Math.floor(pnl / 100) * 100;
    const bin = `${base}-${base + 99}`;
    plMap[bin] = (plMap[bin] || 0) + 1;
  });

  const plDistribution = Object.entries(plMap).map(([bin, count]) => ({
    bin,
    count,
  }));

  // 5️⃣ Risk Multiple Distribution
  const riskData = await Trades.aggregate([
    matchStage,
    {
      $project: {
        riskMultiple: {
          $cond: [
            { $eq: ["$riskPercent", 0] },
            0,
            { $divide: ["$pnl", "$riskPercent"] },
          ],
        },
      },
    },
  ]);

  const riskMap = {};
  riskData.forEach(({ riskMultiple }) => {
    const base = Math.floor(riskMultiple * 2) / 2;
    const bin = `${base}-${(base + 0.5).toFixed(1)}`;
    riskMap[bin] = (riskMap[bin] || 0) + 1;
  });

  const riskMultipleDistribution = Object.entries(riskMap).map(
    ([bin, count]) => ({ bin, count }),
  );

  // 6️⃣ Win/Loss by Day
  const winLossByDayAgg = await Trades.aggregate([
    matchStage,
    {
      $project: {
        day: { $dayOfWeek: "$closedAt" },
        outcome: 1,
      },
    },
    {
      $group: {
        _id: "$day",
        win: {
          $sum: { $cond: [{ $eq: ["$outcome", "Win"] }, 1, 0] },
        },
        loss: {
          $sum: { $cond: [{ $eq: ["$outcome", "Loss"] }, 1, 0] },
        },
      },
    },
  ]);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const winLossByDay = winLossByDayAgg.map((d) => ({
    day: days[d._id - 1],
    win: d.win,
    loss: d.loss,
  }));

  // 7️⃣ Win/Loss by Hour
  const winLossByHourAgg = await Trades.aggregate([
    matchStage,
    {
      $project: {
        hour: { $hour: "$closedAt" },
        outcome: 1,
      },
    },
    {
      $group: {
        _id: "$hour",
        win: {
          $sum: { $cond: [{ $eq: ["$outcome", "Win"] }, 1, 0] },
        },
        loss: {
          $sum: { $cond: [{ $eq: ["$outcome", "Loss"] }, 1, 0] },
        },
      },
    },
  ]);

  const winLossByHour = winLossByHourAgg.map((h) => ({
    hour: h._id,
    win: h.win,
    loss: h.loss,
  }));

  return {
    tradeOutcomes,
    monthlyPerformance,
    performanceByInstrument,
    plDistribution,
    riskMultipleDistribution,
    winLossByDay,
    winLossByHour,
  };
}

function computeTraderScore({trades, analytics}) {
  const totalTrades = trades.length;
  const tradeDays = new Set(trades.map(t => t.openedAt.toISOString().split("T")[0]));

  // ----------------------
  // 1️⃣ Consistency: regular trading
  // ----------------------
  const avgTradesPerDay = totalTrades / (tradeDays.size || 1);
  let consistency = Math.min((avgTradesPerDay / 5) * 100, 100); // 5 trades/day = 100%

  // ----------------------
  // 2️⃣ Discipline / Risk Management
  // ----------------------
  const disciplinedTrades = trades.filter(t => t.stopLoss && t.takeProfit).length;
  let riskManagement = (disciplinedTrades / totalTrades) * 100 || 0; // 0-100%

  // ----------------------
  // 3️⃣ Performance: win rate & profit factor
  // ----------------------
  const winRate = analytics?.winRate?.value || 0; // 0-100
  const profitFactor = analytics?.profitFactor?.value || 0;
  // normalize profit factor assuming 2 = 100%
  const normalizedProfitFactor = Math.min((profitFactor / 2) * 100, 100);
  let performance = (winRate + normalizedProfitFactor) / 2;

  // ----------------------
  // 4️⃣ Behavior / Documentation
  // ----------------------
  let consecutiveLosses = 0;
  let maxConsecutiveLosses = 0;
  let chasingLosses = false;
  trades.forEach((t, i) => {
    if (t.pnl < 0) {
      consecutiveLosses++;
      if (consecutiveLosses > maxConsecutiveLosses) maxConsecutiveLosses = consecutiveLosses;
      if (consecutiveLosses >= 2) chasingLosses = true;
    } else consecutiveLosses = 0;
  });
  const overtrading = avgTradesPerDay > 10;

  // Simple behavior scoring
  let behavior = 100;
  if (chasingLosses) behavior -= 25;
  if (overtrading) behavior -= 25;
  behavior = Math.max(behavior, 0);

  // ----------------------
  // Compute overall score
  // ----------------------
  const overallScore = Math.round((consistency + riskManagement + performance + behavior) / 4);

  // ----------------------
  // Return breakdown for frontend
  // ----------------------
  return {
    overallScore, // out of 100
    breakdown: {
      consistency: Math.round(consistency),
      riskManagement: Math.round(riskManagement),
      performance: Math.round(performance),
      behavior: Math.round(behavior),
    },
    meta: {
      totalTrades,
      avgTradesPerDay: avgTradesPerDay.toFixed(1),
      maxConsecutiveLosses,
      chasingLosses,
      overtrading,
    },
  };
}

module.exports = { getEquityCurve, computeAnalytics ,computeTraderScore};
