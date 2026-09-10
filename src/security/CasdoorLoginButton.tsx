import {useNotify} from "@/hooks";
import {Button} from "@mui/material";
import {useState} from "react";
import {getRedirectUrl, goToExternalURL} from "./casdoorSetting";

export const CasdoorLoginButton = () => {
  const notify = useNotify();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const loginWithCasdoor = async () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    try {
      goToExternalURL(await getRedirectUrl());
    } catch (error) {
      notify("Failed to fetch redirect URL", {type: "error"});
      setIsRedirecting(false);
    }
  };

  return (
    <Button
      fullWidth
      variant="contained"
      data-testid="casdoor-login-btn"
      color="primary"
      disabled={isRedirecting}
      onClick={loginWithCasdoor}
    >
      CONNEXION AVEC CASDOOR
    </Button>
  );
};
