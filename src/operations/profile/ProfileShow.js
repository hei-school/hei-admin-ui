import {
  EmailField,
  FunctionField,
  SimpleShowLayout,
  Show,
  TextField,
} from "react-admin";
import {
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import authProvider from "../../providers/authProvider";
import { unexpectedValue, CustomDateField } from "../utils";
import { useState } from "react";

export const ProfileLayout = () => {
  const sexRenderer = (user) => {
    if (user.sex === "M") return "Homme";
    if (user.sex === "F") return "Femme";
    return unexpectedValue;
  };
  const statusRenderer = (user) => {
    if (user.status === "ENABLED") return "Actif·ve";
    if (user.status === "DISABLED") return "Suspendu·e";
    return unexpectedValue;
  };
  const phoneRenderer = (data) => (
    <Link href={`tel:${data.phone}`}>{data.phone}</Link>
  );

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const LocalisationRenderer = () => {
    return (
      <>
        <Button
          variant="outlined"
          startIcon={<LocationOnOutlinedIcon />}
          onClick={handleClickOpen}
        >
          Localisation
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>Carte de la localisation</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ErrorOutlineOutlinedIcon
                color="error"
                style={{ marginRight: "8px" }}
              />
              <p>Aucune carte n'est disponible pour cette adresse !</p>
            </div>
            <p>Latitude: </p>
            <p>Longitude: </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <SimpleShowLayout>
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" id="first_name" label="Prénom(s)" />
      <TextField source="last_name" label="Nom(s)" />
      <FunctionField label="Sexe" render={sexRenderer} />
      <FunctionField label="Téléphone" render={phoneRenderer} />
      <CustomDateField
        source="birth_date"
        label="Date de naissance"
        showTime={false}
      />
      <TextField source="address" label="Adresse" component="pre" />
      <FunctionField
        label="Localisation"
        render={() => LocalisationRenderer()}
      />
      <EmailField source="email" label="Email" />
      <CustomDateField
        source="entrance_datetime"
        label="Date d'entrée chez HEI"
        showTime={false}
      />
      <FunctionField label="Statut" render={statusRenderer} />
    </SimpleShowLayout>
  );
};

const ProfileShow = () => {
  const id = authProvider.getCachedWhoami().id;
  return (
    <Show id={id} resource="profile" basePath="/profile" title="Mon profil">
      <ProfileLayout />
    </Show>
  );
};

export default ProfileShow;