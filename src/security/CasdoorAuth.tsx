import {BEARER_ITEM, ID_ITEM, ROLE_ITEM} from "@/providers/authProvider";
import {Whoami} from "@haapi/typescript-client";
import axios from "axios";
import {FC, useEffect} from "react";
import {LoadingPage} from "react-admin";
import {clearToken, goToLink, SERVER_URL, setToken} from "./setting";

const CasdoorAuthCallback: FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  const getToken = async (code: string, state: string) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/authentication/signin`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(BEARER_ITEM)}`,
          },
          params: {code, state},
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
  };

  const cacheWhoami = (whoami: Whoami) => {
    sessionStorage.setItem(ID_ITEM, whoami.id as string);
    sessionStorage.setItem(ROLE_ITEM, whoami.role as string);
    sessionStorage.setItem(BEARER_ITEM, whoami.bearer as string);
  };

  const setSession = async (token: string) => {
    try {
      setToken(token);

      const response = await axios.get(`${SERVER_URL}/whoami`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(BEARER_ITEM)}`,
        },
      });

      const whoami = response.data;
      cacheWhoami(whoami);
      clearToken();
      goToLink("/");
    } catch (error) {
      console.error("Invalid token: ", error);
      clearToken();
      goToLink("/");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (code && state) {
        try {
          const token = await getToken(code, state);

          if (token) {
            setSession(token);
          } else {
            setTimeout(() => {
              goToLink("/login");
            }, 6000);
          }
        } catch (error) {
          console.error("Error during token fetching:", error);
          setTimeout(() => {
            goToLink("/login");
          }, 6000);
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
