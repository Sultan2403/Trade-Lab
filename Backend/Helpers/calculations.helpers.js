function calculateRiskPercent(trade, accountBalance) {
  if (!trade.stopLoss || !accountBalance) return 0;

  const riskPerUnit = Math.abs(trade.entry_price - trade.stopLoss);
  const riskAmount = riskPerUnit * trade.size; // in quote currency
  const riskPercent = (riskAmount / accountBalance) * 100;

  return Math.max(riskPercent, 0);
}

module.exports = { calculateRiskPercent };
