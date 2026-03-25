const {
  calculateTradeDuration,
} = require("./calculations.helpers");

const FIELD_ALIASES = {
  external_id: ["ticket", "order", "id", "position id", "trade id"],

  symbol: ["symbol", "instrument", "pair", "market", "asset"],

  side: [
    "type",
    "side",
    "direction",
    "opening direction",
    "position",
    "order type",
    "trade type",
  ],

  stop_loss: ["stop_loss", "sl", "stoploss"],
  take_profit: ["take_profit", "tp", "takeprofit"],

  size: [
    "lots",
    "lot",
    "volume",
    "size",
    "quantity",
    "closing quantity",
    "position size",
    "trade size",
  ],

  entry_price: [
    "opening_price",
    "open_price",
    "price_open",
    "entry price",
    "entry_price",
    "open",
    "price",
    "buy price",
    "sell price",
  ],

  exit_price: [
    "closing_price",
    "close_price",
    "price_close",
    "closing price",
    "exit price",
    "exit_price",
    "close",
  ],

  entry_time: [
    "opening_time_utc",
    "open_time",
    "entry_time",
    "opening time",
    "opening time (utc+1)",
    "open time",
    "date",
    "time",
  ],

  exit_time: [
    "closing_time_utc",
    "close_time",
    "exit_time",
    "closing time",
    "closing time (utc+1)",
    "close time",
  ],

  pnl: [
    "profit_usd",
    "profit",
    "pnl",
    "net usd",
    "net profit",
    "profit/loss",
    "pl",
    "gain",
  ],

  commission: ["commission_usd", "commission", "fee", "fees"],

  swap: ["swap_usd", "swap", "rollover", "swap fee"],
};

function normalizeKeys(row) {
  const normalized = {};

  for (const key in row) {
    normalized[key.toLowerCase().trim()] = row[key];
  }

  return normalized;
}

function resolveField(row, aliases) {
  for (const alias of aliases) {
    if (row[alias] !== undefined) {
      return row[alias];
    }
  }

  return undefined;
}

function normalizeSide(side) {
  if (!side) return null;

  const s = side.toLowerCase();

  if (["buy", "long", "0"].includes(s)) return "Long";
  if (["sell", "short", "1"].includes(s)) return "Short";

  return s;
}

function parseDateToISO(value) {
  if (!value) return null;

  let date;

  // numeric timestamp
  if (!isNaN(value)) {
    const num = Number(value);
    date = num < 1e12 ? new Date(num * 1000) : new Date(num); // seconds vs milliseconds
  } else {
    // ISO or other string
    date = new Date(value);
  }

  // invalid date check
  if (isNaN(date.getTime())) return null;

  // always return ISO string
  return date.toISOString();
}

function normalizeTrade(row) {
  const normalizedRow = normalizeKeys(row);

  const side = normalizeSide(resolveField(normalizedRow, FIELD_ALIASES.side));

  const entryTime = parseDateToISO(
    resolveField(normalizedRow, FIELD_ALIASES.entry_time),
  );

  const exitTime = parseDateToISO(
    resolveField(normalizedRow, FIELD_ALIASES.exit_time),
  );

  const stopLoss =
    Number(resolveField(normalizedRow, FIELD_ALIASES.stop_loss)) || null;

  const takeProfit =
    Number(resolveField(normalizedRow, FIELD_ALIASES.take_profit)) || null;

  const status = exitTime ? "Closed" : "Open";
  const openedAt = entryTime;
  const closedAt = exitTime;
  return {
    external_id: resolveField(normalizedRow, FIELD_ALIASES.external_id),
    pair: resolveField(normalizedRow, FIELD_ALIASES.symbol)?.toUpperCase(),

    direction: side,

    size: Number(resolveField(normalizedRow, FIELD_ALIASES.size)) || 0,

    entry_price:
      Number(resolveField(normalizedRow, FIELD_ALIASES.entry_price)) || 0,

    exit_price:
      Number(resolveField(normalizedRow, FIELD_ALIASES.exit_price)) || null,

    openedAt,
    closedAt,

    duration: calculateTradeDuration(openedAt, closedAt),

    stopLoss,
    takeProfit,

    status,
    pnl: Number(resolveField(normalizedRow, FIELD_ALIASES.pnl)) || 0,

    metadata: {
      commission:
        Number(resolveField(normalizedRow, FIELD_ALIASES.commission)) || 0,
      swap: Number(resolveField(normalizedRow, FIELD_ALIASES.swap)) || 0,
      source: "csv-import",
    },
  };
}

module.exports = { normalizeTrade };
