import {PALETTE_COLORS} from "@/haTheme";
import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {Show} from "@/operations/common/components/Show";
import {useRole} from "@/security/hooks";
import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";
import {Inventory} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FC} from "react";
import {Button, EditButton, useRecordContext, useRedirect} from "react-admin";
import {useParams} from "react-router-dom";

interface ActionsOnShowProps {
  teacherId?: string;
}

const ActionsOnShow: FC<ActionsOnShowProps> = ({teacherId}) => {
  const record = useRecordContext();
  const redirect = useRedirect();
  const {isAdmin} = useRole();

  const resolvedTeacherId = teacherId ?? record?.id;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1vh",
        marginTop: "5vh",
      }}
    >
      <EditButton
        size="medium"
        variant="outlined"
        sx={{
          backgroundColor: PALETTE_COLORS.white,
          color: PALETTE_COLORS.primary,
          padding: "0.5rem 1.5rem",
          borderRadius: "0.4rem",
          width: "100%",
        }}
      />

      {isAdmin() && resolvedTeacherId && (
        <Button
          data-testid="teacher-docs-button"
          startIcon={<Inventory />}
          label="Documents"
          size="medium"
          variant="outlined"
          sx={{
            backgroundColor: PALETTE_COLORS.white,
            color: PALETTE_COLORS.primary,
            padding: "0.5rem 1.5rem",
            borderRadius: "0.4rem",
            width: "100%",
          }}
          onClick={() =>
            redirect(`/teachers/${resolvedTeacherId}/docs/teachers/OTHER`)
          }
        />
      )}
    </Box>
  );
};

export const TeacherShow = () => {
  const {id: teacherId} = useParams();

  if (!teacherId) return null;

  return <TeacherShowContent teacherId={teacherId} />;
};

interface TeacherShowContentProps {
  teacherId: string;
}

const TeacherShowContent = ({teacherId}: TeacherShowContentProps) => {
  return (
    <Show
      resource="teachers"
      id={teacherId}
      title="Enseignants"
      actions={false}
      sx={{
        "& .RaShow-card": {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <ProfileLayout
        role={WhoamiRoleEnum.TEACHER}
        actions={<ActionsOnShow teacherId={teacherId} />}
        isTeacherProfile
      />
    </Show>
  );
};

export default TeacherShow;
