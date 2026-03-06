const ACCESS_TOKEN_KEY = "access-token";
const REFRESH_TOKEN_KEY = "refresh-token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAccessToken(data) {
  localStorage.setItem(ACCESS_TOKEN_KEY, data);
}

export function setRefreshToken(data) {
  localStorage.setItem(REFRESH_TOKEN_KEY, data);
}
