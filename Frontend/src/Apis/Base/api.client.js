import axios from "axios";
import { getAccessToken } from "../../Helpers/Auth/tokens";
import handleErrors from "../Interceptors/errors.interceptor";

const url = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: url,
  timeout: url.includes("localhost") ? 30000 : 60000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    return await handleErrors({error, apiInstance: api}); 
  },
);

export default api;
