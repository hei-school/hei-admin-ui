import Sdk from "casdoor-js-sdk";

export const ServerUrl = process.env.REACT_APP_SERVER_URL;

const sdkConfig = {
  serverUrl: process.env.REACT_APP_CASDOOR_SDK_SERVER_URL,
  clientId: process.env.REACT_APP_CASDOOR_SDK_CLIENT_ID,
  appName: process.env.REACT_APP_CASDOOR_SDK_APP_NAME,
  organizationName: process.env.REACT_APP_CASDOOR_SDK_ORGANIZATION_NAME,
  redirectPath: process.env.REACT_APP_CASDOOR_SDK_REDIRECT_PATH,
};

export const CasdoorSDK = new Sdk(sdkConfig);

export const isLoggedIn = () => {
  const token = sessionStorage.getItem("bearerItem");
  return token !== null && token.length > 0;
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const goToLink = (link) => {
  window.location.href = link;
};

export const getRedirectUrl = () => {
  return fetch(`${ServerUrl}/authentication/login-url`, {
    method: "GET",
  }).then((res) => res.json());
};

export const getUserinfo = () => {
  return fetch(`${ServerUrl}/authentication/userinfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const showMessage = (message) => {
  alert(message);
};
