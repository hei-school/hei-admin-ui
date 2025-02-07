import {Typography} from "@mui/material";
import {useState} from "react";
import {useNotify} from "react-admin";
import authProvider from "../providers/authProvider";
import {CustomSubmitButton, CustomTextField} from "./utils";

const ConfirmForgotPassword = ({setUsername, setConfirm}) => {
  const [email, setEmail] = useState("");
  const handleEmailChange = (e) => setEmail(e.target.value);
  const notify = useNotify();

  const sendEmail = () => {
    setUsername(email);
    authProvider
      .forgotPassword(email)
      .then(() => setConfirm(false))
      .catch(() => notify(`Une erreur s'est produite`, {type: "error"}));
  };
  return (
    <div>
      <Typography
        variant="h7"
        sx={{
          margin: "0.75vw",
        }}
      >
        Un mail de confirmation avec un code vous sera envoyé
      </Typography>
      <CustomTextField
        validator={email === ""}
        label="Mail"
        placeholder="Votre mail ici"
        onChange={handleEmailChange}
        type="email"
        data-testid="mail_input"
      />
      <CustomSubmitButton onClick={sendEmail} text="ENVOYER" />
    </div>
  );
};
export default ConfirmForgotPassword;
