import { useState } from "react";
import analyticsApi from "../Apis/Others/analytics.api";

export default function useAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      console.error(err, err?.response, err?.data);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const methods = {
    getEquityCurve: (payload) =>
      execute(() => analyticsApi.getEquityCurve(payload)),

    getAllMetrics: (payload) =>
      execute(() => analyticsApi.getAllMetrics(payload)),
  };

  return { data, loading, error, ...methods };
}
