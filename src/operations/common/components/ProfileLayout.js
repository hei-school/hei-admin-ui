import {ImageField, ImageInput, SimpleForm} from "react-admin";
import {
  EmailField,
  FunctionField,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import {Badge} from "@mui/material";
import {PhotoCamera} from "@mui/icons-material";
import {EnableStatus, Sex} from "@haapi/typescript-client";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {useToggle} from "../../../hooks";
import {CustomDateField} from "../../utils";
import {useRole} from "../../../security/hooks";
import {CustomCreate} from "../../utils/CustomCreate";
import {SPECIALIZATION_VALUE} from "../../students/components";
import authProvider from "../../../providers/authProvider";
import { PALETTE_COLORS } from "../../../ui/constants/palette";

const EMPTY_TEXT = "Non défini.e";

const COMMON_GRID_ATTRIBUTES = {
  gridTemplateRows: "2fr 1fr",
  direction: "column",
  item: true,
  backgroundColor: "transparent",
  mx: 2,
};

const COMMON_FIELD_ATTRIBUTES = {
  variant: "body2",
  color: PALETTE_COLORS.typography.grey,
};

const renderSex = ({sex}) => {
  switch (sex) {
    case Sex.M:
      return "Homme";
    case Sex.F:
      return "Femme";
    case null: // display empty_text if sex is null
      return EMPTY_TEXT;
    default:
      console.error("Le sexe ne peut pas être affiché");
  }
};

const renderSpecialization = (specialization_field) =>
  SPECIALIZATION_VALUE[specialization_field] || EMPTY_TEXT;

const renderStatus = ({status}) => {
  switch (status) {
    case EnableStatus.ENABLED:
      return "Actif.ve";
    case EnableStatus.SUSPENDED:
      return "Suspendu·e";
    case EnableStatus.DISABLED:
      return "Quitté.e";
    default:
      console.error("Le statut ne peut pas être affiché");
  }
};

const UploadPictureButton = () => {
  const [isOpen,_set, toggle] = useToggle();
  const {id} = authProvider.getCachedWhoami();

  return (
    <div>
      <IconButton
        onClick={toggle}
        sx={{
          borderRadius: "50%",
          transform: "translate(-30px, -25px)",
          bgcolor: PALETTE_COLORS.grey,
          height: 30,
          width: 30,
        }}
      >
        <PhotoCamera
          sx={{height: 20, width: 20, color: PALETTE_COLORS.yellow}}
        />
      </IconButton>
      <Dialog open={isOpen} onClose={toggle}>
        <DialogTitle color={PALETTE_COLORS.yellow} fontWeight="bold">
          Modifier la photo de profil
        </DialogTitle>
        <CustomCreate
          title=" "
          resource="profile-picture"
          transform={(user) => ({rawFile: user?.profile_picture?.rawFile, id})}
        >
          <SimpleForm>
            <ImageInput source="profile_picture" label=" " accept="image/png">
              <ImageField source="src" title="title" />
            </ImageInput>
          </SimpleForm>
        </CustomCreate>
      </Dialog>
    </div>
  );
};

const ProfileCardAvatar = () => (
  <Badge
    variant="contained"
    badgeContent={<UploadPictureButton />}
    sx={{bgcolor: "transparent"}}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
  >
    <FunctionField
      label=" "
      render={(user) => (
        <img
          src={
            user?.profile_picture || "./blank-profile-photo.png"
          }
          style={{
            objectFit: "cover",
            height: 200,
            width: 200,
            border: `1px solid ${PALETTE_COLORS.grey}`,
            borderRadius: "50%",
          }}
          alt="user profile picture"
        />
      )}
    />
  </Badge>
);

const Title = ({children: label}) => (
  <Box
    padding={1}
    border="1px solid"
    borderColor={PALETTE_COLORS.yellow}
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="10px"
  >
    <Typography color={PALETTE_COLORS.yellow} fontWeight="bold" variant="h7">
      {label}
    </Typography>
  </Box>
);

const FieldLabel = ({children: label}) => (
  <Typography
    color={PALETTE_COLORS.typography.black}
    fontWeight="bold"
    variant="subtitle1"
  >
    {label}
  </Typography>
);

export const ProfileLayout = ({id, actions, isStudent = false}) => {
  const isSmall = useMediaQuery("(max-width:1200px)");
  const role = useRole();
  const isStudentProfile = isStudent || role.isStudent();

  const cardStyle = {
    borderRadius: "10px",
    minHeight: isSmall ? "0px" : "82vh",
    boxShadow: "none",
    p: 0,
  };

  return (
    <div>
      <Grid
        container
        columns={{xs: 6, sm: 8, md: 12}}
        gridTemplateRows="repeat(2, 1fr)"
        justifyContent="center"
      >
        <Grid
          xs={isSmall ? 6 : 5}
          {...COMMON_GRID_ATTRIBUTES}
          columns={{xs: 6, sm: 4, md: 4}}
          marginBottom={isSmall ? 2 : 0}
        >
          <Card sx={cardStyle}>
            <CardContent>
              <SimpleShowLayout
                sx={{
                  minHeight: "315px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: "none",
                }}
              >
                <ProfileCardAvatar />
                <FunctionField
                  label=" "
                  render={({ref}) => (
                    <Typography m="auto" variant="h6">
                      {ref}
                    </Typography>
                  )}
                />
              </SimpleShowLayout>
              <Title>Coordonnées</Title>
              <SimpleShowLayout
                sx={{
                  overflowX: "auto",
                }}
              >
                <EmailField
                  source="email"
                  label={<FieldLabel>Email</FieldLabel>}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
                <FunctionField
                  {...COMMON_FIELD_ATTRIBUTES.variant}
                  label={<FieldLabel>Téléphone</FieldLabel>}
                  render={(user) =>
                    user.phone ? (
                      <Link
                        href={`tel:${user.phone}`}
                        color={PALETTE_COLORS.typography.grey}
                      >
                        {user.phone}
                      </Link>
                    ) : (
                      <span>{EMPTY_TEXT}</span>
                    )
                  }
                />
                <TextField
                  source="address"
                  label={<FieldLabel>Adresse</FieldLabel>}
                  component="pre"
                  emptyText={EMPTY_TEXT}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
              </SimpleShowLayout>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                {actions}
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={6} {...COMMON_GRID_ATTRIBUTES}>
          <Card
            sx={{
              ...cardStyle,
              border: "1px solid",
              borderColor: PALETTE_COLORS.grey,
            }}
          >
            <CardContent>
              <Box minHeight={315}>
                <Title>Informations personnelles</Title>
                <SimpleShowLayout>
                  <FunctionField
                    label={<FieldLabel>Nom</FieldLabel>}
                    render={({first_name, last_name}) =>
                      `${first_name} ${last_name}`
                    }
                    {...COMMON_FIELD_ATTRIBUTES}
                  />
                  <FunctionField
                    label={<FieldLabel>Statut</FieldLabel>}
                    render={renderStatus}
                    {...COMMON_FIELD_ATTRIBUTES}
                  />
                  <CustomDateField
                    source="entrance_datetime"
                    label={<FieldLabel>Date d'entrée chez HEI</FieldLabel>}
                    showTime={false}
                    {...COMMON_FIELD_ATTRIBUTES}
                  />
                  {isStudentProfile && (
                    <FunctionField
                      label={
                        <FieldLabel>Parcours de Spécialisation</FieldLabel>
                      }
                      {...COMMON_FIELD_ATTRIBUTES}
                      render={(user) =>
                        renderSpecialization(user.specialization_field)
                      }
                    />
                  )}
                </SimpleShowLayout>
              </Box>
              <Title>Détails personnels</Title>
              <SimpleShowLayout>
                <FunctionField
                  label={<FieldLabel>Sexe</FieldLabel>}
                  render={renderSex}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
                <TextField
                  source="nic"
                  label={<FieldLabel>Numéro CIN</FieldLabel>}
                  emptyText={EMPTY_TEXT}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
                <CustomDateField
                  source="birth_date"
                  label={<FieldLabel>Date de naissance</FieldLabel>}
                  showTime={false}
                  emptyText={EMPTY_TEXT}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
                <TextField
                  source="birth_place"
                  label={<FieldLabel>Lieu de naissance</FieldLabel>}
                  emptyText={EMPTY_TEXT}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
              </SimpleShowLayout>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
