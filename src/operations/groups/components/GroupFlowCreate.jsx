import {
  Dialog,
  DialogActions as MuiDialogActions,
  DialogTitle,
  Button,
  DialogContent,
  Typography,
} from "@mui/material";
import {
  Confirm,
  RefreshButton,
  useGetList,
  useListContext,
  useRecordContext,
  useRefresh,
} from "react-admin";
import {GroupFlowMoveTypeEnum} from "@haapi/typescript-client";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {CustomAutoComplete} from "../../utils/CustomAutoComplete";
import {useNotify} from "../../../hooks";
import {PALETTE_COLORS} from "@/haTheme";
import groupFlowProvider from "@/providers/groupFlowProvider";

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

const useMoveStudent = () => {
  const notify = useNotify();
  const refresh = useRefresh();

  const moveStudent = async (messageOnSuccess, payload, toggle) => {
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
      .finally(() => {
        toggle();
        refresh();
      });
  };
  return {moveStudent};
};

export const JoinGroupDialog = ({isOpen, toggle}) => {
  const {id: groupId} = useParams();

  const listContext = useListContext();

  const {data: students = []} = useGetList("students");

  const {moveStudent} = useMoveStudent();

  const groupStudentsIds = listContext.data.map(
    (groupStudent) => groupStudent?.id
  );

  const filteredStudents = students
    .filter((student) => !groupStudentsIds.includes(student?.id))
    .map((student) => ({id: student?.id, ref: student?.ref}));

  const {control, handleSubmit} = useForm({
    defaultValues: {
      student: {id: "", ref: ""},
    },
  });

  const onSubmit = async (data) => {
    if (!data) return;

    const payload = [
      {
        move_type: GroupFlowMoveTypeEnum.JOIN,
        student_id: data.student.id,
        group_id: groupId,
      },
    ];

    moveStudent(`L'étudiant a été inséré avec succès`, payload, toggle);
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
            data={filteredStudents ?? []}
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
  const {id: fromGroupId} = useParams();

  const {data: groups = []} = useGetList("groups");

  const {data: students = []} = useGetList("students");

  const {moveStudent} = useMoveStudent();
  const record = useRecordContext();

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
    if (!data || !record) return;

    const payload = [
      {
        move_type: GroupFlowMoveTypeEnum.LEAVE,
        student_id: record.id,
        group_id: fromGroupId,
      },
      {
        move_type: GroupFlowMoveTypeEnum.JOIN,
        student_id: record.id,
        group_id: data.group.id,
      },
    ];

    moveStudent(
      `L'étudiant ${studentRef} a été migré avec succès`,
      payload,
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
            data={groups.filter((group) => group.id != fromGroupId) ?? []}
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
  const {id: fromGroupId} = useParams();

  const {data: students = []} = useGetList("students");

  const record = useRecordContext();

  const {moveStudent} = useMoveStudent();

  const studentRef =
    record && students
      ? students.find((student) => student.id === record.id)?.ref
      : "";

  const onSubmit = async () => {
    if (!record) return;

    const payload = [
      {
        move_type: GroupFlowMoveTypeEnum.LEAVE,
        student_id: record.id,
        group_id: fromGroupId,
      },
    ];

    moveStudent(
      `L'étudiant ${studentRef} a été supprimé avec succès`,
      payload,
      toggle
    );
  };

  return (
    <Confirm
      isOpen={isOpen}
      onClose={toggle}
      title="Supprimer un étudiant"
      content={
        <div>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'étudiant {studentRef} de ce
            groupe ?
          </Typography>
          <Typography variant="caption" color="red">
            * Cette action est irréversible.
          </Typography>
        </div>
      }
      onConfirm={onSubmit}
    />
  );
};
