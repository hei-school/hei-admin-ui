import {useState} from "react";
import {
  CreateButton as RaCreateButton,
  EditButton,
  ShowButton,
  TextField,
  useGetOne,
  useRedirect,
  Button,
} from "react-admin";
import {
  Add as AddIcon,
  School as SchoolIcon,
  UploadFile as UploadFileIcon,
  Work as WorkIcon,
  WorkHistory as WillWorking,
  WorkOff as HaveBeenWorking,
  Download,
} from "@mui/icons-material";
import {Box} from "@mui/material";
import {useRole} from "@/security/hooks";
import {
  ButtonBase,
  CreateButton,
  ExportButton,
  HaActionWrapper,
  ImportButton,
} from "@/ui/haToolbar";
import {HaList} from "@/ui/haList";
import {COMMON_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {PALETTE_COLORS} from "@/haTheme";
import {exportData, importHeaders} from "../utils";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  validateUserData,
} from "../utils/userImportConf";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import {ListHeader} from "../common/components";
import {transformUsersData} from "./importConf";
import {NOOP_ID} from "@/utils/constants";
import {getCommonListHeaderContent} from "../common/utils/commonListHeaderContent";
import studentProvider from "@/providers/studentProvider";
import {get27thOfMonth} from "@/utils/date";
import {StudentFilterExport} from "./utils/StudentFilterExport";

const ListActions = () => {
  const {isManager, isAdmin} = useRole();
  const [openDialog, setOpenDialog] = useState(false);
  const redirect = useRedirect();
  const date = new Date();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      {(isManager() || isAdmin()) && (
        <Box>
          <CreateButton />
          <HaActionWrapper>
            <ButtonBase
              data-testid="create-fees-button"
              icon={<AddIcon />}
              onClick={() => redirect("/fees/create")}
            >
              Ajouter des frais
            </ButtonBase>
          </HaActionWrapper>
          <ExportButton
            onExport={() => exportData([], importHeaders, "template_students")}
            label="Template"
            icon={<UploadFileIcon />}
          />
          <ImportButton
            validateData={validateUserData}
            resource="étudiants"
            provider={(data) => {
              return studentProvider.saveOrUpdate(data, {
                meta: {
                  dueDatetime: get27thOfMonth(
                    date.getFullYear(),
                    date.getMonth()
                  ),
                },
              });
            }}
            transformData={transformUsersData}
            minimalHeaders={minimalUserHeaders}
            optionalHeaders={optionalUserHeaders}
          />
        </Box>
      )}
      <Button
        startIcon={<Download />}
        onClick={handleOpenDialog}
        label="Exporter"
        sx={{
          color: "black",
          opacity: "0.8",
          padding: "0.5rem 1.1rem",
          textTransform: "none",
          gap: "0.8rem",
          width: "100%",
          justifyContent: "flex-start",
        }}
      />
      {openDialog && (
        <StudentFilterExport open={openDialog} onClose={handleCloseDialog} />
      )}
      <ProfileFilters resource="students" />
    </Box>
  );
};

function StudentList() {
  const {isManager, isAdmin} = useRole();

  const {
    data: stats = {
      total_groups: "...",
      total_students: "...",
      women: "...",
      men: "...",
      students_alternating: "...",
    },
  } = useGetOne("stats", {id: NOOP_ID, meta: {resource: "users"}});

  const headerCardContent = [
    ...getCommonListHeaderContent(stats),
    {
      title: "Collaborateurs",
      icon: <WorkIcon fontSize="medium" />,
      total: stats.students_alternating.total,
      statDetails: [
        {
          icon: <WorkIcon fontSize="small" color="success" />,
          total: stats.students_alternating.working,
          title: "A une expérience professionnelle",
        },
        {
          icon: <WillWorking fontSize="small" />,
          total: stats.students_alternating.will_work,
          title: "Aura une expérience professionnelle",
        },
        {
          icon: <HaveBeenWorking fontSize="small" color="warning" />,
          total: stats.students_alternating.have_been_working,
          title: "A eu une expérience professionnelle",
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
          (isManager() || isAdmin()) && (
            <RaCreateButton
              {...COMMON_BUTTON_PROPS}
              size="medium"
              SX={{
                m: "0px",
              }}
            />
          )
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
        {isManager() || isAdmin() ? (
          <EditButton sx={{color: PALETTE_COLORS.yellow}} />
        ) : (
          <ShowButton sx={{color: PALETTE_COLORS.yellow}} />
        )}
      </HaList>
    </Box>
  );
}

export default StudentList;
