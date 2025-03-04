import {BEARER_ITEM} from "@/providers/authProvider";
import axios from "axios";
import Sdk from "casdoor-js-sdk";

export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const SDK_CONFIG = {
  serverUrl: process.env.REACT_APP_CASDOOR_SDK_SERVER_URL,
  clientId: process.env.REACT_APP_CASDOOR_SDK_CLIENT_ID,
  appName: process.env.REACT_APP_CASDOOR_SDK_APP_NAME,
  organizationName: process.env.REACT_APP_CASDOOR_SDK_ORGANIZATION_NAME,
  redirectPath: process.env.REACT_APP_CASDOOR_SDK_REDIRECT_PATH,
};

export const CasdoorSDK = new Sdk(SDK_CONFIG);

export const isLoggedIn = () => {
  const token = sessionStorage.getItem(BEARER_ITEM);
  return token !== null && token.length > 0;
};

export const setToken = (token) => {
  localStorage.setItem(BEARER_ITEM, token);
};

export const clearToken = () => {
  localStorage.removeItem(BEARER_ITEM);
};

export const goToLink = (link) => {
  window.location.href = link;
};

export const getRedirectUrl = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/authentication/login-url`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem(BEARER_ITEM);
};

export const showMessage = (message) => {
  alert(message);
};
