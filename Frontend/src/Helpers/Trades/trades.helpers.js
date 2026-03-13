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
    riskPercent: 1,

    status: "Open",

    exit_price: null,

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

export function normalizeTrade(trade) {
  return {
    ...trade,
    
    openedAt: combineDateAndTime({
      date: trade.openedAt,
      time: trade.timeOpened,
    }),
    closedAt: combineDateAndTime({
      date: trade.closedAt,
      time: trade.timeClosed,
    }),
  };
}
