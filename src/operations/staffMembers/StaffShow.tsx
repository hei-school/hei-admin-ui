import {PALETTE_COLORS} from "@/haTheme";
import {Show} from "@/operations/common/components/Show";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {Edit as EditIcon, Inventory} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FC} from "react";
import {Button, EditButton, useRecordContext, useRedirect} from "react-admin";
import {ProfileLayout} from "../common/components/ProfileLayout";

export const ActionsOnShow: FC = () => {
  const {id} = useRecordContext();
  const navigate = useRedirect();

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
        to={`/staffmembers/${id}/edit`}
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
        onClick={() => {
          navigate(`/staff/${id}/docs/staff/OTHER`);
        }}
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
    </Box>
  );
};
const StaffShow = () => (
  <Show title="Membre staff" actions={false}>
    <ProfileLayout
      role={WhoamiRoleEnum.STAFF_MEMBER}
      isStaffProfil
      actions={<ActionsOnShow />}
    />
  </Show>
);
export default StaffShow;
