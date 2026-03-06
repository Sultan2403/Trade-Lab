import api from "../Base/api.client";
import z from '../Base/api.client'

const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  refresh: (payload) => api.post("/auth/refresh", payload),
};

export default authApi;
