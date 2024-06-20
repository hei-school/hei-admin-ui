import {
  CreateButton as RaCreateButton,
  EditButton,
  ShowButton,
  TextField,
  useGetList,
  useGetOne,
} from "react-admin";
import {
  Group as GroupIcon,
  Diversity2 as StudentIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  School as SchoolIcon,
  UploadFile as UploadFileIcon,
  Work as WorkIcon,
  CheckCircle as EnabledIcon,
  PersonOff as DisabledIcon,
  PersonRemove as SuspendedIcon,
  WorkHistory as WillWorking,
  WorkOff as HaveBeenWorking,
} from "@mui/icons-material";
import {Sex, WorkStudyStatus} from "@haapi/typescript-client";
import {Box} from "@mui/material";
import {useRole} from "@/security/hooks";
import {CreateButton, ExportButton, ImportButton} from "@/ui/haToolbar";
import {HaList} from "@/ui/haList";
import {COMMON_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {PALETTE_COLORS} from "@/haTheme";
import {exportData, exportHeaders, importHeaders} from "../utils";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  validateUserData,
} from "../utils/userImportConf";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import {ListHeader} from "../common/components";
import {transformStudentData} from "./importConf";
import studentProvider from "@/providers/studentProvider";
import {NOOP_ID} from "@/utils/constants";

const ListActions = () => {
  const {isManager} = useRole();
  return (
    <Box>
      {isManager() && (
        <Box>
          <CreateButton />
          <ExportButton
            onExport={() => exportData([], importHeaders, "template_students")}
            label="Template"
            icon={<UploadFileIcon />}
          />
          <ImportButton
            validateData={validateUserData}
            resource="étudiants"
            provider={studentProvider.saveOrUpdate}
            transformData={transformStudentData}
            minimalHeaders={minimalUserHeaders}
            optionalHeaders={optionalUserHeaders}
          />
        </Box>
      )}
      <ExportButton
        onExport={(list) => exportData(list, exportHeaders, "students")}
      />
      <ProfileFilters resource="students" />
    </Box>
  );
};

function StudentList() {
  const {isManager} = useRole();

  // const {
  //   data: stats = {
  //     total_groups: 0,
  //     total_students: 0,
  //     women: 0,
  //     men: 0,
  //     students_alternating: 0,
  //   },
  // } = useGetOne("stats", {id: NOOP_ID});
  const stats = {
    total_students: 0,
    students_alternating: {
      total: 0,
      working: 0,
      have_been_working: 0,
      not_working: 0,
      will_work: 0,
    },
    men: {
      total: 0,
      disabled: 0,
      enabled: 0,
      suspended: 0,
    },
    women: {
      total: 0,
      disabled: 0,
      enabled: 0,
      suspended: 0,
    },
    total_groups: 0,
  };

  const headerCardContent = [
    {
      title: "Étudiants",
      icon: <StudentIcon fontSize="medium" />,
      total: stats.men.total + stats.women.total,
      statDetails: [
        {
          icon: <EnabledIcon fontSize="medium" color="success" />,
          total: stats.women.enabled + stats.men.enabled,
        },
        {
          icon: <SuspendedIcon fontSize="medium" color="warning" />,
          total: stats.women.suspended + stats.men.suspended,
        },
        {
          icon: <DisabledIcon fontSize="medium" color="error" />,
          total: stats.women.disabled + stats.men.disabled,
        },
      ],
    },
    {
      title: "Alternants",
      icon: <WorkIcon fontSize="medium" />,
      total: stats.students_alternating.total,
      statDetails: [
        {
          icon: <WorkIcon fontSize="medium" color="success" />,
          total: stats.students_alternating.working,
        },
        {
          icon: <WillWorking fontSize="medium" />,
          total: stats.students_alternating.will_work,
        },
        {
          icon: <HaveBeenWorking fontSize="medium" color="warning" />,
          total: stats.students_alternating.have_been_working,
        },
      ],
    },
    {
      title: "Femmes",
      icon: <FemaleIcon fontSize="medium" />,
      total: stats.women.total,
      statDetails: [
        {
          icon: <EnabledIcon fontSize="medium" color="success" />,
          total: stats.women.enabled,
        },
        {
          icon: <SuspendedIcon fontSize="medium" color="warning" />,
          total: stats.women.suspended,
        },
        {
          icon: <DisabledIcon fontSize="medium" color="error" />,
          total: stats.women.disabled,
        },
      ],
    },
    {
      title: "Hommes",
      icon: <MaleIcon fontSize="medium" />,
      total: stats.men.total,
      statDetails: [
        {
          icon: <EnabledIcon fontSize="medium" color="success" />,
          total: stats.men.enabled,
        },
        {
          icon: <SuspendedIcon fontSize="medium" color="warning" />,
          total: stats.men.suspended,
        },
        {
          icon: <DisabledIcon fontSize="medium" color="error" />,
          total: stats.men.disabled,
        },
      ],
    },
  ];

  return (
    <Box>
      <ListHeader
        cardContents={headerCardContent}
        title="Liste des étudiants"
        action={
          <RaCreateButton
            {...COMMON_BUTTON_PROPS}
            size="medium"
            SX={{
              m: "0px",
            }}
          />
        }
      />
      <HaList
        icon={<SchoolIcon />}
        title={"Liste des étudiants"}
        mainSearch={{label: "Prénom·s", source: "first_name"}}
        actions={<ListActions />}
      >
        <TextField source="ref" label="Référence" />
        <TextField source="first_name" label="Prénom·s" />
        <TextField source="last_name" label="Nom·s" />
        {isManager() ? (
          <EditButton sx={{color: PALETTE_COLORS.yellow}} />
        ) : (
          <ShowButton sx={{color: PALETTE_COLORS.yellow}} />
        )}
      </HaList>
    </Box>
  );
}

export default StudentList;
