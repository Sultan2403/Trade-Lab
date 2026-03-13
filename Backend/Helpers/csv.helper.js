const FIELD_ALIASES = {
  external_id: ["ticket", "order", "id"],
  symbol: ["symbol", "instrument", "pair"],
  side: ["type", "side", "direction"],
  size: ["lots", "volume", "size"],
  entry_price: ["opening_price", "open_price", "price_open"],
  exit_price: ["closing_price", "close_price", "price_close"],
  entry_time: ["opening_time_utc", "open_time", "entry_time"],
  exit_time: ["closing_time_utc", "close_time", "exit_time"],
  pnl: ["profit_usd", "profit", "pnl"],
  commission: ["commission_usd", "commission"],
  swap: ["swap_usd", "swap"],
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

  if (["buy", "long", "0"].includes(s)) return "buy";
  if (["sell", "short", "1"].includes(s)) return "sell";

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

  return {
    external_id: resolveField(normalizedRow, FIELD_ALIASES.external_id),
    symbol: resolveField(normalizedRow, FIELD_ALIASES.symbol),
    side: normalizeSide(resolveField(normalizedRow, FIELD_ALIASES.side)),

    size: Number(resolveField(normalizedRow, FIELD_ALIASES.size)) || 0,

    entry_price: Number(resolveField(normalizedRow, FIELD_ALIASES.entry_price)) || 0,
    exit_price: Number(resolveField(normalizedRow, FIELD_ALIASES.exit_price)) || 0,

    pnl: Number(resolveField(normalizedRow, FIELD_ALIASES.pnl)) || 0,
    commission: Number(resolveField(normalizedRow, FIELD_ALIASES.commission)) || 0,
    swap: Number(resolveField(normalizedRow, FIELD_ALIASES.swap)) || 0,

    entry_time: parseDateToISO(resolveField(normalizedRow, FIELD_ALIASES.entry_time)),
    exit_time: parseDateToISO(resolveField(normalizedRow, FIELD_ALIASES.exit_time)),

    source: "csv",
  };
}

module.exports = {normalizeTrade}