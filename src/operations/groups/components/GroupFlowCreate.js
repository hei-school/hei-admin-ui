import {
  Dialog,
  DialogActions as MuiDialogActions,
  DialogTitle,
  Button,
  DialogContent,
  Typography,
} from "@mui/material";
import {useGetList, useListContext, useRecordContext} from "react-admin";
import {GroupFlowMoveTypeEnum} from "@haapi/typescript-client";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {CustomAutoComplete} from "../../utils/CustomAutoComplete";
import {useNotify} from "../../../hooks";
import {PALETTE_COLORS} from "../../../ui/constants";
import groupFlowProvider from "../../../providers/groupFlowProvider";

const DIALOG_CONTENT_STYLE = {
  width: "450px",
  margin: 1,
};

const DialogActions = () => {
  return (
    <MuiDialogActions>
      <Button
        type="submit"
        fullWidth
        sx={{
          "bgcolor": PALETTE_COLORS.primary,
          "color": PALETTE_COLORS.white,
          "&:hover": {
            color: PALETTE_COLORS.primary,
          },
        }}
      >
        Envoyer
      </Button>
    </MuiDialogActions>
  );
};

const DIALOG_TITLE_PROPS = {
  color: PALETTE_COLORS.white,
  fontWeight: "bold",
};

const moveStudent = async (messageOnSuccess, payload, notify, toggle) => {
  return await groupFlowProvider
    .saveOrUpdate(payload)
    .then(() =>
      notify(messageOnSuccess, {
        type: "success",
      })
    )
    .catch(() =>
      notify("Une erreur s'est produite.", {
        type: "error",
      })
    )
    .finally(() => toggle());
};

export const JoinGroupDialog = ({isOpen, toggle}) => {
  const listContext = useListContext();
  const queryStudents = useGetList("students");
  const params = useParams();
  const notify = useNotify();

  const groupId = params?.id;
  const totalStudents = queryStudents.data ?? [];

  const groupStudentsIds = listContext.data.map(
    (groupStudent) => groupStudent?.id
  );
  const students = totalStudents.filter(
    (student) => !groupStudentsIds.includes(student?.id)
  );

  const {control, handleSubmit} = useForm({
    defaultValues: {
      student: {id: "", ref: ""},
    },
  });

  const onSubmit = async (data) => {
    if (!data) return null;

    const payload = [
      {
        MoveType: GroupFlowMoveTypeEnum.JOIN,
        studentId: data.student.id,
        groupId: groupId,
      },
    ];

    moveStudent(`L'étudiant a été inséré avec succès`, payload, notify, toggle);
  };

  return (
    <Dialog open={isOpen} onClose={toggle}>
      <DialogTitle
        sx={{bgcolor: PALETTE_COLORS.primary}}
        {...DIALOG_TITLE_PROPS}
      >
        Insérer un étudiant
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={DIALOG_CONTENT_STYLE}>
          <CustomAutoComplete
            control={control}
            name="student"
            data={students ?? []}
            label="Référence de l'étudiant"
            data-testid="students-autocomplete"
            fullWidth
          />
          <DialogActions />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export const MoveStudentDialog = ({toggle, isOpen}) => {
  const queryGroups = useGetList("groups");
  const queryStudents = useGetList("students");
  const params = useParams();
  const notify = useNotify();
  const record = useRecordContext();

  const leftGroupId = params?.id;
  const groups = queryGroups.data?.filter((group) => group.id != leftGroupId);
  const students = queryStudents.data;

  const {control, handleSubmit} = useForm({
    defaultValues: {
      group: {id: "", ref: ""},
    },
  });

  const studentRef =
    record && students
      ? students.find((student) => student.id === record.id)?.ref
      : "";

  const onSubmit = async (data) => {
    if (!data || !record) return null;

    const payload = [
      {
        MoveType: GroupFlowMoveTypeEnum.LEAVE,
        studentId: record.id,
        groupId: leftGroupId,
      },
      {
        MoveType: GroupFlowMoveTypeEnum.JOIN,
        studentId: record.id,
        groupId: data.group.id,
      },
    ];

    moveStudent(
      `L'étudiant ${studentRef} a été migré avec succès`,
      payload,
      notify,
      toggle
    );
  };

  return (
    <Dialog open={isOpen} onClose={toggle}>
      <DialogTitle
        sx={{bgcolor: PALETTE_COLORS.primary}}
        {...DIALOG_TITLE_PROPS}
      >
        Migrer un étudiant
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={DIALOG_CONTENT_STYLE}>
          <CustomAutoComplete
            control={control}
            name="group"
            data={groups ?? []}
            label="Référence du groupe"
            data-testid="groups-autocomplete"
            fullWidth
          />
          <DialogActions />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export const LeaveGroupDialog = ({toggle, isOpen}) => {
  const params = useParams();
  const queryStudents = useGetList("students");

  const notify = useNotify();
  const record = useRecordContext();

  const leftGroupId = params?.id;
  const students = queryStudents.data;

  const studentRef =
    record && students
      ? students.find((student) => student.id === record.id)?.ref
      : "";

  const onSubmit = async () => {
    if (!record) return null;

    const payload = [
      {
        MoveType: GroupFlowMoveTypeEnum.LEAVE,
        studentId: record.id,
        groupId: leftGroupId,
      },
    ];

    moveStudent(
      `L'étudiant ${studentRef} a été supprimé avec succès`,
      payload,
      notify,
      toggle
    );
  };

  return (
    <Dialog open={isOpen} onClose={toggle}>
      <DialogTitle sx={{bgcolor: "red"}} {...DIALOG_TITLE_PROPS}>
        Supprimer un étudiant
      </DialogTitle>
      <DialogContent sx={DIALOG_CONTENT_STYLE}>
        <Typography>
          Êtes-vous sûr de vouloir supprimer l'étudiant {studentRef} de ce
          groupe ?
        </Typography>
        <Typography variant="caption" color="red">
          * Cette action est irréversible.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            "width": 100,
            "bgcolor": "red",
            "color": PALETTE_COLORS.white,
            "&:hover": {
              color: "red",
            },
          }}
          onClick={onSubmit}
        >
          Oui
        </Button>
        <Button
          sx={{
            "width": 100,
            "bgcolor": PALETTE_COLORS.primary,
            "color": PALETTE_COLORS.white,
            "&:hover": {
              color: PALETTE_COLORS.primary,
            },
          }}
          onClick={toggle}
        >
          Non
        </Button>
      </DialogActions>
    </Dialog>
  );
};
