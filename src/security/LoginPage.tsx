import {
  Card,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import authProvider from "../providers/authProvider";
import CasdoorLoginCard from "./CasdoorLoginCard";

const aCard = (
  title: string,
  subtitle: string,
  description1: string,
  description2: string,
  course: string
) => {
  const syllabus =
    "https://drive.google.com/file/d/12Lc4o3jfQOFHIzazPToO2hnGZc8epU3I/view";

  return (
    <Card style={{backgroundColor: "#ffffff", opacity: 0.9}}>
      <CardContent>
        <Typography variant="h3" color="primary">
          {title}
        </Typography>
        <Typography variant="h5" color="primary">
          {subtitle}
        </Typography>
        <Typography variant="inherit" component="span" color="initial">
          {description1}
          <br />
          {description2}
        </Typography>
        <Typography variant="inherit" component="span" color="initial">
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

interface DisplayFullProps {
  displayFull: boolean;
}

const ResponsiveLogin = ({displayFull}: Readonly<DisplayFullProps>) => (
  <Grid container item xs={12}>
    <Grid
      item
      xs={displayFull ? 4 : 12}
      sx={{
        width: "inherit",
        display: "flex",
        justifyContent: "center",
      }}
      position={"absolute"}
    >
      <CasdoorLoginCard />
    </Grid>
  </Grid>
);

const ResponsiveCompletePassword = () => <Grid container item xs={12} />;

const PasswordChangeableLogin = ({displayFull}: Readonly<DisplayFullProps>) =>
  authProvider.isTemporaryPassword() ? (
    <ResponsiveCompletePassword />
  ) : (
    <ResponsiveLogin displayFull={displayFull} />
  );

const HaLoginPage = () => {
  const displayFull = useMediaQuery(
    "(min-width:1024px) and (min-height:768px)"
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (authProvider.getCachedWhoami().id) {
      navigate("/profile");
    }
  }, [navigate]);

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
      {displayFull ? (
        <Grid container spacing={2} style={{paddingTop: "10%"}}>
          <Grid item xs={4}>
            <Typography variant="h3" align="center">
              <div style={{color: "#ffc107"}}>HEI</div>
            </Typography>
            <Typography variant="inherit" component="span" align="center">
              <div style={{color: "#ffffff"}}>
                Une scolarité qui passe à l'échelle
              </div>
            </Typography>{" "}
            <PasswordChangeableLogin displayFull={displayFull} />
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
        <PasswordChangeableLogin displayFull={displayFull} />
      )}
    </div>
  );
};

export default HaLoginPage;
