import { useState } from "react";
import accountsApi from "../Apis/Others/accounts.api";

export default function useAccounts() {
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
    createAccount: (payload) =>
      execute(() => accountsApi.createAccount(payload)),

    getAccountProfile: () =>
      execute(() => accountsApi.getAccountProfile()),

    getAllAccounts: () =>
      execute(() => accountsApi.getAllAccounts()),
  };


  return { data, loading, error, ...methods };
}
