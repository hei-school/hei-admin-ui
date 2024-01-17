import {
  EnableStatus,
  Sex,
  SpecializationField,
  WhoamiRoleEnum,
} from "@haapi/typescript-client";
import {PhotoCamera} from "@mui/icons-material";
import {
  Badge,
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
import {
  EditButton,
  EmailField,
  FunctionField,
  ImageField,
  ImageInput,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  useShowContext,
} from "react-admin";

import {useToggle} from "../../hooks";
import authProvider from "../../providers/authProvider";
import {PALETTE_COLORS} from "../../ui/constants";
import {CustomDateField, unexpectedValue} from "../utils";
import {CustomCreate} from "../utils/CustomCreate";
import {HaShow} from "../common/components/HaShow";
import {BUTTON_PROPS} from "../common/constants/button_props";

const EMPTY_TEXT = "Non défini.e";

const COMMON_GRID_ATTRIBUTES = {
  gridTemplateRows: "2fr 1fr",
  direction: "column",
  item: true,
  backgroundColor: "transparent",
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

const renderSpecialization = ({specialization_field}) => {
  switch (specialization_field) {
    case SpecializationField.COMMON_CORE:
      return "Tronc commun";
    case SpecializationField.EL:
      return "Ecosystème logiciel";
    case SpecializationField.TN:
      return "Transformation numérique";
    default:
      console.error("Le parcours de spécialisation ne peut pas être affiché");
  }
};

const UploadPictureButton = () => {
  const [isOpen, , toggle] = useToggle();

  const id = authProvider.getCachedWhoami().id;

  return (
    <>
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
          transform={(data) => ({rawFile: data?.profile_picture?.rawFile, id})}
        >
          <SimpleForm>
            <ImageInput source="profile_picture" label=" " accept="image/png">
              <ImageField source="src" title="title" />
            </ImageInput>
          </SimpleForm>
        </CustomCreate>
      </Dialog>
    </>
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
            user?.profile_picture
              ? user.profile_picture
              : "./blank-profile-photo.png"
          }
          style={{
            objectFit: "cover",
            height: 200,
            width: 200,
            border: "1px solid #e0e0e0",
            borderRadius: "50%",
          }}
          alt="your profile picture"
        />
      )}
    />
  </Badge>
);

const Title = ({children}) => (
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
      {children}
    </Typography>
  </Box>
);

const FieldLabel = ({content}) => (
  <Typography
    color={PALETTE_COLORS.typography.black}
    fontWeight="bold"
    variant="subtitle1"
  >
    {content}
  </Typography>
);

export const ProfileLayout = ({id, actions}) => {
  const isSmall = useMediaQuery("(max-width:900px)");

  const user = useShowContext();

  const cardStyle = {
    borderRadius: "10px",
    minHeight: isSmall ? "0px" : "82vh",
    boxShadow: "none",
    p: 0,
  };

  return (
    <>
      <Grid
        container
        columns={{xs: 6, sm: 8, md: 12}}
        gridTemplateRows="repeat(2, 1fr)"
        justifyContent="space-evenly"
      >
        <Grid
          xs={isSmall ? 6 : 4}
          {...COMMON_GRID_ATTRIBUTES}
          columns={{xs: 6, sm: 4, md: 4}}
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
                  label={<FieldLabel content="Email" />}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
                <FunctionField
                  {...COMMON_FIELD_ATTRIBUTES.variant}
                  label={<FieldLabel content="Téléphone" />}
                  render={(data) =>
                    data.phone ? (
                      <Link
                        href={`tel:${data.phone}`}
                        color={PALETTE_COLORS.typography.grey}
                      >
                        {data.phone}
                      </Link>
                    ) : (
                      <span>{EMPTY_TEXT}</span>
                    )
                  }
                />
                <TextField
                  source="address"
                  label={<FieldLabel content="Adresse" />}
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
                    label={<FieldLabel content="Nom" />}
                    render={({first_name, last_name}) =>
                      `${first_name} ${last_name}`
                    }
                    {...COMMON_FIELD_ATTRIBUTES}
                  />
                  <FunctionField
                    label={<FieldLabel content="Statut" />}
                    render={renderStatus}
                    {...COMMON_FIELD_ATTRIBUTES}
                  />
                  <CustomDateField
                    source="entrance_datetime"
                    label={<FieldLabel content="Date d'entrée chez HEI" />}
                    showTime={false}
                    {...COMMON_FIELD_ATTRIBUTES}
                  />
                  {user.record && user.record.specialization_field ? (
                    <FunctionField
                      label={
                        <FieldLabel content="Parcours de spécialisation" />
                      }
                      render={renderSpecialization}
                      {...COMMON_FIELD_ATTRIBUTES}
                      emptyText={EMPTY_TEXT}
                    />
                  ) : (
                    <></>
                  )}
                </SimpleShowLayout>
              </Box>
              <Title>Détails personnels</Title>
              <SimpleShowLayout>
                <FunctionField
                  label={<FieldLabel content="Sexe" />}
                  render={renderSex}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
                <TextField
                  source="nic"
                  label={<FieldLabel content="Numéro CIN" />}
                  emptyText={EMPTY_TEXT}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
                <CustomDateField
                  source="birth_date"
                  label={<FieldLabel content="Date de naissance" />}
                  showTime={false}
                  emptyText={EMPTY_TEXT}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
                <TextField
                  source="birth_place"
                  label={<FieldLabel content="Lieu de naissance" />}
                  emptyText={EMPTY_TEXT}
                  {...COMMON_FIELD_ATTRIBUTES}
                />
              </SimpleShowLayout>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

const ProfileShow = () => {
  const id = authProvider.getCachedWhoami().id;
  return (
    <HaShow
      id={id}
      resource="profile"
      basePath="/profile"
      title="Mon profil"
      actions={false}
    >
      <ProfileLayout
        id={id}
        actions={
          <EditButton
            to={`/profile/${id}/edit`}
            data-testid="profile-edit-button"
            {...BUTTON_PROPS}
          />
        }
      />
    </HaShow>
  );
};

export default ProfileShow;
