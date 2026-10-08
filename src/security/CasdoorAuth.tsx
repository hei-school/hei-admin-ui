import {useEffect} from "react";
import {LoadingPage} from "react-admin";
import {useNavigate} from "react-router-dom";
import authProvider from "../providers/authProvider";
import {SERVER_URL} from "./casdoorSetting";
import {consumeRedirectAfterLogin} from "./redirectAfterLogin";

const EXCHANGED_CODE_ITEM = "ha_casdoor_exchanged_code";
// Le code vient de l'URL : on ne le garde en sessionStorage que s'il a la forme
// d'un code d'autorisation Casdoor, pour ne pas y ecrire une valeur arbitraire.
const AUTHORIZATION_CODE_FORMAT = /^[\w-]{1,256}$/;

let inFlightExchange: {code: string; promise: Promise<void>} | null = null;

const exchangeCode = (serverUrl: string, code: string, state: string) => {
  if (inFlightExchange?.code === code) return inFlightExchange.promise;

  const promise = (async () => {
    const bearer = await authProvider.getToken(serverUrl, code, state);
    authProvider.cacheBearer(bearer);
    authProvider.cacheWhoami(await authProvider.whoami());
  })();

  inFlightExchange = {code, promise};
  return promise;
};

const CasdoorAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const navigate = useNavigate();

  useEffect(() => {
    const serverUrl = SERVER_URL;
    if (!code || !state || !serverUrl) return;
    if (!AUTHORIZATION_CODE_FORMAT.test(code)) {
      navigate("/", {replace: true});
      return;
    }

    if (
      sessionStorage.getItem(EXCHANGED_CODE_ITEM) === code &&
      inFlightExchange?.code !== code
    ) {
      navigate("/", {replace: true});
      return;
    }
    sessionStorage.setItem(EXCHANGED_CODE_ITEM, code);
    window.history.replaceState({}, "", window.location.pathname);

    let cancelled = false;
    exchangeCode(serverUrl, code, state)
      .catch((error) => console.error("Error during token fetching:", error))
      .finally(() => {
        if (!cancelled)
          navigate(consumeRedirectAfterLogin() ?? "/", {replace: true});
      });

    return () => {
      cancelled = true;
    };
  }, [code, state, navigate]);

  return (
    <LoadingPage
      loadingPrimary="Chargement"
      loadingSecondary="La page est en cours de chargement, merci de bien vouloir patienter."
    />
  );
};

export default CasdoorAuthCallback;
