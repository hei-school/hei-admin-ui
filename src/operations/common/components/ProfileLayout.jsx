import {useRef} from "react";

import {
  ImageField,
  ImageInput,
  SimpleForm,
  FunctionField,
  useRecordContext,
  useGetOne,
  TabbedShowLayout,
  TabbedShowLayoutTabs,
  useShowContext,
} from "react-admin";

import {
  PhotoCamera,
  CardTravel as WorkStatusIcon,
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
  Dialog,
  Badge,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";

import {BirthDateField} from "@/operations/common/components/fields";
import {Create} from "@/operations/common/components/Create";
import {GeoPositionName} from "@/operations/common/components/GeoLocalisation";
import {CommentList} from "@/operations/comments/CommentList";
import HaField from "@/operations/common/components/fields/HaField";
import FeeList from "@/operations/fees/FeeList";

import {useNotify, useToggle} from "@/hooks";
import {useRole} from "@/security/hooks";
import {
  getGenderInFr,
  getUserStatusInFr,
} from "@/operations/common/utils/typo_util";
import {formatDate, DATE_OPTIONS} from "@/utils/date";
import {SPECIALIZATION_VALUE} from "@/operations/students/components";
import {EMPTY_TEXT} from "@/ui/constants";
import {PALETTE_COLORS} from "@/haTheme";
import {WORK_STATUS_VALUE} from "@/operations/docs/components/SelectWorkStatus";
import {WORK_TYPE_VALUE} from "@/operations/docs/components/SelectWorkType";
import {NOOP_FN} from "@/utils/noop";

import defaultCoverPicture from "@/assets/banner.jpg";
import defaultProfilePicture from "@/assets/blank-profile-photo.png";
import {UserLettersList} from "@/operations/letters/UserLettersList";
import {LettersList} from "@/operations/letters/LettersList";

const renderSpecialization = (specialization_field) =>
  SPECIALIZATION_VALUE[specialization_field] || EMPTY_TEXT;

const renderWorkStatus = (workStatus) =>
  WORK_STATUS_VALUE[workStatus] || EMPTY_TEXT;

const renderExperienceDuration = ({
  commitment_begin_date,
  commitment_end_date,
}) => {
  if (!commitment_begin_date) return EMPTY_TEXT;

  const beginDate = formatDate(commitment_begin_date, false);
  const endDate = commitment_end_date
    ? `au ${formatDate(commitment_end_date, false)}`
    : `jusqu'à maintenant`;

  return `Du ${beginDate} ${endDate}`;
};

const HaDateField = ({value, ...props}) => {
  const isLarge = useMediaQuery("(min-width:1700px)");
  return (
    <Typography {...props} variant={isLarge ? "body2" : "caption"}>
      {value
        ? new Date(value).toLocaleString("fr-FR", DATE_OPTIONS)
        : "Non-défini.e"}
    </Typography>
  );
};

const UploadPictureButton = ({role, onUpload = NOOP_FN}) => {
  const [isOpen, , toggle] = useToggle();
  const user = useRecordContext();
  const id = user?.id;
  const notify = useNotify();
  const isLarge = useMediaQuery("(min-width:1700px)");
  return (
    <div>
      <IconButton
        data-testid="upload-picture-button"
        onClick={toggle}
        sx={{
          borderRadius: "50%",
          transform: isLarge
            ? "translate(-35px, -35px)"
            : "translate(-30px, -25px)",
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
  const isLarge = useMediaQuery("(min-width:1700px)");

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
      sx={{bgcolor: "transparent", bottom: "5vh"}}
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
              height: isLarge ? 210 : 175,
              width: isLarge ? 210 : 175,
              border: `1px solid ${PALETTE_COLORS.grey}`,
              borderRadius: "50%",
            }}
          />
        )}
      />
    </Badge>
  );
};

const Title = ({children: label}) => {
  const isLarge = useMediaQuery("(min-width:1700px)");
  return (
    <Typography
      color={PALETTE_COLORS.yellow}
      fontWeight="bold"
      width="100%"
      borderBottom={`1px solid ${PALETTE_COLORS.grey}`}
      fontSize={isLarge ? "1.5rem" : "0.9rem"}
    >
      {label}
    </Typography>
  );
};

