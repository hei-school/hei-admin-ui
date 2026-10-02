import {PALETTE_COLORS} from "@/haTheme";
import {downloadGroupBadges} from "@/operations/badges/badgeApi";
import {FileDownloader} from "@/operations/common/components/FileDownloader";
import {useRole} from "@/security/hooks";
import {EMPTY_TEXT} from "@/ui/constants";
import {formatDate} from "@/utils/date";
import {Badge} from "@mui/icons-material";
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
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <FileDownloader
              downloadFunction={() => downloadGroupBadges(group?.id ?? "")}
              fileName={`badges-${group?.ref ?? "groupe"}.pdf`}
              buttonText="Imprimer les badges"
              startIcon={<Badge />}
              successMessage="Génération des badges en cours..."
              errorMessage="Aucun badge généré : tous les étudiants du groupe ont déjà un badge actif, ou une erreur est survenue."
              data-testid="group-badges-download"
              size="large"
              sx={{
                "bgcolor": PALETTE_COLORS.primary,
                "color": PALETTE_COLORS.white,
                "&:hover": {
                  bgcolor: PALETTE_COLORS.primary,
                  color: PALETTE_COLORS.white,
                  opacity: 0.85,
                },
              }}
            />
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
