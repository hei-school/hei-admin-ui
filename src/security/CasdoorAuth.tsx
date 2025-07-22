import {Card} from "@mui/material";
import {useEffect, useRef} from "react";
import {LoadingPage} from "react-admin";
import {useNavigate} from "react-router-dom";
import authProvider from "../providers/authProvider";
import {SERVER_URL} from "./casdoorSetting";

const CasdoorAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const isExchanged = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (code && state && !isExchanged.current && SERVER_URL) {
        isExchanged.current = true;
        try {
          const token = await authProvider.getToken(SERVER_URL, code, state);
          authProvider.cacheWhoami({bearer: token});
        } catch (error) {
          console.error("Error during token fetching:", error);
        } finally {
          navigate("/");
        }
      }
    })();
  }, [code, navigate, state]);

  return (
    <Card
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingPage
        loadingPrimary="Chargement"
        loadingSecondary="La page est en cours de chargement, merci de bien vouloir patienter."
      />
    </Card>
  );
};

export default CasdoorAuthCallback;
