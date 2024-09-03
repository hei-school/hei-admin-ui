import * as React from "react";
import {useState} from "react";
import {useNotify, useRedirect} from "react-admin";
import {
  Container,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Link,
  InputAdornment,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import authProvider from "@/providers/authProvider";
import LockIcon from "@mui/icons-material/Lock";
import ConfirmForgotPassword from "./ConfirmForgotPassword";
import ForgotPassword from "./ForgotPassword";

const LoginComponent = ({theme}) => {
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirm, setConfirm] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setusernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameErrorMessage, setusernameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    authProvider
      .login({username, password})
      .then(() => {
        redirect("/profile");
      })
      .catch((error) => {
        notify(`Erreur de connexion : ${error.message}`);
        setLoading(false);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleusernameChange = (e) => {
    setUsername(e.target.value);
    if (!e.target.value) {
      setusernameError(true);
      setusernameErrorMessage("username is required");
    } else {
      setusernameError(false);
      setusernameErrorMessage("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters long");
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow:
            "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px",
          borderRadius: 4,
          padding: 3,
          margin: 3,
          maxWidth: 400,
        }}
      >
        <Avatar
          sx={{
            marginBottom: 2,
          }}
        >
          <LockIcon />
        </Avatar>
        <TextField
          margin="normal"
          error={usernameError}
          helperText={usernameErrorMessage}
          id="username"
          type="username"
          name="username"
          placeholder="hei.student@gmail.com"
          autoComplete="username"
          autoFocus
          required
          fullWidth
          variant="outlined"
          color={usernameError ? "error" : "primary"}
          sx={{ariaLabel: "username", margin: 2}}
          value={username}
          onChange={handleusernameChange}
        />
        <TextField
          margin="normal"
          error={passwordError}
          helperText={passwordErrorMessage}
          name="password"
          placeholder="•••••••••"
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          required
          fullWidth
          variant="outlined"
          color={passwordError ? "error" : "primary"}
          sx={{marginBottom: 2}}
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Grid container>
          <Grid item xs>
            <Link
              href="#/login"
              sx={{
                fontSize: 12,
                margin: 2,
                alignItem: "left",
                color: "primary.main",
                textDecoration: "none",
                marginBottom: 2,
                display: "block",
                textAlign: "left",
              }}
              onClick={() => setOpenModal(true)}
            >
              Mot de passe oublié?
            </Link>
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{width: 120, mt: 3, mb: 2}}
        >
          {loading ? (
            <CircularProgress size={24} sx={{color: "white"}} />
          ) : (
            "Connexion"
          )}
        </Button>
        <Modal open={openModal} onClose={handleModalClose}>
          <Box
            sx={{
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
            }}
          >
            <Typography
              style={{color: "rgb(28, 37, 102)"}}
              variant="h6"
              gutterBottom
            >
              Mot de passe oublié?
            </Typography>
            <form>
              {confirm ? (
                <ConfirmForgotPassword
                  username={username}
                  setUsername={setUsername}
                  setConfirm={setConfirm}
                />
              ) : (
                <ForgotPassword
                  username={username}
                  setOpenModal={setOpenModal}
                />
              )}
            </form>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default LoginComponent;
