import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "../Auth/tokens";

export function validateAccessToken() {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false;

    const now = Date.now() / 1000; // JWT exp is in seconds
    return exp > now; // still valid
  } catch (err) {
    return false; // invalid token
  }
}

export default function getUserData() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
