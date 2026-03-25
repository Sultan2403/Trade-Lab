import api from "../Base/api.client";
import { getAccountId } from "../../Helpers/Accounts/accounts.helper";

const insightsApi = {
  getInsights: () => {
    return api.get("/insights", {
      params: { accountId: getAccountId() },
    });
  },
};

export default insightsApi;
