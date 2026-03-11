// UI state ready for AddTrade
export function createInitialTradeUIState() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return {
    pair: "",
    direction: "Long",

    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    positionSize: 0,
    riskPercent: 0,

    status: "Open",

    closedPrice: null,
    closedAt: "",
    openedAt: today,
    timeOpened: new Date().toTimeString().slice(0, 5), // HH:MM
    timeClosed: "",

    notes: "",
    chartUrl: "",
    tags: [],
    tagsInput: "",
  };
}
