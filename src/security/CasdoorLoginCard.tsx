import defaultCasdoorLogo from "@/assets/casdoor-logo_1185x256.png";
import {useNotify, UseNotifyOptions} from "@/hooks";
import {Card, CardContent} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useEffect} from "react";
import {useCheckAuth} from "react-admin";
import {getRedirectUrl, goToLink} from "./setting";

const loginWithCasdoor = (
  notify: (message: string, config?: UseNotifyOptions) => void
) => {
  (async () => {
    try {
      const url = await getRedirectUrl();
      goToLink(url);
    } catch (error) {
      notify("Failed to fetch redirect URL", {type: "error"});
    }
  })();
};

const CasdoorLoginCard = () => {
  const notify = useNotify();
  const checkAuth = useCheckAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth({}, false);
        // already authenticated, redirect to the home page
        goToLink("/");
      } catch (error) {
        notify("Authentication check failed", {type: "error"});
        // not authenticated, stay on the login page
      }
    };

    verifyAuth();
  }, [checkAuth]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      marginTop="10%"
    >
      <Card
        sx={{
          width: 300,
          p: 3,
          bgcolor: "rgba(255, 255, 255, 1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Box
            sx={{
              width: 300,
              height: 64,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={defaultCasdoorLogo}
              alt="Logo"
              style={{
                width: 240,
                height: 52,
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>
        <CardContent>
          <Button
            fullWidth
            variant="contained"
            data-testid="casdoor-login-btn"
            color="primary"
            onClick={() => loginWithCasdoor(notify)}
          >
            CONNEXION AVEC CASDOOR
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CasdoorLoginCard;
