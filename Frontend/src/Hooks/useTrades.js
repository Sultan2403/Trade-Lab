import { useState } from "react";
import tradesApi from "../Apis/Others/trades.api"

export default function useTrades() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      setData(response);
    } catch (err) {
      setError(err);
      console.error(err, err?.response, err?.data);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const methods = {
    createTrade: (payload) => execute(() => tradesApi.createTrade(payload)),

    getTrades: (params) => execute(() => tradesApi.getTrades(params)),

    getTrade: (id) => execute(() => tradesApi.getTrade(id)),

    updateTrade: ({ id, payload }) =>
      execute(() => tradesApi.updateTrade({ id, payload })),

    deleteTrade: (id) => execute(() => tradesApi.deleteTrade(id)),

    uploadCsvTrades: (csvFile) => execute(() => tradesApi.uploadTradesCsv(csvFile)),
  };

  return { data, loading, error, ...methods };
}
