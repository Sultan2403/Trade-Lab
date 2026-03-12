import dayjs from "dayjs";

export function createInitialTradeUIState() {
  const now = dayjs();

  return {
    pair: "",
    direction: "Long",

    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
    positionSize: "",
    riskPercent: 1,

    status: "Open",

    closedPrice: null,

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
