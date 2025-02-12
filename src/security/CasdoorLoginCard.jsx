import {Card, CardContent} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {getRedirectUrl, goToLink, showMessage} from "./setting";

const casdoorLogin = () => {
  getRedirectUrl().then((res) => {
    if (res?.status === "ok") {
      goToLink(res.data);
    } else {
      showMessage("failed to get redirect url");
    }
  });
};

const CasdoorLoginCard = () => {
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
        <Box display="flex" justifyContent="center" mb={2}></Box>
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
              src="https://cdn.casbin.org/img/casdoor-logo_1185x256.png"
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
            color="primary"
            onClick={() => casdoorLogin()}
          >
            CONNEXION AVEC CASDOOR
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CasdoorLoginCard;
