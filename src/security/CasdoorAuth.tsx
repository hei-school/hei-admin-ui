import authProvider, {
  BEARER_ITEM,
  ID_ITEM,
  ROLE_ITEM,
} from "@/providers/authProvider";
import {Whoami} from "@haapi/typescript-client";
import axios from "axios";
import {FC, useEffect} from "react";
import {LoadingPage} from "react-admin";
import {goToLink, SERVER_URL} from "./setting";

const CasdoorAuthCallback: FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const whoami = authProvider.whoami();

  const getToken = async (code: string, state: string) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/authentication/signin`,
        null,
        {
          params: {code, state},
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
  };

  const cacheWhoami = (whoami: Whoami): void => {
    sessionStorage.setItem(ID_ITEM, whoami.id as string);
    sessionStorage.setItem(ROLE_ITEM, whoami.role as string);
    sessionStorage.setItem(BEARER_ITEM, whoami.bearer as string);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (code && state) {
        try {
          const token = await getToken(code, state);
          cacheWhoami({bearer: token});
          await whoami.then((whoami) => cacheWhoami(whoami));
        } catch (error) {
          console.error("Error during token fetching:", error);
        } finally {
          goToLink("/");
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
