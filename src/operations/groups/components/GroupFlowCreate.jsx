import {PALETTE_COLORS} from "@/haTheme";
import dataProvider from "@/providers/dataProvider";
import groupFlowProvider from "@/providers/groupFlowProvider";
import {GroupFlowMoveTypeEnum} from "@haapi/typescript-client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions as MuiDialogActions,
  Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {Confirm, useGetList, useRecordContext, useRefresh} from "react-admin";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {useNotify} from "../../../hooks";
import {CustomAutoComplete} from "../../utils/CustomAutoComplete";

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

  const [ref, setRef] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    dataProvider
      .getList("students", {
        filter: {exclude_groups: [groupId], ref},
        pagination: {page: 1, perPage: 10},
      })
      .then((result) => setStudents(result?.data));
  }, [ref]);

  const {moveStudent} = useMoveStudent();

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
            onInputChange={setRef}
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
  const {id: fromGroupId} = useParams();

  const [ref, setRef] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    dataProvider
      .getList("groups", {filter: {ref}, pagination: {page: 1, perPage: 10}})
      .then((result) => setGroups(result?.data));
  }, [ref]);

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

    moveStudent(`L'étudiant a été migré avec succès`, payload, toggle);
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
            onInputChange={setRef}
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

    moveStudent(`L'étudiant a été supprimé avec succès`, payload, toggle);
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
