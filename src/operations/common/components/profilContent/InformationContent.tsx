import {useTabManager} from "@/hooks/useTabManager";
import {CommentList} from "@/operations/comments/CommentList";
import FeeList from "@/operations/fees/FeeList";
import {LettersList} from "@/operations/letters/LettersList";
import {UserLettersList} from "@/operations/letters/UserLettersList";
import {useRole} from "@/security/hooks";
import {
  Badge,
  Box,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {FC} from "react";
import {useGetOne, useRecordContext} from "react-admin";
import {Contact} from "./ContactDetails";
import {PersonalDetails} from "./PersonalDetails";
import {PersonalInfos} from "./PersonalInfos";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};

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

  const adminView =
    !role.isMonitor() &&
    !role.isOrganizer() &&
    !isMonitorProfile &&
    !(role.isManager() && isTeacherProfile) &&
    !(role.isTeacher() && isStudentProfile) &&
    !isAdminProfil &&
    !isManagerProfil;

  const allTabs = [
    {
      id: "profile",
      label: "Détails du Profil",
      show: true,
      content: (
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
      ),
    },
    {
      id: "comments",
      label: "Commentaires",
      show: isStudentProfile,
      content: <CommentList studentId={profile?.id ?? ""} close={false} />,
    },
    {
      id: "fees",
      label: "Liste des Frais",
      show:
        isStudentProfile &&
        (role.isManager() || role.isAdmin() || role.isMonitor()),
      content: (
        <FeeList
          studentId={profile?.id ?? ""}
          studentRef={profile?.ref ?? ""}
        />
      ),
    },
    {
      id: "user-letters",
      label: "Boîte aux lettres",
      show: adminView || (role.isAdmin() && isStaffProfil),
      content: <UserLettersList />,
    },
    {
      id: "letters",
      label: (
        <Badge
          badgeContent={letterStats?.pending ?? 0}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.8rem",
              height: "1.4rem",
              width: "1.4rem",
              right: "-0.2rem",
            },
          }}
        >
          Boîte aux lettres
        </Badge>
      ),
      show:
        !isMonitorProfile &&
        !isStudentProfile &&
        !isTeacherProfile &&
        !isStaffProfil &&
        (role.isAdmin() || role.isManager()),
      content: <LettersList stats={letterStats} />,
    },
  ];

  const tabValues = allTabs.map((tab) => tab.id);

  const {tabIndex, handleTabChange} = useTabManager({
    values: tabValues,
    defaultTabIndex: 0,
  });

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

  const visibleTabs = allTabs.filter((tab) => tab.show);
  const visibleTabIndexes = allTabs
    .map((tab, idx) => (tab.show ? idx : null))
    .filter((idx) => idx !== null) as number[];
  const currentTabIndex = visibleTabIndexes.includes(tabIndex)
    ? visibleTabs.findIndex((_, i) => visibleTabIndexes[i] === tabIndex)
    : 0;

  return (
    <Box sx={{width: "100%"}}>
      <Tabs
        value={currentTabIndex}
        onChange={(_, newValue) => {
          const absoluteIndex = visibleTabIndexes[newValue];
          handleTabChange(absoluteIndex ?? 0);
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "width": "100%",
          "borderBottom": "1px solid rgba(0, 0, 0, 0.12)",

          "& .MuiTab-root": {
            "textTransform": "none",
            "minWidth": 120,
            "fontSize": "0.9rem",
            "fontWeight": 400,
            "&.Mui-selected": {
              fontWeight: 500,
            },
          },
        }}
      >
        {visibleTabs.map((tab) => (
          <Tab key={tab.id} label={tab.label} data-testid={`${tab.id}-tab`} />
        ))}
      </Tabs>
      {visibleTabs.map((tab, idx) => (
        <TabPanel key={tab.id} value={currentTabIndex} index={idx}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};
