function calculateRiskPercent({ stopLoss, entry_price, size, accountBalance }) {
  if (!stopLoss || !accountBalance) return null;

  const riskPerUnit = Math.abs(entry_price - stopLoss);
  const riskAmount = riskPerUnit * size;
  const riskPercent = (riskAmount / accountBalance) * 100;

  const result = Math.max(riskPercent, 0);

  return result === 0 ? null : result;
}

function calculateRiskToReward(trade) {
  const { entryPrice, exitPrice, stopLoss } = trade;

  // Required: entry and exit must exist
  if (typeof entryPrice !== "number" || typeof exitPrice !== "number") {
    return null;
  }

  // If stop loss is missing, we cannot calculate R:R reliably
  if (typeof stopLoss !== "number") {
    return null;
  }

  // Calculate risk and reward
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(exitPrice - entryPrice);

  // Avoid division by zero
  if (risk === 0) return null;

  // Risk-to-reward ratio
  const rr = reward / risk;

  // Round to 2 decimal places
  return Number(rr.toFixed(2));
}

module.exports = { calculateRiskPercent, calculateRiskToReward };
