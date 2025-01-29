import {TextField} from "@mui/material";
import {indigo} from "@mui/material/colors";
import {Button} from "react-admin";

const matchCognitoPassword = (password) => {
  var format = /[!@#$%^&*()_+\-=]/;
  if (password.length < 8) {
    return false;
  } else if (!format.test(password)) {
    return false;
  } else if (!/\d/.test(password)) {
    return false;
  } else if (!/[A-Z]/.test(password)) {
    return false;
  }
  return true;
};

export const checkPassword = (password, confirmPassword) => {
  if (password === "") {
    return "Le mot de passe ne peut pas être vide.";
  } else if (password !== confirmPassword) {
    return "Les mots de passe ne correspondent pas !";
  } else if (!matchCognitoPassword(password)) {
    return "Le mot de passe doit : \n - avoir au moins 8 caractères \n - avoir au moins une majuscule \n - avoir au moins un caractère spécial !@#$%^&*()_+-= \n - avoir au moins un chiffre";
  } else {
    return true;
  }
};

export const CustomTextField = (props) => {
  const {placeholder, onChange, type, label, validator, ...rest} = props;
  return (
    <TextField
      {...rest}
      required
      error={validator}
      helperText={validator && "Ce champs est requis"}
      label={label}
      variant="filled"
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      style={{
        margin: "0.75vw",
        width: "300px",
      }}
    />
  );
};

export const CustomSubmitButton = ({text, onClick}) => {
  return (
    <Button
      onClick={onClick}
      style={{
        backgroundColor: indigo[800],
        width: "300px",
        color: "#FFFF",
        padding: "0.5vw",
        margin: "0.75vw",
      }}
    >
      {text}
    </Button>
  );
};
