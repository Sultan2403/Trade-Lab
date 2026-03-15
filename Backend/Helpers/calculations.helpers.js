function calculateRiskPercent({ stopLoss, entry_price, size, accountBalance }) {
  if (!stopLoss || !accountBalance) return null;

  const riskPerUnit = Math.abs(entry_price - stopLoss);
  const riskAmount = riskPerUnit * size;
  const riskPercent = (riskAmount / accountBalance) * 100;

  const result = Math.max(riskPercent, 0)


  return result === 0 ? null : result;
}

module.exports = { calculateRiskPercent };
