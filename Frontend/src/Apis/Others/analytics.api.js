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

  getAllMetrics: (params) =>
    api.get(`/analytics/all-metrics`, {
      params: {
        ...params,
        accountId: getAccountId(),
      },
    }),
};

export default analyticsApi;
