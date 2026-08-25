import {PALETTE_COLORS} from "@/haTheme";
import {Show} from "@/operations/common/components/Show";
import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";
import {Edit as EditIcon, Inventory} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FC} from "react";
import {Button, EditButton, useRecordContext, useRedirect} from "react-admin";
import {useParams} from "react-router-dom";
import {ProfileLayout} from "../common/components/ProfileLayout";

interface ActionsOnShowProps {
  staffId?: string;
}

const ActionsOnShow: FC<ActionsOnShowProps> = ({staffId}) => {
  const record = useRecordContext();
  const redirect = useRedirect();

  const resolvedStaffId = staffId ?? record?.id;

  if (!resolvedStaffId) return null;

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
        to={`/staffmembers/${resolvedStaffId}/edit`}
        startIcon={<EditIcon />}
        data-testid="profile-edit-button"
        variant="outlined"
        size="medium"
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "0.2rem",
          backgroundColor: PALETTE_COLORS.white,
          color: PALETTE_COLORS.primary,
          padding: "0.5rem 1.5rem",
          borderRadius: "0.4rem",
          width: "100%",
        }}
      />

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
        onClick={() => redirect(`/staff/${resolvedStaffId}/docs/staff/OTHER`)}
      />
    </Box>
  );
};

export const StaffShow = () => {
  const {id: staffId} = useParams();

  if (!staffId) return null;

  return <StaffShowContent staffId={staffId} />;
};

interface StaffShowContentProps {
  staffId: string;
}

const StaffShowContent: FC<StaffShowContentProps> = ({staffId}) => {
  return (
    <Show
      resource="staffmembers"
      id={staffId}
      title="Membre staff"
      actions={false}
      sx={{
        "& .RaShow-card": {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <ProfileLayout
        role={WhoamiRoleEnum.STAFF_MEMBER}
        isStaffProfil
        actions={<ActionsOnShow staffId={staffId} />}
      />
    </Show>
  );
};

export default StaffShow;
