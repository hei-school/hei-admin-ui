import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Button as MuiButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {isSilentSigninRequired, SilentSignin} from "casdoor-react-sdk";
import {useState} from "react";
import {Login} from "react-admin";
import {mainTheme} from "../haTheme";
import authProvider from "../providers/authProvider";
import CompletePasswordPage from "./CompletePasswordPage";
import ConfirmForgotPassword from "./ConfirmForgotPassword";
import ForgotPassword from "./ForgotPassword";
import {
  CasdoorSDK,
  getRedirectUrl,
  goToLink,
  isLoggedIn,
  showMessage,
} from "./setting";

const casdoorLogin = () => {
  getRedirectUrl().then((res) => {
    if (res?.status === "ok") {
      goToLink(res.data);
    } else {
      showMessage("failed to get redirect url");
    }
  });
};

const aCard = (title, subtitle, description1, description2, course) => {
  const syllabus =
    "https://drive.google.com/file/d/12Lc4o3jfQOFHIzazPToO2hnGZc8epU3I/view";

  if (isSilentSigninRequired()) {
    return (
      <div style={{marginTop: 200, textAlign: "center", alignItems: "center"}}>
        <SilentSignin
          sdk={CasdoorSDK}
          isLoggedIn={isLoggedIn}
          handleReceivedSilentSigninSuccessEvent={() => goToLink("/")}
          handleReceivedSilentSigninFailureEvent={() => {}}
        />
        <p>Logging in...</p>
      </div>
    );
  }

  return (
    <Card style={{backgroundColor: "#ffffff", opacity: 0.9}}>
      <CardContent>
        <Typography variant="h3" color="primary">
          {title}
        </Typography>
        <Typography variant="h5" color="primary">
          {subtitle}
        </Typography>
        <Typography variant="h7" color="initial">
          {description1}
          <br />
          {description2}
        </Typography>
        <Typography variant="h8" color="initial">
          <p>
            Cours :{" "}
            <a href={syllabus} style={{color: "#000000"}}>
              {course}
            </a>
          </p>
        </Typography>
      </CardContent>
    </Card>
  );
};

const HaLoginPage = () => {
  const [username, setUsername] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [confirm, setConfirm] = useState(true);

  const displayFull = useMediaQuery(
    "(min-width:1024px) and (min-height:768px)"
  );
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 325,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    justifyItems: "center",
  };
  const ResponsiveLogin = () => {
    return (
      <Grid container xs={12}>
        <Grid
          xs={displayFull ? 4 : 12}
          sx={{
            width: "inherit",
            display: "flex",
            justifyContent: "center",
          }}
          position={"absolute"}
        >
          <Login
            backgroundImage={null}
            style={{backgroundImage: "inherit", position: "relative"}}
          />
        </Grid>
        <Grid
          xs={displayFull ? 4 : 12}
          sx={{
            width: "inherit",
            display: "flex",
            justifyContent: "center",
            bottom: 100,
          }}
          position={"absolute"}
        >
          <Button
            onClick={() => setOpenModal(true)}
            align="center"
            sx={{
              color: "white",
            }}
          >
          </Button>
            <MuiButton
              onClick={() => casdoorLogin()}
              variant="contained"
              color="secondary"
              data-testid="casdoor-login-btn"
              style={{
                display: "flex",
                justifySelf: "center",
                margin: "2em 0 0 0",
                color: "white",
              }}
            >
              {/* <img
                style={{width: 27, height: 27}}
                src="data:image/jpeg;base64,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"
              /> */}
              Casdoor connexion
            </MuiButton>
        </Grid>
      </Grid>
    );
  };
  const ResponsiveCompletePassword = () => (
    <CompletePasswordPage style={{backgroundImage: "inherit"}} />
  );
  const PasswordChangeableLogin = () =>
    authProvider.isTemporaryPassword() ? (
      <ResponsiveCompletePassword />
    ) : (
      <ResponsiveLogin />
    );

  return (
    <div
      style={{
        backgroundImage: "url(/login-bg100k.jpg)",
        backgroundSize: "cover",
        position: "fixed",
        padding: "0",
        margin: "0",
        width: "100%",
        height: "100%",
      }}
    >
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={style}>
          {confirm ? (
            <ConfirmForgotPassword
              username={username}
              setUsername={setUsername}
              setConfirm={setConfirm}
            />
          ) : (
            <ForgotPassword username={username} setOpenModal={setOpenModal} />
          )}
        </Box>
      </Modal>
      {displayFull ? (
        <Grid
          container
          spacing={2}
          style={{paddingTop: "10%"}}
          theme={mainTheme}
        >
          <Grid item xs={4}>
            <Typography variant="h3" align="center">
              <div style={{color: "#ffc107"}}>HEI</div>
            </Typography>
            <Typography variant="h7" align="center">
              <div style={{color: "#ffffff"}}>
                Une scolarité qui passe à l'échelle
              </div>
            </Typography>{" "}
            <PasswordChangeableLogin />
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={1}>
              <Grid item xs={1} />
              <Grid item xs={5}>
                {aCard(
                  "0",
                  "Coût à l'arrêt",
                  "Personne ne se connecte ?",
                  "Alors personne ne paie.",
                  "SYS-2"
                )}
              </Grid>
              <Grid item xs={4}>
                {aCard(
                  "0",
                  "Vulnérabilité",
                  "Crashtest nous scanne,",
                  "mais ne trouve rien !",
                  "WEB-2"
                )}
              </Grid>
              <Grid item xs={2} />

              <Grid item xs={1} />
              <Grid item xs={5}>
                {aCard(
                  "250,000,000",
                  "Utilisateurs",
                  "Onboarder tout Madagascar ?",
                  "Dix fois sans problème.",
                  "DONNEES-2"
                )}
              </Grid>
              <Grid item xs={4}>
                {aCard(
                  "1",
                  "Seconde",
                  "Pire réponse de notre API",
                  "au percentile 97.",
                  "PROG-2"
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <PasswordChangeableLogin />
      )}
    </div>
  );
};

export default HaLoginPage;
