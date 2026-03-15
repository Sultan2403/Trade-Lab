import api from "../Base/api.client";
import { getAccountId } from "../../Helpers/Accounts/accounts.helper";

const tradesApi = {
  createTrade: (payload) =>
    api.post("/trades", payload, {
      params: { accountId: getAccountId() },
    }),

  getTrades: (params) =>
    api.get("/trades", {
      params: { ...params, accountId: getAccountId() },
    }),

  getTrade: (id) =>
    api.get(`/trades/${id}`, {
      params: { accountId: getAccountId() },
    }),

  updateTrade: ({ id, payload }) =>
    api.patch(`/trades/${id}`, payload, {
      params: { accountId: getAccountId() },
    }),

  uploadTradesCsv: (csvFile) => {
    const formData = new FormData();
    formData.append("csv-file", csvFile);

    return api.post("/trades/csv-import", formData, {
      params: { accountId: getAccountId() },
    });
  },
};

export default tradesApi;
