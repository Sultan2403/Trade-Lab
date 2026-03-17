import dayjs from "dayjs";
import { combineDateAndTime } from "../Utils/timestamps.utils";

export function createInitialTradeUIState() {
  const now = dayjs();

  return {
    pair: "",
    direction: "Long",

    entry_price: "",
    stopLoss: "",
    takeProfit: "",
    size: "",
    riskPercent: "",

    status: "Open",

    exit_price: "",

    openedAt: now,
    closedAt: null,

    timeOpened: now,
    timeClosed: null,

    notes: "",
    chartUrl: "",
    tags: [],
    tagsInput: "",
  };
}

const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const formatDuration = (openedAt, closedAt) => {
  if (!openedAt || !closedAt) return null;

  const start = dayjs(openedAt);
  const end = dayjs(closedAt);

  if (!start.isValid() || !end.isValid()) return null;

  let diffSeconds = Math.max(0, end.diff(start, "second"));

  const hours = Math.floor(diffSeconds / 3600);
  diffSeconds %= 3600;
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes || hours) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
};

const calcPnl = ({ entryPrice, exitPrice, size, direction }) => {
  if (
    !Number.isFinite(entryPrice) ||
    !Number.isFinite(exitPrice) ||
    !Number.isFinite(size)
  ) {
    return null;
  }

  const directionSign = direction === "Short" ? -1 : 1;
  return Number(((exitPrice - entryPrice) * size * directionSign).toFixed(2));
};

const calcRiskToReward = ({ entryPrice, exitPrice, stopLoss }) => {
  if (!Number.isFinite(entryPrice) || !Number.isFinite(exitPrice) || !Number.isFinite(stopLoss)) {
    return null;
  }

  const risk = Math.abs(entryPrice - stopLoss);
  if (risk === 0) return null;

  const reward = Math.abs(exitPrice - entryPrice);
  return Number((reward / risk).toFixed(2));
};

export function normalizeTrade(trade) {
  const openedAt = combineDateAndTime({
    date: trade.openedAt,
    time: trade.timeOpened,
  });

  const isClosed = trade.status === "Closed";

  const closedAt = isClosed
    ? combineDateAndTime({
      date: trade.closedAt,
      time: trade.timeClosed,
    })
    : null;

  const entryPrice = toNumberOrNull(trade.entry_price);
  const exitPrice = isClosed ? toNumberOrNull(trade.exit_price) : null;
  const stopLoss = toNumberOrNull(trade.stopLoss);
  const size = toNumberOrNull(trade.size);

  const pnl = isClosed
    ? calcPnl({
      entryPrice,
      exitPrice,
      size,
      direction: trade.direction,
    })
    : null;

  return {
    pair: trade.pair?.trim().toUpperCase(),
    direction: trade.direction,
    entry_price: entryPrice,
    stopLoss,
    takeProfit: toNumberOrNull(trade.takeProfit),
    size,
    riskPercent: toNumberOrNull(trade.riskPercent),
    status: trade.status,
    exit_price: exitPrice,
    openedAt,
    closedAt,
    duration: isClosed ? formatDuration(openedAt, closedAt) : null,
    pnl,
    outcome: isClosed ? (pnl > 0 ? "Win" : pnl < 0 ? "Loss" : "Breakeven") : null,
    riskToReward: isClosed
      ? calcRiskToReward({
        entryPrice,
        exitPrice,
        stopLoss,
      })
      : null,
    notes: trade.notes || "",
    chartUrl: trade.chartUrl || "",
    tags: trade.tags || [],
  };
}
