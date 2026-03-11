const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return Number.NaN;
  }

  return Number(value);
};

const hasPrecision = (value, maxDecimalPlaces) => {
  const [, decimals = ""] = String(value).split(".");
  return decimals.length <= maxDecimalPlaces;
};

export function validateTradeCreate(trade) {
  const errors = {};

  if (!trade?.pair?.trim()) {
    errors.pair = "Instrument/Pair is required";
  }

  const entryPrice = toNumber(trade?.entryPrice);
  if (Number.isNaN(entryPrice)) {
    errors.entryPrice = "Entry price is required";
  } else if (!hasPrecision(trade.entryPrice, 5)) {
    errors.entryPrice = "Entry price supports up to 5 decimal places";
  }

  const stopLoss = toNumber(trade?.stopLoss);
  if (Number.isNaN(stopLoss)) {
    errors.stopLoss = "Stop loss is required";
  } else if (!hasPrecision(trade.stopLoss, 5)) {
    errors.stopLoss = "Stop loss supports up to 5 decimal places";
  }

  const takeProfit = toNumber(trade?.takeProfit);
  if (Number.isNaN(takeProfit)) {
    errors.takeProfit = "Take profit is required";
  } else if (!hasPrecision(trade.takeProfit, 5)) {
    errors.takeProfit = "Take profit supports up to 5 decimal places";
  }

  const positionSize = toNumber(trade?.positionSize);
  if (Number.isNaN(positionSize)) {
    errors.positionSize = "Position size is required";
  } else if (!hasPrecision(trade.positionSize, 2)) {
    errors.positionSize = "Position size supports up to 2 decimal places";
  }

  const riskPercent = toNumber(trade?.riskPercent);
  if (Number.isNaN(riskPercent)) {
    errors.riskPercent = "Risk percent is required";
  } else if (riskPercent < 0.01) {
    errors.riskPercent = "Risk percent must be at least 0.01";
  }

  if (trade?.status && !["Open", "Closed"].includes(trade.status)) {
    errors.status = "Status must be either open or closed";
  }

  if (trade?.tags && !Array.isArray(trade.tags)) {
    errors.tags = "Tags must be an array of strings";
  }

  return errors;
}
