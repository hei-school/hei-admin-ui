import {AddComment, Edit, Visibility} from "@mui/icons-material";
import {Box, IconButton, Tooltip} from "@mui/material";

export const CorButtonAction = () => {
  return (
    <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}>
      <Tooltip title="Voir détails">
        <IconButton size="small">
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Éditer">
        <IconButton size="small">
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ajouter un commentaire">
        <IconButton size="small">
          <AddComment fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
