import api from "../Base/api.client";

const tradesApi = {
  createTrade: (payload) => api.post("/trades", payload),
  getTrades: (params) => api.get("/trades", { params }),
  getTrade: (id) => api.get(`/trades/${id}`),
  updateTrade: ({ id, payload }) => api.patch(`/trades/${id}`, payload),
  deleteTrade: (id) => api.delete(`/trades/${id}`),
};

export default tradesApi;
