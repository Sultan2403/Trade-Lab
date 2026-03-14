import api from "../Base/api.client";
import { getAccountId } from "../../Helpers/Accounts/accounts.helper";


const accountApi = {
  createAccount: (payload) => api.post("/accounts", payload),

  getAccountProfile: () =>
    api.get(`/accounts/${getAccountId()}`),

  getAllAccounts: () =>
    api.get("/accounts"),
};

export default accountApi