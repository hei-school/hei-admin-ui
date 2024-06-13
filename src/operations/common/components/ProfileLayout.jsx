import {useRef} from "react";
import {
  ImageField,
  ImageInput,
  SimpleForm,
  EmailField,
  FunctionField,
  SimpleShowLayout,
  TextField,
  Link,
  useRecordContext,
  useRedirect,
  useGetOne,
} from "react-admin";

import {
  PhotoCamera,
  CardTravel as WorkStatusIcon,
  Edit as EditIcon,
  MailOutlined as MailIcon,
  PhoneOutlined as PhoneIcon,
  School as SchoolIcon,
  LocationOnOutlined as AdressIcon,
  CakeOutlined as BirthDateIcon,
  CalendarTodayOutlined as CalendarIcon,
  MapOutlined as GeoIcon,
  AccountBoxOutlined as GenderIcon,
  FeaturedVideoOutlined as NicIcon,
  HowToRegOutlined as StatusIcon,
  PersonOutlined as PersonIcon,
  AssignmentOutlined as SpecializationIcon,
} from "@mui/icons-material";

import {
  Box,
  Card,
  CardActions,
  Dialog,
  Badge,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {DateField, BirthDateField, FieldLabel} from "./fields";
import {Create} from "./Create";
import {GeoPositionName} from "./GeoLocalisation";
import {useNotify, useToggle} from "@/hooks";
import {useRole} from "@/security/hooks";
import {getGenderInFr, getUserStatusInFr} from "../utils/typo_util";
import {SPECIALIZATION_VALUE} from "@/operations/students/components";
import {EMPTY_TEXT} from "@/ui/constants";
import {PALETTE_COLORS} from "@/haTheme";
import {WORK_STATUS_VALUE} from "@/operations/docs/components/SelectWorkStatus";
import {NOOP_FN} from "@/utils/noop";
import {COMMON_FIELD_ATTRIBUTES} from "@/ui/constants/common_styles";
import {DATE_OPTIONS} from "@/utils/date";

import defaultProfilePicture from "@/assets/blank-profile-photo.png";

const COMMON_GRID_ATTRIBUTES = {
  gridTemplateRows: "2fr 1fr",
  direction: "column",
  item: true,
  backgroundColor: "transparent",
  mx: 2,
};

const renderSpecialization = (specialization_field) =>
  SPECIALIZATION_VALUE[specialization_field] || EMPTY_TEXT;

const renderWorkStatus = (workStatus) =>
  WORK_STATUS_VALUE[workStatus] || EMPTY_TEXT;

const HaDateField = ({value, ...props}) => {
  return (
    <Typography {...props}>
      {value
        ? new Date(value).toLocaleString("fr-FR", DATE_OPTIONS)
        : "Non-défini.e"}
    </Typography>
  );
};

const UploadPictureButton = ({role, onUpload = NOOP_FN}) => {
  const [isOpen, , toggle] = useToggle();
  const user = useRecordContext();
  const id = user.id;
  const notify = useNotify();

  return (
    <div>
      <IconButton
        data-testid="upload-picture-button"
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
        <Create
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
              notify(`Photo mise à jour avec succès!`, {
                type: "success",
              });
            },
          }}
        >
          <SimpleForm>
            <ImageInput
              source="profile_picture"
              label=" "
              accept="image/jpeg,image/png,image/webp"
            >
              <ImageField source="src" title="title" />
            </ImageInput>
          </SimpleForm>
        </Create>
      </Dialog>
    </div>
  );
};

