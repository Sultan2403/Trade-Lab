import { useState } from "react";
import insightsApi from "../Apis/Others/insights.api";

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
    getInsights: () => execute(() => insightsApi.getInsights()),
  };

  return { data, loading, error, ...methods };
}
