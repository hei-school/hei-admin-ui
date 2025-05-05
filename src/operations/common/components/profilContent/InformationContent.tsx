import {FC} from "react";
import {
  TabbedShowLayout,
  TabbedShowLayoutTabs,
  useGetOne,
  useRecordContext,
} from "react-admin";

import {CommentList} from "@/operations/comments/CommentList";
import FeeList from "@/operations/fees/FeeList";
import {LettersList} from "@/operations/letters/LettersList";
import {UserLettersList} from "@/operations/letters/UserLettersList";
import {useRole} from "@/security/hooks";
import {
  Badge,
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {Contact} from "./ContactDetails";
import {PersonalDetails} from "./PersonalDetails";
import {PersonalInfos} from "./PersonalInfos";

export const Informations: FC<{
  isStudentProfile: boolean;
  isTeacherProfile: boolean;
  isMonitorProfile: boolean;
  isStaffProfil: boolean;
}> = ({
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
          <CommentList studentId={profile.id} close={false} />
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
