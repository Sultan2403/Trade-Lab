const ACCOUNT_ID_KEY = "account_id";

export function getAccountId() {
  return localStorage.getItem(ACCOUNT_ID_KEY);
}

export function setAccountId(newId) {
  localStorage.setItem(ACCOUNT_ID_KEY, newId);
}
