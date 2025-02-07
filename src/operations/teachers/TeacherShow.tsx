import {PALETTE_COLORS} from "@/haTheme";
import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {Show} from "@/operations/common/components/Show";
import {useRole} from "@/security/hooks";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {Inventory} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FC} from "react";
import {Button, EditButton, useRecordContext, useRedirect} from "react-admin";

const ActionsOnShow: FC = () => {
  const {id: teacherId} = useRecordContext();
  const navigate = useRedirect();
  const {isAdmin} = useRole();
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
      {isAdmin() ? (
        <Button
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
          onClick={() => {
            navigate(`/teachers/${teacherId}/docs/teachers/OTHER`);
          }}
        />
      ) : (
        ""
      )}
    </Box>
  );
};

const TeacherShow = () => {
  return (
    <Show
      sx={{
        "& .RaShow-card": {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
      actions={false}
      title="Enseignants"
    >
      <ProfileLayout
        role={WhoamiRoleEnum.TEACHER}
        actions={<ActionsOnShow />}
        isTeacherProfile
      />
    </Show>
  );
};

export default TeacherShow;
