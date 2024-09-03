import React, {useState, useEffect} from "react";
import {Button, Login} from "react-admin";
import {
  Card,
  useTheme,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
  Modal,
  Box,
  Link,
  IconButton,
} from "@mui/material";
import {mainTheme} from "@/haTheme";
import CompletePasswordPage from "./CompletePasswordPage";
import authProvider from "@/providers/authProvider";
import ForgotPassword from "@/security/ForgotPassword";
import ConfirmForgotPassword from "@/security/ConfirmForgotPassword";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import img1 from "@/assets/img1.jpg";
import img2 from "@/assets/img2.jpg";
import img3 from "@/assets/img3.jpg";
import img4 from "@/assets/img4.jpg";
import LoginComponent from "@/security/LoginComponent";

const CarouselComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const items = [
    {
      title: "0",
      subtitle: "Vulnérabilité",
      description1: "Crashtest nous scanne,",
      description2: "mais ne trouve rien !",
      course: "WEB-2",
      image: img1,
    },
    {
      title: "0",
      subtitle: "Coût à l'arrêt",
      description1: "Personne ne se connecte ?",
      description2: "Alors personne ne paie.",
      course: "SYS-2",
      image: img2,
    },
    {
      title: "250,000,000",
      subtitle: "Utilisateurs",
      description1: "Onboarder tout Madagascar ?",
      description2: "Dix fois sans problème.",
      course: "DONNEES-2",
      image: img3,
    },
    {
      title: "1",
      subtitle: "Seconde",
      description1: "Pire réponse de notre API",
      description2: "au percentile 97.",
      course: "PROG-2",
      image: img4,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderCard = (item) => (
    <Card
      sx={{
        backgroundColor: "rgb(28, 37, 102)",
        boxShadow:
          "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
        width: "100%",
        padding: 2,
        overflow: "hidden",
        maxWidth: "100%",
        borderRadius: 4,
        maxHeight: "100%",
        [theme.breakpoints.down("md")]: {
          padding: 1,
          maxHeight: 400,
        },
        [theme.breakpoints.down("sm")]: {
          padding: 0.5,
          maxHeight: 300,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            boxShadow:
              "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px",
            backgroundColor: "rgb(28, 37, 112)",
            opacity: 0.9,
            borderRadius: 2,
            padding: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{flex: 1}}>
            <Typography variant="h3" color="#ffffff">
              {item.title}
            </Typography>
            <Typography variant="h4" color="#ffffff">
              {item.subtitle}
            </Typography>
            <Typography variant="body1" color="#ffffff">
              {item.description1}
              <br />
              {item.description2}
            </Typography>
          </Box>
        </Box>
        <img
          src={item.image}
          alt={item.title}
          style={{
            width: "95%",
            height: 560,
            padding: 10,
            paddingTop: 40,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            objectFit: "cover",
            [theme.breakpoints.down("md")]: {
              height: 400,
            },
            [theme.breakpoints.down("sm")]: {
              height: 300,
            },
            mask: `linear-gradient(to right, transparent, black, transparent)`,
            WebkitMask: `linear-gradient(to right, transparent, black, transparent)`, // pour les anciens navigateurs
          }}
        />
        <Typography variant="body2" color="#ffffff">
          <p>
            Cours :{" "}
            <a
              href="https://drive.google.com/file/d/12Lc4o3jfQOFHIzazPToO2hnGZc8epU3I/view"
              style={{color: "#ffffff"}}
            >
              {item.course}
            </a>
          </p>
        </Typography>
        <Box
          sx={{display: "flex", justifyContent: "center", alignItems: "center"}}
        >
          {items.map((item, index) => (
            <Typography
              key={index}
              variant="h5"
              color={currentIndex === index ? "#ffc107" : "#ffffff"}
              sx={{margin: "0 10px"}}
            >
              &#8226;
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  return <Box>{renderCard(items[currentIndex])}</Box>;
};

const aCard = (title, subtitle, description1, description2, course) => {
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
    bgcolor: "background.paper",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    justifyItems: "center",
  };
  const ResponsiveLogin = () => {
    return (
      <Box
        sx={{display: "flex", flexDirection: "column", alignItems: "center"}}
      >
        <Typography variant="h3" align="center">
          <div style={{color: "#ffc107"}}>HEI</div>
        </Typography>
        <Typography variant="h7" align="center">
          <div style={{color: "rgb(28, 37, 102)"}}>
            Une scolarité qui passe à l'échelle
          </div>
        </Typography>
        <LoginComponent />
      </Box>
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
        backgroundSize: "cover",
        position: "fixed",
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
        <Box>
          <Grid
            container
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 50,
              width: "100%",
            }}
            spacing={2}
            theme={mainTheme}
          >
            <Grid
              item
              xs={6}
              style={{
                padding: "20px",
                alignItems: "center",
                borderRadius: 10,
                height: "95vh",
              }}
            >
              <CarouselComponent />
            </Grid>
            <Grid item xs={6}>
              <PasswordChangeableLogin />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <PasswordChangeableLogin />
      )}
    </div>
  );
};

export default HaLoginPage;
