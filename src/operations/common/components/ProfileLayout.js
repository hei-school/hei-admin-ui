import {useRef} from "react";
import {
  ImageField,
  ImageInput,
  SimpleForm,
  useRecordContext,
  EmailField,
  FunctionField,
  SimpleShowLayout,
  TextField,
  useRedirect,
  useCreate,
  useCreateContext,
  SaveButton,
  Toolbar,
  useRefresh,
} from "react-admin";

import {Badge} from "@mui/material";
import {PhotoCamera} from "@mui/icons-material";
import {EnableStatus, Sex} from "@haapi/typescript-client";
import {
  Box,
  Card,
  CardActions,
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
import {PALETTE_COLORS} from "../../../ui/constants/palette";
import defaultProfilePicture from "../../../assets/blank-profile-photo.png";
import {NOOP_FN} from "../../../utils/noop";

const EMPTY_TEXT = "Non défini.e";

const COMMON_GRID_ATTRIBUTES = {
  gridTemplateRows: "2fr 1fr",
  direction: "column",
  item: true,
  backgroundColor: "transparent",
  mx: 2,
};

const COMMON_FIELD_ATTRIBUTES = {
  variant: "caption",
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

const UploadPictureButton = ({role, onUpload = NOOP_FN}) => {
  const [isOpen, _set, toggle] = useToggle();
  const user = useRecordContext();
  const id = user.id;

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
          redirect={false}
          resource="profile-picture"
          transform={(user) => ({
            rawFile: user?.profile_picture?.rawFile,
            id,
            role,
          })}
          mutationOptions={{
            onSuccess: (user) => {
              toggle();
              onUpload(user);
            },
          }}
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

const ProfileCardAvatar = ({role}) => {
  const user = useRecordContext();
  const imgRef = useRef(null);

  const updateImage = (newImage) => {
    imgRef.current.src = newImage;
  };

  return (
    <Badge
      variant="contained"
      badgeContent={
        <UploadPictureButton
          role={role}
          onUpload={(user) => {
            updateImage(user.profile_picture);
          }}
        />
      }
      sx={{bgcolor: "transparent"}}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <FunctionField
        label=" "
        render={() => (
          <img
            data-testid="profile-pic"
            ref={imgRef}
            src={user?.profile_picture || defaultProfilePicture}
            onError={() => {
              if (imgRef.current) {
                imgRef.current.src = defaultProfilePicture;
              }
            }}
            alt="profile picture"
            style={{
              objectFit: "cover",
              height: 175,
              width: 175,
              border: `1px solid ${PALETTE_COLORS.grey}`,
              borderRadius: "50%",
            }}
          />
        )}
      />
    </Badge>
  );
};

const Title = ({children: label}) => (
  <Box
    padding="5px"
    border="1px solid"
    borderColor={PALETTE_COLORS.yellow}
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="10px"
  >
    <Typography color={PALETTE_COLORS.yellow} fontWeight="bold" variant="body2">
      {label}
    </Typography>
  </Box>
);

const FieldLabel = ({children: label}) => (
  <Typography
    color={PALETTE_COLORS.typography.black}
    fontWeight="bold"
    variant="body2"
  >
    {label}
  </Typography>
);

export const ProfileLayout = ({role, actions, isStudent = false}) => {
  const isSmall = useMediaQuery("(max-width:1200px)");
  const viewerRole = useRole();
  const isStudentProfile = isStudent || viewerRole.isStudent();

  const cardStyle = {
    borderRadius: "10px",
    boxShadow: "none",
    p: 1.5,
  };

  return (
    <Grid
      container
      columns={{xs: 6, sm: 8, md: 12}}
      gridTemplateRows="repeat(2, 1fr)"
      justifyContent="center"
    >
      <Grid
        xs={isSmall ? 6 : 5}
        columns={{xs: 6, sm: 4, md: 4}}
        {...COMMON_GRID_ATTRIBUTES}
      >
        <Card sx={cardStyle}>
          <SimpleShowLayout
            sx={{
              minHeight: "275px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              boxShadow: "none",
            }}
          >
            <ProfileCardAvatar role={role} />
            <FunctionField
              label=" "
              render={(user) => (
                <Typography m="auto" variant="h6">
                  {user.ref}
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
              label={<FieldLabel>Téléphone</FieldLabel>}
              variant={COMMON_FIELD_ATTRIBUTES.variant}
              render={(user) =>
                !user.phone ? (
                  <span>{EMPTY_TEXT}</span>
                ) : (
                  <Link
                    href={`tel:${user.phone}`}
                    color={PALETTE_COLORS.typography.grey}
                  >
                    {user.phone}
                  </Link>
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
            }}
          >
            {actions}
          </CardActions>
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
          <Box minHeight={275}>
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
                  label={<FieldLabel>Parcours de Spécialisation</FieldLabel>}
                  render={(user) =>
                    renderSpecialization(user.specialization_field)
                  }
                  {...COMMON_FIELD_ATTRIBUTES}
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
        </Card>
      </Grid>
    </Grid>
  );
};
