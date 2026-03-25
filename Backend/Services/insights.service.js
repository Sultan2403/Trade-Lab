const { getTradesByPeriod } = require("../Services/trades.service");
const { computeAnalytics } = require("../Services/analytics.service");

const getInsights = async ({ timeframe, accountId }) => {
  const trades = await getTradesByPeriod({ accountId, timeframe });
  const analytics = await computeAnalytics(accountId);

  const tradeInsights = generateTradeInsights(trades);
  console.log(trades);
  const analyticsInsights = generateAnalyticsInsights(analytics);
  const combinedInsights = generateCombinedInsights(trades);

  return [...tradeInsights, ...analyticsInsights, ...combinedInsights];
};

function generateTradeInsights(trades) {
  const insights = [];

  let noSLCount = 0;
  let largeLossCount = 0;

  for (const trade of trades) {
    if (!trade.stopLoss) noSLCount++;

    if (trade.pnl < -50) largeLossCount++;
  }

  const total = trades.length;

  if (total === 0) return insights;

  const noSLPercent = (noSLCount / total) * 100;

  if (noSLPercent > 30) {
    insights.push({
      title: "High-risk execution",
      message: `You're flying blind. ${noSLPercent.toFixed(1)}% of your trades have no stop loss. Protect your capital with a stop loss`,
      tier: "red",
    });
  }

  if (largeLossCount > 0) {
    insights.push({
      title: "Large losses detected",
      message: `${largeLossCount} trades resulted in significant losses`,
      tier: "yellow",
    });
  }

  return insights;
}

function generateAnalyticsInsights(analytics) {
  const insights = [];

  const winRate = analytics?.winRate?.value;
  const profitFactor = analytics?.profitFactor?.value;
  const totalTrades = analytics?.totalTrades?.value;
  console.log(analytics);

  if (winRate !== null && winRate !== undefined) {
    if (winRate < 50) {
      insights.push({
        title: "Low win rate",
        message: `Your win rate is ${winRate.toFixed(1)}%`,
        tier: "red",
      });
    } else if (winRate > 70) {
      insights.push({
        title: "Strong win rate",
        message: `You are winning ${winRate.toFixed(1)}% of your trades`,
        tier: "green",
      });
    }
  }

  if (profitFactor && profitFactor > 2) {
    insights.push({
      title: "High profitability",
      message: `Profit factor is ${profitFactor.toFixed(2)}`,
      tier: "green",
    });
  }

  if (totalTrades && totalTrades < 10) {
    insights.push({
      title: "Low sample size",
      message: `Only ${totalTrades} trades recorded — insights may be unreliable`,
      tier: "yellow",
    });
  }

  return insights;
}

function generateCombinedInsights(trades) {
  const insights = [];

  const pairStats = {};
  const sessionStats = {};

  for (const trade of trades) {
    // PAIR STATS
    if (!pairStats[trade.pair]) {
      pairStats[trade.pair] = { wins: 0, losses: 0 };
    }

    if (trade.outcome === "Win") {
      pairStats[trade.pair].wins++;
    } else {
      pairStats[trade.pair].losses++;
    }

    // SESSION STATS (if exists)
    if (trade.session) {
      if (!sessionStats[trade.session]) {
        sessionStats[trade.session] = { wins: 0, losses: 0 };
      }

      if (trade.outcome === "Win") {
        sessionStats[trade.session].wins++;
      } else {
        sessionStats[trade.session].losses++;
      }
    }
  }

  // PAIR INSIGHTS
  for (const pair in pairStats) {
    const { wins, losses } = pairStats[pair];
    const total = wins + losses;

    if (total < 5) continue;

    const lossRate = (losses / total) * 100;

    if (lossRate > 60) {
      insights.push({
        title: `Poor performance on ${pair}`,
        message: `You lose ${lossRate.toFixed(1)}% of trades on ${pair}`,
        tier: "red",
      });
    }
  }

  // SESSION INSIGHTS
  for (const session in sessionStats) {
    const { wins, losses } = sessionStats[session];
    const total = wins + losses;

    if (total < 5) continue;

    const winRate = (wins / total) * 100;

    if (winRate < 40) {
      insights.push({
        title: `Weak performance during ${session}`,
        message: `Win rate is ${winRate.toFixed(1)}% in this session`,
        tier: "yellow",
      });
    }
  }

  return insights;
}

module.exports = { getInsights };
