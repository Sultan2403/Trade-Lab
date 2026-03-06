import { getAccessToken, getRefreshToken, setRefreshToken, setAccessToken } from "../../Helpers/Auth/tokens";

export default async function handleErrors({ error, apiInstance }) {
  const originalRequest = error.config;

  // Only handle 401 once per request
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      // Refresh token endpoint
      const { data } = await apiInstance.post(`/auth/refresh`, {
        refreshToken,
      });
      const { accessToken, refreshToken: newRefreshToken } = data.tokens;

      // Save new tokens
      setAccessToken(accessToken);
      setRefreshToken(newRefreshToken);

      // Retry original request with new token
      originalRequest.headers.authorization = `Bearer ${accessToken}`;
      return apiInstance(originalRequest);
    } catch (err) {
      // Refresh failed → force login
      if(err?.response?.status === 401){
        return  window.location.href = "/login";
      }
    
      return Promise.reject(err);
    }
  }

  return Promise.reject(error);
}
