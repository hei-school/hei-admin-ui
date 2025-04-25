import {FC, useEffect, useRef} from "react";
import {LoadingPage} from "react-admin";
import authProvider from "../providers/authProvider";
import {goToLink, SERVER_URL} from "./casdoorSetting";

const CasdoorAuthCallback: FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const isExchanged = useRef(false);
  const whoami = authProvider.whoami();

  useEffect(() => {
    const fetchData = async () => {
      if (code && state && !isExchanged.current) {
        isExchanged.current = true;
        try {
          const token = await authProvider.getToken(SERVER_URL, code, state);
          authProvider.cacheWhoami({bearer: token});
          await whoami.then((whoami) => authProvider.cacheWhoami(whoami));
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
