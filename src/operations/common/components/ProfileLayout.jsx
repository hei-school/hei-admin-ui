import {
  ImageField,
  ImageInput,
  SimpleForm,
  TabbedShowLayout,
  TabbedShowLayoutTabs,
  useGetOne,
  useRecordContext,
  useShowContext,
} from "react-admin";

import {PhotoCamera} from "@mui/icons-material";

import {
  Badge,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {CommentList} from "@/operations/comments/CommentList";
import {Create} from "@/operations/common/components/Create";
import FeeList from "@/operations/fees/FeeList";

import {PALETTE_COLORS} from "@/haTheme";
import {useNotify, useToggle} from "@/hooks";
import {useRole} from "@/security/hooks";
import {NOOP_FN} from "@/utils/noop";

import defaultCoverPicture from "@/assets/banner.jpg";
import {LettersList} from "@/operations/letters/LettersList";
import {UserLettersList} from "@/operations/letters/UserLettersList";
import {Contact} from "./profilContent/ContactDetails";
import {PersonalDetails} from "./profilContent/PersonalDetails";
import {PersonalInfos} from "./profilContent/PersonalInfos";
import {ProfileCardAvatar} from "./profilContent/ProfilCardAvatar";

export const UploadPictureButton = ({role, onUpload = NOOP_FN}) => {
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

export const ProfileLayout = ({
  role,
  actions,
  isTeacherProfile = false,
  isStudentProfile = false,
  isMonitorProfile = false,
  isAdminProfil = false,
  isStaffProfil = false,
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
        isStaffProfil={isStaffProfil}
      />
    </Box>
  );
};

export const Informations = ({
  isStudentProfile,
  isTeacherProfile,
  isMonitorProfile,
  isStaffProfil,
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

  const adminView =
    !role.isMonitor() &&
    !role.isOrganizer() &&
    !isMonitorProfile &&
    !(role.isManager() && isTeacherProfile) &&
    !(role.isTeacher() && isStudentProfile) &&
    !isAdminProfil &&
    !isManagerProfil;

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
          <PersonalInfos
            isStudentProfile={isStudentProfile}
            isStaffMember={isStaffProfil}
          />
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
      {(adminView || (role.isAdmin() && isStaffProfil)) && (
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
        !isStaffProfil &&
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
