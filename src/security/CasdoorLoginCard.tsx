import defaultCasdoorLogo from "@/assets/casdoor-logo_1185x256.png";
import {Card, CardContent} from "@mui/material";
import Box from "@mui/material/Box";
import {CasdoorLoginButton} from "./CasdoorLoginButton";

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
          <CasdoorLoginButton />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CasdoorLoginCard;
