import {useNotify, UseNotifyOptions} from "@/hooks";
import {Button} from "@mui/material";
import {getRedirectUrl, goToExternalURL} from "./casdoorSetting";

const loginWithCasdoor = (
  notify: (message: string, config?: UseNotifyOptions) => void
) => {
  (async () => {
    try {
      const url = await getRedirectUrl();
      goToExternalURL(url);
    } catch (error) {
      notify("Failed to fetch redirect URL", {type: "error"});
    }
  })();
};

export const CasdoorLoginButton = () => {
  const notify = useNotify();

  return (
    <Button
      fullWidth
      variant="contained"
      data-testid="casdoor-login-btn"
      color="primary"
      onClick={() => loginWithCasdoor(notify)}
    >
      CONNEXION AVEC CASDOOR
    </Button>
  );
};
