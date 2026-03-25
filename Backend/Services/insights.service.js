const crypto = require("crypto");
const { getTradesByPeriod } = require("../Services/trades.service");
const { computeAnalytics } = require("../Services/analytics.service");

// ------------------------
// GET INSIGHTS ENTRY
// ------------------------
const getInsights = async ({ timeframe = 30, accountId }) => {
  const trades = await getTradesByPeriod({ accountId, timeframe });
  const analytics = await computeAnalytics(accountId);

  // Ensure every trade has a reproducible external ID
  trades.forEach((trade) => {
    if (!trade.external_id) trade.external_id = generateExternalId(trade);
  });

  const tradeInsights = generateTradeInsights(trades);
  const analyticsInsights = generateAnalyticsInsights(analytics, trades);
  const combinedInsights = generateCombinedInsights(trades);

  return [...tradeInsights, ...analyticsInsights, ...combinedInsights];
};

// ------------------------
// TRADE & RISK INSIGHTS
// ------------------------
function generateTradeInsights(trades) {
  const insights = [];
  if (!trades.length) return insights;

  let noSLCount = 0;
  let noTPCount = 0;
  let largeLossCount = 0;
  let consecutiveLosses = 0;
  let maxDrawdown = 0;
  let chasingLosses = false;
  const tradesPerDay = {};
  let lastLossIndex = -10;

  trades.forEach((trade, i) => {
    if (!trade.stopLoss) noSLCount++;
    if (!trade.takeProfit) noTPCount++;
    if (trade.pnl < -50) largeLossCount++; // default $50 loss threshold

    // Consecutive losses
    if (trade.pnl < 0) {
      if (i - lastLossIndex === 1) consecutiveLosses++;
      else consecutiveLosses = 1;
      lastLossIndex = i;
      if (consecutiveLosses >= 2) chasingLosses = true;
    } else {
      consecutiveLosses = 0;
    }

    // Drawdown
    if (trade.drawdown) maxDrawdown = Math.max(maxDrawdown, trade.drawdown);

    // Trades per day for overtrading
    const date = trade.openedAt?.toISOString().split("T")[0];
    if (date) tradesPerDay[date] = (tradesPerDay[date] || 0) + 1;
  });

  const total = trades.length;
  const noSLPercent = (noSLCount / total) * 100;
  const noTPPercent = (noTPCount / total) * 100;
  const avgTradesPerDay =
    Object.values(tradesPerDay).reduce((a, b) => a + b, 0) /
      Object.keys(tradesPerDay).length || 0;

  if (noSLPercent > 30)
    insights.push({
      title: "High-risk execution",
      message: `${noSLPercent.toFixed(1)}% of trades have no stop loss. Protect your capital.`,
      tier: 1,
    });

  if (noTPPercent > 30)
    insights.push({
      title: "Many trades without take profit",
      message: `${noTPPercent.toFixed(1)}% of trades have no take profit target.`,
      tier: 2,
    });

  if (largeLossCount > 0)
    insights.push({
      title: "Large losses detected",
      message: `${largeLossCount} trades resulted in significant losses.`,
      tier: 1,
    });

  if (chasingLosses)
    insights.push({
      title: "Chasing losses",
      message: "You’re taking trades after consecutive losses. Pause and reassess.",
      tier: 2,
    });

  if (maxDrawdown > 20)
    insights.push({
      title: "High drawdown",
      message: `Your maximum drawdown is ${maxDrawdown.toFixed(1)}%. Consider risk adjustments.`,
      tier: 1,
    });

  if (avgTradesPerDay > 10)
    insights.push({
      title: "Overtrading",
      message: `Average trades per day is ${avgTradesPerDay.toFixed(
        1
      )}, higher than usual. Risk of mistakes increases.`,
      tier: 2,
    });

  return insights;
}

// ------------------------
// ANALYTICS INSIGHTS
// ------------------------
function generateAnalyticsInsights(analytics, trades) {
  const insights = [];
  const winRate = analytics?.winRate?.value ?? 0;
  const profitFactor = analytics?.profitFactor?.value ?? 0;
  const totalTrades = analytics?.totalTrades?.value ?? trades.length;
  const overallPerformance = analytics?.overallPerformance?.value ?? 1;

  if (winRate < 50)
    insights.push({
      title: "Low win rate",
      message: `Your win rate is ${winRate.toFixed(1)}%.`,
      tier: 1,
    });
  else if (winRate > 70)
    insights.push({
      title: "Strong win rate",
      message: `You are winning ${winRate.toFixed(1)}% of your trades.`,
      tier: 3,
    });

  if (profitFactor > 2)
    insights.push({
      title: "High profitability",
      message: `Profit factor is ${profitFactor.toFixed(2)}.`,
      tier: 3,
    });

  if (totalTrades < 10)
    insights.push({
      title: "Low sample size",
      message: `Only ${totalTrades} trades recorded — insights may be unreliable.`,
      tier: 2,
    });

  if (overallPerformance < 0.5)
    insights.push({
      title: "Strategy underperformance",
      message: "Overall performance is below average. Review your strategy.",
      tier: 1,
    });

  return insights;
}

// ------------------------
// PAIR & SESSION INSIGHTS
// ------------------------
function generateCombinedInsights(trades) {
  const insights = [];
  const pairStats = {};
  const sessionStats = {};

  trades.forEach((trade) => {
    if (!pairStats[trade.pair]) pairStats[trade.pair] = { wins: 0, losses: 0 };
    if (!sessionStats[trade.session]) sessionStats[trade.session] = { wins: 0, losses: 0 };

    if (trade.outcome === "Win") {
      pairStats[trade.pair].wins++;
      sessionStats[trade.session].wins++;
    } else {
      pairStats[trade.pair].losses++;
      sessionStats[trade.session].losses++;
    }
  });

  // PAIR-BASED INSIGHTS
  Object.entries(pairStats).forEach(([pair, { wins, losses }]) => {
    const total = wins + losses;
    if (total >= 5) {
      const lossRate = (losses / total) * 100;
      if (lossRate > 60)
        insights.push({
          title: `Poor performance on ${pair}`,
          message: `You lose ${lossRate.toFixed(1)}% of trades on ${pair}.`,
          tier: 1,
        });
    }
  });

  // SESSION-BASED INSIGHTS
  Object.entries(sessionStats).forEach(([session, { wins, losses }]) => {
    const total = wins + losses;
    if (total >= 5) {
      const winRate = (wins / total) * 100;
      if (winRate < 40)
        insights.push({
          title: `Weak performance during ${session}`,
          message: `Win rate is ${winRate.toFixed(1)}% in this session.`,
          tier: 2,
        });
      if (winRate > 70)
        insights.push({
          title: `High probability session`,
          message: `Win rate is ${winRate.toFixed(1)}% in this session.`,
          tier: 3,
        });
    }
  });

  return insights;
}

module.exports = { getInsights };