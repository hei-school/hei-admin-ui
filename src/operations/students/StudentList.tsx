import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {ButtonBase, CreateButton, HaActionWrapper} from "@/ui/haToolbar";
import {NewImportButton} from "@/ui/haToolbar/importButton/NewImportButton";
import {NOOP_ID} from "@/utils/constants";
import {
  Add as AddIcon,
  Download,
  WorkOff as HaveBeenWorking,
  School as SchoolIcon,
  UploadFile as UploadFileIcon,
  WorkHistory as WillWorking,
  Work as WorkIcon,
} from "@mui/icons-material";
import {Avatar, Box} from "@mui/material";
import {useState} from "react";
import {
  Button,
  EditButton,
  FunctionField,
  CreateButton as RaCreateButton,
  ShowButton,
  TextField,
  useGetOne,
  useRedirect,
} from "react-admin";
import {ListHeader} from "../common/components";
import {getCommonListHeaderContent} from "../common/utils/commonListHeaderContent";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import {StudentFilterExport} from "./utils/StudentFilterExport";

const ListActions = () => {
  const {isManager, isAdmin} = useRole();
  const [openDialog, setOpenDialog] = useState(false);
  const redirect = useRedirect();
  const notify = useNotify();

  const {refetch, isLoading, isFetching} = useGetOne(
    "import-students",
    {id: NOOP_ID},
    {
      enabled: false,
      onSuccess: (data) => {
        if (data?.data) {
          const link = document.createElement("a");
          link.href = data.data;
          link.download = true as any;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          notify("URL du template non trouvée", {type: "warning"});
        }
      },
    }
  );

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleDownloadTemplate = () => {
    refetch();
  };

  return (
    <Box>
      {(isManager() || isAdmin()) && (
        <Box>
          <CreateButton resource="students" />
          <HaActionWrapper>
            <ButtonBase
              data-testid="create-fees-button"
              icon={<AddIcon />}
              onClick={() => redirect("/fees/create")}
            >
              Ajouter des frais
            </ButtonBase>
          </HaActionWrapper>
          <Button
            startIcon={
              <UploadFileIcon
                sx={{
                  fontSize: "1.5rem",
                }}
              />
            }
            onClick={handleDownloadTemplate}
            sx={{
              width: "100%",
              justifyContent: "start",
              paddingLeft: "20px",
              paddingTop: "7px",
              paddingBottom: "7px",
              color: "#474645",
              textTransform: "none",
            }}
            label="Template"
            disabled={isLoading || isFetching}
          />
          <NewImportButton />
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

export const StudentList = () => {
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
      icon: <WorkIcon fontSize="large" />,
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
              size="medium"
              variant="contained"
              style={{
                margin: "0px",
                backgroundColor: PALETTE_COLORS.primary,
                color: PALETTE_COLORS.white,
                marginTop: "15px",
                marginLeft: "5px",
              }}
            />
          )
        }
      />
      <HaList
        resource="students"
        icon={<SchoolIcon />}
        title={"Liste des étudiants"}
        mainSearch={{label: "Référence étudiant", source: "ref"}}
        actions={<ListActions />}
      >
        <FunctionField
          render={(record) => (
            <Avatar src={record.profile_picture} alt={record.first_name} />
          )}
          label="Profil"
        />
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
};
