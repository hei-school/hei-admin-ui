// The Casdoor login is a full page round trip: the page to come back to is kept in the
// sessionStorage of the tab (which survives the round trip) and read in the callback.
const REDIRECT_AFTER_LOGIN_ITEM = "ha_redirect_after_login";

// Only paths of this app: never an external url (open redirect).
const isInternalPath = (path: string) =>
  path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");

export const rememberRedirectAfterLogin = (path: string) => {
  if (isInternalPath(path)) {
    sessionStorage.setItem(REDIRECT_AFTER_LOGIN_ITEM, path);
  }
};

export const consumeRedirectAfterLogin = (): string | null => {
  const path = sessionStorage.getItem(REDIRECT_AFTER_LOGIN_ITEM);
  sessionStorage.removeItem(REDIRECT_AFTER_LOGIN_ITEM);
  return path && isInternalPath(path) ? path : null;
};
