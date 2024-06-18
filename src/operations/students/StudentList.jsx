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
import {DEFAULT_ID} from "@/utils/constants";

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

  const {data: stats = {}} = useGetOne("stats", {id: DEFAULT_ID});

  const headerCardContent = [
    {
      title: "Étudiants",
      icon: <StudentIcon fontSize="medium" />,
      total: stats.total_students ?? 0,
    },
    {
      title: "Alternants",
      icon: <WorkIcon fontSize="medium" />,
      total: stats.students_alternating ?? 0,
    },
    {
      title: "Femmes",
      icon: <FemaleIcon fontSize="medium" />,
      total: stats.women ?? 0,
    },
    {
      title: "Hommes",
      icon: <MaleIcon fontSize="medium" />,
      total: stats.men ?? 0,
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
