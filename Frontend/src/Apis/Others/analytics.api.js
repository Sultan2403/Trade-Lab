import api from "../Base/api.client";
import { getAccountId } from "../../Helpers/Accounts/accounts.helper";

const analyticsApi = {
  getEquityCurve: (params) =>
    api.get(`/analytics/equity-curve`, {
      params: {
        ...params,
        accountId: getAccountId(),
      },
    }),

  getAllMetrics: () => api.get("/analytics/", { params: { accountId: getAccountId() } }),
};

export default analyticsApi;
