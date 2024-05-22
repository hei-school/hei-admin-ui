import { Typography, Box, Avatar } from "@mui/material";
import { EditButton, SimpleShowLayout, useShowContext } from "react-admin"
import { useRole } from "@/security/hooks";
import { Show } from "../common/components";
import GroupStudentList from "./components/GroupStudentList";
import { PALETTE_COLORS } from "@/haTheme";

export const GroupLayout = () => {
  const { record: group } = useShowContext()
  const { isManager } = useRole();

  return (
    <SimpleShowLayout sx={{
      '& .RaSimpleShowLayout-stack': {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        p: 1
      },
    }}>
      <Box display="flex" alignItems="center">
        <Avatar sx={{
          bgcolor: PALETTE_COLORS.primary,
          color: PALETTE_COLORS.yellow,
          width: "8.5rem",
          height: "8.5rem",
          fontSize: "2.25rem",
          fontWeight: "bolder"
        }}>{group?.ref ?? ""}</Avatar>
        <Typography variant="h6" fontWeight="bolder" mx={3}>{group?.name}</Typography>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%" p={2}>
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="h6" fontWeight="bolder">{new Date(group?.creation_datetime ?? "").toLocaleDateString("fr-FR", {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</Typography></Box>
        <Box display="flex" justifyContent="flex-end">{isManager() && <EditButton size="large" sx={{ bgcolor: PALETTE_COLORS.yellow, color: PALETTE_COLORS.primary }} />}</Box>
      </Box>
    </SimpleShowLayout>
  );
};

const GroupShow = () => {
  return (
    <Box>
      <Show actions={false} title="Groupe" sx={{
        "& .RaShow-card": {
          borderRadius: "10px",
          marginTop: 2
        }
      }}>
        <GroupLayout />
      </Show>
      <GroupStudentList />
    </Box>
  );
};

export default GroupShow;
