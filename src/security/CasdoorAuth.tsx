import {Whoami} from "@haapi/typescript-client";
import {FC, useEffect} from "react";
import {LoadingPage} from "react-admin";
import {clearToken, goToLink, ServerUrl, setToken} from "./setting";

const CasdoorAuthCallback: FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  const getToken = (code: string, state: string) => {
    return fetch(
      `${ServerUrl}/authentication/signin?code=${code}&state=${state}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  };

  const cacheWhoami = (whoami: Whoami) => {
    sessionStorage.setItem("idItem", whoami.id as string);
    sessionStorage.setItem("roleItem", whoami.role as string);
    sessionStorage.setItem("token", whoami.bearer as string);
  };

  const setSession = async (token: string) => {
    try {
      setToken(token);

      const response = await fetch(`${ServerUrl}/whoami`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const whoami = await response.json();
      cacheWhoami(whoami);
      clearToken();
      goToLink("/");
    } catch (error) {
      console.error(error);
      clearToken();
      goToLink("/");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (code && state) {
        try {
          const tokenRes = await getToken(code, state);

          if (tokenRes.ok) {
            const token = await tokenRes.text();
            setSession(token);
          } else {
            setTimeout(() => {
              goToLink("/login");
            }, 6000);
          }
        } catch (error) {
          console.error("Error during token fetching:", error);
        }
      }
    };

    fetchData();
  }, [code, state]);

  return (
    <LoadingPage
      loadingPrimary="Chargement"
      loadingSecondary="La page est en cours de chargement, merci de bien vouloir patienter."
    />
  );
};

export default CasdoorAuthCallback;
