import {Whoami} from "@haapi/typescript-client";
import React, {useEffect} from "react";
import {LoadingPage} from "react-admin";
import {clearToken, goToLink, ServerUrl, setToken} from "./setting";

const AuthCallback: React.FC = () => {
  const handleCallback = (code: string, state: string) => {
    return fetch(
      `${ServerUrl}/authentication/casdoor/signin?code=${code}&state=${state}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((res) => res.json());
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
        setTimeout(() => {
          goToLink("/login");
        }, 6000);
      }
    });
  }, []);

  return (
    <LoadingPage
      loadingPrimary="Chargement"
      loadingSecondary="La page est en cours de chargement, merci de bien vouloir patienter."
    />
  );
};

export default AuthCallback;
