function calculateRiskPercent({ stopLoss, entry_price, size, accountBalance }) {
  if (!stopLoss || !accountBalance) return 0;

  const riskPerUnit = Math.abs(entry_price - stopLoss);
  const riskAmount = riskPerUnit * size;
  const riskPercent = (riskAmount / accountBalance) * 100;

  return Math.max(riskPercent, 0);
}

module.exports = { calculateRiskPercent };
