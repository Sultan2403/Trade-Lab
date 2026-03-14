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
    login: (payload) => execute(() => authApi.login(payload)),
    register: (payload) => execute(() => authApi.register(payload)),
    refresh: (payload) =>
      execute(() => authApi.refresh({ refreshToken: payload })),
  };

  return { data, loading, error, ...methods };
}
