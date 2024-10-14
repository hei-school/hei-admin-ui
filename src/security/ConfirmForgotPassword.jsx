import {useState} from "react";
import authProvider from "../providers/authProvider";
import {Typography, TextField, CircularProgress} from "@mui/material";
import {CustomTextField, CustomSubmitButton} from "./utils";
import {useNotify} from "react-admin";

const ConfirmForgotPassword = ({setUsername, setConfirm}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const notify = useNotify();

  const sendEmail = () => {
    setLoading(true);
    setUsername(email);
    authProvider
      .forgotPassword(email)
      .then(() => {
        setConfirm(false);
        setLoading(false);
      })
      .catch(() => {
        notify(`Une erreur s'est produite`, {type: "error"});
        setLoading(false);
      });
  };
  return (
    <div>
      <Typography style={{color: "grey"}} variant="body2" gutterBottom>
        Un mail de confirmation avec un code vous sera envoyé
      </Typography>
      <TextField
        validator={email === ""}
        label="Email"
        type="email"
        placeholder="Votre mail ici"
        onChange={handleEmailChange}
        data-testid="mail_input"
        fullWidth
        variant="outlined"
        sx={{marginBottom: 2}}
      />
      <CustomSubmitButton onClick={sendEmail} text="ENVOYER" loading={loading}>
        {loading ? <CircularProgress size={24} color="#ffffff" /> : "ENVOYER"}
      </CustomSubmitButton>
    </div>
  );
};
export default ConfirmForgotPassword;
