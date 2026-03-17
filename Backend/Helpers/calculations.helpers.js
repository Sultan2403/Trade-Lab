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

/**
 * Calculate trade duration in a human-readable format
 * @param {string | Date} openedAt - ISO string or Date of trade open
 * @param {string | Date} closedAt - ISO string or Date of trade close
 * @returns {string} e.g. "0h 34m 12s"
 */
function calculateTradeDuration(openedAt, closedAt) {
  if (!openedAt || !closedAt) return "--"

  const start = new Date(openedAt);
  const end = new Date(closedAt);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "--";

  let diffMs = end - start; // difference in milliseconds
  if (diffMs < 0) diffMs = 0;

  const hours = Math.floor(diffMs / 1000 / 60 / 60);
  const minutes = Math.floor((diffMs / 1000 / 60) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes || hours) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}


module.exports = {calculateTradeDuration, calculateRiskPercent, calculateRiskToReward };
