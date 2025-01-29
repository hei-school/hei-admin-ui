import {useNotify} from "@/hooks";
import {Box, Button, Divider, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import authProvider from "../providers/authProvider";

const matchCognitoPassword = (password) => {
  const format = /[!@#$%^&*()_+\-=]/;

  return (
    password.length >= 8 &&
    format.test(password) &&
    /\d/.test(password) &&
    /[A-Z]/.test(password)
  );
};

const CompletePasswordForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();
  const password = watch("password");
  const notify = useNotify();

  const onSubmit = (data) => {
    if (!matchCognitoPassword(data.password)) {
      return notify(
        "Le mot de passe doit avoir au moins : 8 caractères, une majuscule, un caractère spécial !@#$%^&*()_+-= et un chiffre",
        {type: "error", autoHideDuration: 10000}
      );
    }

    authProvider.setNewPassword(data.password);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: 300,
        padding: 3,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Première connexion ?
      </Typography>
      <Divider sx={{marginBottom: 2}} />

      <TextField
        fullWidth
        type="password"
        label="Entrez votre nouveau mot de passe"
        variant="outlined"
        margin="normal"
        {...register("password", {required: "Mot de passe requis"})}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        fullWidth
        type="password"
        label="Confirmez votre nouveau mot de passe"
        variant="outlined"
        margin="normal"
        {...register("confirmPassword", {
          validate: (value) =>
            value === password || "Les mots de passe ne correspondent pas",
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{marginTop: 2}}
      >
        Enregistrer
      </Button>
    </Box>
  );
};

const CompletePasswordPage = () => {
  return (
    <Box sx={{display: "flex", justifyContent: "center", paddingTop: "10%"}}>
      <CompletePasswordForm />
    </Box>
  );
};

export default CompletePasswordPage;
