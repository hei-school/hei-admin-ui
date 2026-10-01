import {useNotify} from "@/hooks";
import {QrCodeScanner} from "@mui/icons-material";
import {Box, Paper, Stack, Typography} from "@mui/material";
import {Title} from "react-admin";
import {useNavigate} from "react-router-dom";
import {getStudentByPublicId, httpStatusOf} from "./badgeApi";
import {BadgeScanner} from "./components/BadgeScanner";

export const ScanBadgePage = () => {
  const navigate = useNavigate();
  const notify = useNotify();

  const onScan = async (publicId: string) => {
    try {
      const {id} = await getStudentByPublicId(publicId);
      navigate(`/students/${id}/show?tab=fees`);
    } catch (error) {
      notify(
        httpStatusOf(error) === 404
          ? "Ce badge n'existe pas."
          : "Impossible de lire le badge, réessayez.",
        {type: "error"}
      );
    }
  };

  return (
    <Box p={2} display="flex" justifyContent="center">
      <Title title="Scanner un badge" />
      <Paper sx={{width: "100%", maxWidth: 480, p: 3}}>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <QrCodeScanner color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Scanner un badge
          </Typography>
        </Stack>
        <BadgeScanner onScan={onScan} />
      </Paper>
    </Box>
  );
};