const PersonalInfos = ({isStudentProfile}) => {
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        width: isSmall ? "100%" : "50%",
        minHeight: "100%",
        padding: "1rem",
        borderRadius: "10px",
      }}
    >
      <Title>Informations personnelles</Title>
      <Box display="flex" flexDirection="column" gap={1}>
        <HaField
          label="Date d'entrée chez HEI"
          icon={<CalendarIcon />}
          render={(user) => <HaDateField value={user.entrance_datetime} />}
        />
        {isStudentProfile && (
          <Box display="flex" flexDirection="column" gap={1}>
            <HaField
              label="Redoublant"
              render={(user) => (user.is_repeating_year ? "Oui" : "Non")}
              icon={<PersonIcon />}
            />
            <HaField
              label="Parcours de Spécialisation"
              render={(user) => renderSpecialization(user.specialization_field)}
              icon={<SpecializationIcon />}
            />
            <HaField
              label="Statut professionnel"
              icon={<StatusIcon />}
              render={(user) => renderWorkStatus(user.work_study_status)}
            />
            <HaField
              label="Type d'expérience professionnelle"
              render={(user) =>
                WORK_TYPE_VALUE[user.professional_experience] ??
                "Pas d'expérience professionnelle"
              }
              icon={<WorkStatusIcon />}
            />
            <HaField
              label="Période de l'expérience professionnelle"
              icon={<CalendarIcon />}
              render={renderExperienceDuration}
            />
            <HaField
              label="Lycée de provenance"
              icon={<SchoolIcon />}
              source="high_school_origin"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

const Contact = () => {
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        width: "100%",
        padding: "1rem",
      }}
    >
      <Title>Coordonnées</Title>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
          gap: "1rem",
        }}
      >
        <HaField
          label="Email"
          icon={<MailIcon />}
          render={(user) => (
            <a
              href={`mailto:${user.email}`}
              target="_blank"
              style={{color: "inherit"}}
            >
              {user.email}
            </a>
          )}
        />
        <HaField label="Téléphone" source="phone" icon={<PhoneIcon />} />
        <HaField label="Adresse" source="address" icon={<AdressIcon />} />
        <HaField
          label="Géolocalisation"
          icon={<GeoIcon />}
          render={(user) => <GeoPositionName coordinates={user.coordinates} />}
        />
      </Box>
    </Box>
  );
};

const PersonalDetails = () => {
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        width: "100%",
        padding: "1rem",
      }}
    >
      <Title>Détails personnels</Title>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
          gap: "1rem",
        }}
      >
        <HaField
          label="Sexe"
          render={(user) => getGenderInFr(user.sex)}
          icon={<GenderIcon />}
        />
        <HaField label="Numéro CIN" source="nic" icon={<NicIcon />} />
        <HaField
          label="Date et lieu de naissance"
          render={(user) => (
            <BirthDateField
              birthdate={user.birth_date}
              birthplace={user.birth_place}
              emptyText="Non défini.e"
            />
          )}
          icon={<BirthDateIcon />}
        />
        <HaField
          label="Statut"
          render={(user) => getUserStatusInFr(user.status, user.sex)}
          icon={<StatusIcon />}
        />
      </Box>
    </Box>
  );
};

