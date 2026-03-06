import { useState } from "react";
import authApi from "../Apis/Auth/api.auth";

export default function useAuth() {
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
  };

  return { data, loading, error, ...methods };
}