const ProfileCardAvatar = ({role}) => {
  const {isStudent} = useRole();
  const user = useRecordContext();
  const imgRef = useRef(null);

  const updateImage = (newImage) => {
    imgRef.current.src = newImage;
  };

  return (
    <Badge
      variant="contained"
      badgeContent={
        !isStudent() && (
          <UploadPictureButton
            role={role}
            onUpload={(user) => {
              updateImage(user.profile_picture);
            }}
          />
        )
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
            alt="profile"
            data-testid="profile-pic"
            ref={imgRef}
            src={user?.profile_picture || defaultProfilePicture}
            onError={() => {
              if (imgRef.current) {
                imgRef.current.src = defaultProfilePicture;
              }
            }}
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

const Contact = () => {
  return (
    <Box>
      <Title>Coordonnées</Title>
      <SimpleShowLayout
        sx={{
          overflowX: "auto",
        }}
      >
        <EmailField
          source="email"
          label={<FieldLabel icon={<MailIcon />}>Email</FieldLabel>}
          {...COMMON_FIELD_ATTRIBUTES}
        />
        <FunctionField
          label={<FieldLabel icon={<PhoneIcon />}>Téléphone</FieldLabel>}
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
          label={<FieldLabel icon={<AdressIcon />}>Adresse</FieldLabel>}
          component="pre"
          emptyText={EMPTY_TEXT}
          {...COMMON_FIELD_ATTRIBUTES}
        />
      </SimpleShowLayout>
    </Box>
  );
};

const PersonalInfos = ({isStudentProfile}) => {
  return (
    <Box minHeight={350}>
      <Title>Informations personnelles</Title>
      <SimpleShowLayout>
        <FunctionField
          label={<FieldLabel icon={<PersonIcon />}>Nom</FieldLabel>}
          render={({first_name, last_name}) => `${first_name} ${last_name}`}
          {...COMMON_FIELD_ATTRIBUTES}
        />
        <FunctionField
          label={<FieldLabel icon={<StatusIcon />}>Statut</FieldLabel>}
          render={(user) => getUserStatusInFr(user.status, user.sex)}
          {...COMMON_FIELD_ATTRIBUTES}
        />
        <DateField
          source="entrance_datetime"
          label={
            <FieldLabel icon={<CalendarIcon />}>
              Date d'entrée chez HEI
            </FieldLabel>
          }
          showTime={false}
          {...COMMON_FIELD_ATTRIBUTES}
        />
        {isStudentProfile && (
          <DateField
            source="commitment_begin_date"
            label={
              <FieldLabel icon={<CalendarIcon />}>
                Date de début d'alternance
              </FieldLabel>
            }
            showTime={false}
            {...COMMON_FIELD_ATTRIBUTES}
          />
        )}
      </SimpleShowLayout>
    </Box>
  );
};

const PersonalDetails = ({isStudentProfile}) => {
  return (
    <Box minHeight={350}>
      <Title>Détails personnels</Title>
      <SimpleShowLayout>
        <FunctionField
          label={<FieldLabel icon={<GenderIcon />}>Sexe</FieldLabel>}
          render={(user) => getGenderInFr(user.sex)}
          {...COMMON_FIELD_ATTRIBUTES}
        />
        <TextField
          source="nic"
          label={<FieldLabel icon={<NicIcon />}> Numéro CIN</FieldLabel>}
          emptyText={EMPTY_TEXT}
          {...COMMON_FIELD_ATTRIBUTES}
        />
        <FunctionField
          label={
            <FieldLabel icon={<BirthDateIcon />}>
              Date et lieu de naissance
            </FieldLabel>
          }
          render={(user) => (
            <BirthDateField
              birthdate={user.birth_date}
              birthplace={user.birth_place}
              emptyText={EMPTY_TEXT}
              sx={{fontSize: "12px"}}
              {...COMMON_FIELD_ATTRIBUTES}
            />
          )}
        />
        <FunctionField
          label={<FieldLabel icon={<GeoIcon />}>Géolocalisation</FieldLabel>}
          render={(user) => (
            <GeoPositionName
              coordinates={user.coordinates}
              {...COMMON_FIELD_ATTRIBUTES}
            />
          )}
        />
        {isStudentProfile && (
          <TextField
            source="high_school_origin"
            emptyText={EMPTY_TEXT}
            label={
              <FieldLabel icon={<SchoolIcon />}>Lycée de provenance</FieldLabel>
            }
            {...COMMON_FIELD_ATTRIBUTES}
          />
        )}
      </SimpleShowLayout>
    </Box>
  );
};

const AvatarPart = ({role}) => {
  return (
    <Box
      minHeight={350}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <SimpleShowLayout
        sx={{
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
    </Box>
  );
};

export const ProfileLayout = ({role, actions, isStudent = false}) => {
  const isSmall = useMediaQuery("(max-width:1200px)");
  const viewerRole = useRole();
  const profile = useRecordContext();
  const redirect = useRedirect();
  const isStudentProfile = isStudent || viewerRole.isStudent();

  const cardStyle = {
    borderRadius: "10px",
    boxShadow: "none",
    p: 1.5,
    border: "1px solid",
    borderColor: PALETTE_COLORS.grey,
  };

  return (
    <Grid
      container
      columns={{xs: 6, sm: 8, md: 12}}
      gridTemplateRows="repeat(2, 1fr)"
      justifyContent="center"
    >
      <Grid
        xs={isSmall ? 10 : 5}
        columns={{xs: 6, sm: 4, md: 4}}
        {...COMMON_GRID_ATTRIBUTES}
      >
        <Card sx={{...cardStyle, position: "relative", border: "1px solid"}}>
          {isStudent && viewerRole.isManager() && (
            <IconButton
              aria-label="Éditer"
              sx={{
                position: "absolute",
                top: 8,
                right: 12,
                color: PALETTE_COLORS.primary,
              }}
              onClick={() => redirect(`/students/${profile.id}/edit`)}
            >
              <EditIcon color={PALETTE_COLORS.primary} />
            </IconButton>
          )}
          <AvatarPart role={role} />
          <Box
            minHeight={350}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Contact />
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {actions}
            </CardActions>
          </Box>
        </Card>
      </Grid>
      <Grid xs={isSmall ? 10 : 6} {...COMMON_GRID_ATTRIBUTES}>
        <Card
          sx={{
            ...cardStyle,
          }}
        >
          <PersonalInfos isStudentProfile={isStudentProfile} />
          <PersonalDetails isStudentProfile={isStudentProfile} />
        </Card>
      </Grid>
    </Grid>
  );
};