export const ProfileLayout = ({
  role,
  actions,
  isTeacherProfile = false,
  isStudentProfile = false,
  isMonitorProfile = false,
  isAdminProfil = false,
}) => {
  const {record: profile = {}} = useShowContext();
  const isLarge = useMediaQuery("(min-width:1700px)");
  const {groups = []} = profile;

  return (
    <Box
      border={`1px solid ${PALETTE_COLORS.grey}`}
      borderRadius="10px"
      position="relative"
    >
      <Box
        height={isLarge ? "15rem" : "10rem"}
        width="100%"
        borderRadius="10px 10px 0 0"
        sx={{
          backgroundImage: `url(${defaultCoverPicture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingInline="2vw"
        height="7rem"
        position="relative"
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          position="relative"
          height="100%"
        >
          <ProfileCardAvatar role={role} />
          <Box>
            <Typography
              fontWeight="600"
              fontSize={{
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              }}
            >
              {profile.first_name} {profile.last_name}
            </Typography>
            <Typography
              fontSize={{
                xs: "0.8rem",
                sm: "0.9rem",
                md: "1rem",
                lg: "1rem",
                xl: "1.2rem",
              }}
            >
              {profile.ref}
            </Typography>
            {isStudentProfile && (
              <Typography
                fontSize={{
                  xs: "0.4rem",
                  sm: "0.6rem",
                  md: "0.8rem",
                  lg: "0.9rem",
                  xl: "1rem",
                }}
              >
                {groups.map((group) => group.ref).join(", ")}
              </Typography>
            )}
          </Box>
        </Box>
        <Box>{actions}</Box>
      </Box>
      <Informations
        isStudentProfile={isStudentProfile}
        isTeacherProfile={isTeacherProfile}
        isMonitorProfile={isMonitorProfile}
      />
    </Box>
  );
};

export const Informations = ({
  isStudentProfile,
  isTeacherProfile,
  isMonitorProfile,
}) => {
  const isSmall = useMediaQuery("(max-width:900px)");
  const profile = useRecordContext();
  const role = useRole();
  const isAdminProfil =
    role.isAdmin() &&
    !isMonitorProfile &&
    !isStudentProfile &&
    !isTeacherProfile;
  const isManagerProfil =
    role.isManager() &&
    !isMonitorProfile &&
    !isStudentProfile &&
    !isTeacherProfile;
  const {data: letterStats} = useGetOne(
    "letters-stats",
    {id: undefined},
    {
      enabled: role.isManager() || role.isAdmin(),
    }
  );

  if (!profile) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100%"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" color="textSecondary">
          Chargement en cours...
        </Typography>
      </Box>
    );
  }

  return (
    <TabbedShowLayout
      tabs={<TabbedShowLayoutTabs variant="scrollable" scrollButtons="auto" />}
      syncWithLocation={false}
    >
      <TabbedShowLayout.Tab
        label="Détails du Profil"
        style={{fontSize: "0.8rem"}}
      >
        <Box
          display="flex"
          gap={2}
          width="100%"
          height="100%"
          flexDirection={isSmall ? "column" : "row"}
          justifyContent="space-between"
        >
          <Box
            display="flex"
            gap={2}
            width={isSmall ? "100%" : "50%"}
            flexDirection="column"
            height="100%"
          >
            <Contact />
            <PersonalDetails />
          </Box>
          <PersonalInfos isStudentProfile={isStudentProfile} />
        </Box>
      </TabbedShowLayout.Tab>
      {isStudentProfile && (
        <TabbedShowLayout.Tab label="Commentaires" style={{fontSize: "0.8rem"}}>
          <CommentList studentId={profile.id} />
        </TabbedShowLayout.Tab>
      )}

      {isStudentProfile &&
        (role.isManager() || role.isAdmin() || role.isMonitor()) && (
          <TabbedShowLayout.Tab
            label="Liste des Frais"
            path="fees"
            data-testid="fees-list-tab"
            style={{fontSize: "0.8rem"}}
          >
            <FeeList studentId={profile.id} studentRef={profile.ref} />
          </TabbedShowLayout.Tab>
        )}
      {!role.isMonitor() &&
        !isMonitorProfile &&
        !(role.isManager() && isTeacherProfile) &&
        !(role.isTeacher() && isStudentProfile) &&
        !isAdminProfil &&
        !isManagerProfil && (
          <TabbedShowLayout.Tab
            label="Boîte aux lettres"
            data-testid="letters-list-tab"
            sx={{
              position: "relative",
              fontSize: "0.7rem",
            }}
          >
            <UserLettersList />
          </TabbedShowLayout.Tab>
        )}
      {!isMonitorProfile &&
        !isStudentProfile &&
        !isTeacherProfile &&
        (role.isAdmin() || role.isManager()) && (
          <TabbedShowLayout.Tab
            label={
              letterStats && (
                <Badge
                  badgeContent={
                    <span
                      style={{
                        backgroundColor: "red",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "800",
                        color: "white",
                        marginLeft: "1rem",
                        height: "1.4rem",
                        width: "1.4rem",
                      }}
                    >
                      {letterStats.pending}
                    </span>
                  }
                  sx={{
                    position: "relative",
                    fontSize: "0.7rem",
                  }}
                >
                  Boîte aux lettres
                </Badge>
              )
            }
            style={{paddingTop: "1rem", width: "10vw"}}
            data-testid="letters-list-tab"
          >
            <LettersList stats={letterStats} />
          </TabbedShowLayout.Tab>
        )}
    </TabbedShowLayout>
  );
};
