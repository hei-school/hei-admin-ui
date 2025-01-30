import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {
  ServerUrl,
  setToken,
  clearToken,
  goToLink,
  //showMessage,
} from "./setting";
import {Whoami} from "@haapi/typescript-client";
import {LoadingPage} from "react-admin";

const AuthCallback: React.FC = () => {
  const location = useLocation();

  const handleCallback = (code: string, state: string) => {
    return fetch(`${ServerUrl}/api/signin?code=${code}&state=${state}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
  };

  const cacheWhoami = (whoami: Whoami) => {
    sessionStorage.setItem("idItem", whoami.id as string);
    sessionStorage.setItem("roleItem", whoami.role as string);
    sessionStorage.setItem("bearerItem", whoami.bearer as string);
  };

  const setSession = (token: string) => {
    setToken(token);
    fetch(`${ServerUrl}/whoami`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((whoami) => {
        cacheWhoami(whoami);
        clearToken();
        goToLink("/");
      })
      .catch((error) => {
        clearToken();
        goToLink("/");
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    handleCallback(code, state).then((res) => {
      if (res?.status === "ok") {
        setSession(res.data);
      } else {
        //showMessage(res);
      }
    });
  }, [location]);

  return (
    <LoadingPage
      loadingPrimary="Chargement"
      loadingSecondary="La page est en cours de chargement, merci de bien vouloir patienter."
    />
  );
};

export default AuthCallback;
