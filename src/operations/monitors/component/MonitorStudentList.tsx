import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {useToggle} from "@/hooks/useToggle";

import CustomAutocompleteArrayInput from "@/operations/cor/components/CustomAutocompleteArrayInput";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {Group} from "@haapi-b0fc7615/typescript-client";
import {
  Add,
  GroupOutlined,
  SaveOutlined,
  WarningAmberRounded,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import {
  Button,
  Confirm,
  FunctionField,
  ShowButton,
  SimpleForm,
  TextField,
  Toolbar,
  useCreate,
} from "react-admin";
import {useWatch} from "react-hook-form";
import {useParams} from "react-router-dom";

export const MonitorStudentList = () => {
  const {isMonitor} = useRole();
  const params = useParams();
  const monitorId = isMonitor() ? authProvider.getCachedWhoami().id : params.id;
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const [create] = useCreate();
  const notify = useNotify();

  const onConfirm = (students_ids: string[]) => {
    create(
      "monitor-students",
      {
        data: {
          students_ids,
        },
        meta: {
          monitorId,
        },
      },
      {
        onSuccess: () => {
          notify("Étudiants liés avec succès", {type: "success"});
          toggleShowCreate();
        },
        onError: () => {
          notify("Erreur lors de l'insertion", {type: "error"});
        },
      }
    );
  };

  return (
    <>
      <HaList
        resource="monitor-students"
        icon={<GroupOutlined />}
        title="Liste des étudiants"
        mainSearch={{label: "Prénom·s", source: "first_name"}}
        actions={
          <Button
            onClick={toggleShowCreate}
            label="Lier des étudiants"
            startIcon={<Add />}
            sx={{
              width: "100%",
              justifyContent: "start",
              paddingLeft: "15px",
              paddingTop: "7px",
              paddingBottom: "7px",
              color: "#474645",
              textTransform: "none",
            }}
          />
        }
        datagridProps={{
          rowClick: isMonitor() ? true : false,
        }}
        listProps={{
          queryOptions: {
            meta: {
              monitorId,
            },
          },
        }}
      >
        <FunctionField
          label="Profil"
          render={(record) => <Avatar src={record.profile_picture} />}
        />
        <TextField source="ref" label="Référence" />
        <TextField source="first_name" label="Prénom·s" />
        <TextField source="last_name" label="Nom·s" />
        <FunctionField
          label="Groupe"
          render={(record) => {
            const groups = record?.groups;
            return groups && groups.length > 0 ? (
              <span>{groups.map((group: Group) => group.ref).join(", ")}</span>
            ) : (
              <span style={{color: PALETTE_COLORS.red}}>Aucun groupe</span>
            );
          }}
        />
        {isMonitor() && <ShowButton sx={{color: PALETTE_COLORS.yellow}} />}
      </HaList>
      <Dialog
        title="insert students"
        open={showCreate}
        onClose={toggleShowCreate}
      >
        <SimpleForm
          toolbar={<CreateToolbarWithConfirm onConfirm={onConfirm} />}
        >
          <CustomAutocompleteArrayInput
            label="Prénom·s des étudiants"
            resource="students"
            source="students_ids"
            searchFields={["first_name"]}
          />
        </SimpleForm>
      </Dialog>
    </>
  );
};

const CreateToolbarWithConfirm = ({
  onConfirm,
}: {
  onConfirm: (studentIds: string[]) => void;
}) => {
  const [open, handleDialogOpen, handleDialogClose] = useToggle();
  const studentIds = useWatch<{students_ids: string[]}>({name: "students_ids"});

  return (
    <Toolbar>
      <Button
        label="Sauvegarder les étudiants"
        variant="contained"
        disabled={!studentIds}
        sx={{
          my: 3,
          p: 2,
          fontWeight: 600,
          letterSpacing: 0.5,
          fontSize: 16,
          textTransform: "none",
        }}
        onClick={() => handleDialogOpen(true)}
      />
      <Confirm
        isOpen={open}
        confirmColor="primary"
        confirm="Sauvegarder"
        ConfirmIcon={SaveOutlined}
        title="Sauvegarde des étudiants"
        content={
          <Box
            sx={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,244,204,0.95))",
              borderRadius: 3,
              border: `1px solid ${PALETTE_COLORS.yellow}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              p: 3,
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <WarningAmberRounded
                  sx={{color: PALETTE_COLORS.yellow, fontSize: 40}}
                />
                <Typography variant="h5" fontWeight={700}>
                  Validation administrative requise
                </Typography>
              </Stack>
              <Typography variant="body1">
                La liaison des étudiants nécessite encore une validation
                officielle des administrations.
              </Typography>
              <Alert
                severity="warning"
                icon={<WarningAmberRounded fontSize="inherit" />}
                sx={{
                  backgroundColor: "rgba(255, 214, 102, 0.2)",
                  color: "#4a2b00",
                }}
              >
                <AlertTitle>Sanctions disciplinaires possibles</AlertTitle>
                Des sanctions seront émises contre toute personne procédant à
                une liaison injustifiée. Lier des étudiants hors de votre
                responsabilité est considéré comme une atteinte à la vie privée
                et expose à de lourdes conséquences.
              </Alert>
              <Divider flexItem />
            </Stack>
          </Box>
        }
        onConfirm={() => onConfirm((studentIds as null | string[]) ?? [])}
        onClose={handleDialogClose}
      />
    </Toolbar>
  );
};
