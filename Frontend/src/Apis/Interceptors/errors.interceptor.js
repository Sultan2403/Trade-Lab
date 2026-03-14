import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../Helpers/Auth/tokens";

const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"];

// Tracks requests currently being retried
const retrySet = new Set();

export default async function handleErrors({ error, apiInstance }) {
  const originalRequest = error.config;

  if (!error.response || !originalRequest) {
    return Promise.reject(error);
  }

  const status = error.response.status;
  const url = originalRequest.url || "";

  // Skip auth routes
  if (AUTH_ROUTES.some((route) => url.includes(route))) {
    return Promise.reject(error);
  }

  // Only care about 401
  if (status !== 401) {
    return Promise.reject(error);
  }

  // Unique request identifier
  const requestId = `${originalRequest.method}:${originalRequest.url}`;

  // Prevent retry loop
  if (retrySet.has(requestId)) {
    return Promise.reject(error);
  }

  retrySet.add(requestId);

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    retrySet.delete(requestId);
    window.location.href = "/login";
    return Promise.reject(error);
  }

  try {
    const { tokens } = await apiInstance.post("/auth/refresh", {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = tokens;

    setAccessToken(accessToken);
    setRefreshToken(newRefreshToken);

    originalRequest.headers.authorization = `Bearer ${accessToken}`;

    const response = await apiInstance(originalRequest);

    retrySet.delete(requestId);

    return response;
  } catch (err) {
    // Refresh failed → force login
    if (err?.response?.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
}
