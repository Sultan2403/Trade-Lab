export function validateTradeCreate(trade) {
  const errors = {};

  if (!trade.pair) {
    errors.pair = "Instrument/Pair is required";
  }

  if (!Number.isFinite(trade.entry_price)) {
    errors.entry_price = "Entry price is required";
  }

  if (!Number.isFinite(trade.stopLoss)) {
    errors.stopLoss = "Stop loss is required";
  }

  if (!Number.isFinite(trade.takeProfit)) {
    errors.takeProfit = "Take profit is required";
  }

  if (!Number.isFinite(trade.size)) {
    errors.size = "Position size is required";
  }

  if (!Number.isFinite(trade.riskPercent)) {
    errors.riskPercent = "Risk percent is required";
  } else if (trade.riskPercent < 0.01) {
    errors.riskPercent = "Risk percent must be at least 0.01";
  }

  if (!trade.openedAt) {
    errors.openedAt = "Open time is required";
  }

  if (trade.status === "Closed") {
    if (!trade.closedAt) {
      errors.closedAt = "Close time is required";
    }

    if (!Number.isFinite(trade.exit_price)) {
      errors.exit_price = "Exit Price is required";
    }
  }

  if (trade.closedAt && trade.openedAt) {
    if (new Date(trade.closedAt) < new Date(trade.openedAt)) {
      errors.closedAt = "Close time cannot be before open time";
    }
  }

  if (trade.direction === "Long") {
    if (trade.stopLoss >= trade.entry_price) {
      errors.stopLoss = "Stop loss must be below entry for long trades";
    }

    if (trade.takeProfit <= trade.entry_price) {
      errors.takeProfit = "Take profit must be above entry for long trades";
    }
  }

  if (trade.direction === "Short") {
    if (trade.stopLoss <= trade.entry_price) {
      errors.stopLoss = "Stop loss must be above entry for short trades";
    }

    if (trade.takeProfit >= trade.entry_price) {
      errors.takeProfit = "Take profit must be below entry for short trades";
    }
  }

  if (trade.tags && trade.tags.length > 10) {
    errors.tags = "Maximum number of tags is 10";
  }

  if (trade.notes.length > 500) {
    errors.notes = "Maximum of 500 characters exceeded";
  }

  return errors;
}
