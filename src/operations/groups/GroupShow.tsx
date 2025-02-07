import {PALETTE_COLORS} from "@/haTheme";
import {useRole} from "@/security/hooks";
import {EMPTY_TEXT} from "@/ui/constants";
import {formatDate} from "@/utils/date";
import {Avatar, Box, Typography} from "@mui/material";
import {EditButton, SimpleShowLayout, useShowContext} from "react-admin";
import {Show} from "../common/components";
import GroupStudentList from "./components/GroupStudentList";

export const GroupLayout = () => {
  const {record: group} = useShowContext();
  const {isManager, isAdmin} = useRole();

  return (
    <SimpleShowLayout
      sx={{
        "& .RaSimpleShowLayout-stack": {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          p: 1,
        },
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          sx={{
            bgcolor: PALETTE_COLORS.primary,
            color: PALETTE_COLORS.yellow,
            width: "8.5rem",
            height: "8.5rem",
            fontSize: "2.25rem",
            fontWeight: "bolder",
          }}
        >
          {group?.ref ?? ""}
        </Avatar>
        <Typography variant="h6" fontWeight="bolder" mx={3}>
          {group?.name ?? EMPTY_TEXT}
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        p={2}
      >
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="h6" fontWeight="bolder">
            {formatDate(group?.creation_datetime ?? "", false)}
          </Typography>
        </Box>
        {(isManager() || isAdmin()) && (
          <Box display="flex" justifyContent="flex-end">
            <EditButton
              size="large"
              sx={{
                bgcolor: PALETTE_COLORS.yellow,
                color: PALETTE_COLORS.primary,
              }}
            />
          </Box>
        )}
      </Box>
    </SimpleShowLayout>
  );
};

const GroupShow = () => {
  return (
    <Box>
      <Show
        actions={false}
        title="Groupe"
        sx={{
          "& .RaShow-card": {
            borderRadius: "10px",
            marginTop: 2,
          },
        }}
      >
        <GroupLayout />
      </Show>
      <GroupStudentList />
    </Box>
  );
};

export default GroupShow;
