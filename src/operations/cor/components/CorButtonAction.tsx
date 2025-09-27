import {AddComment, Edit, SafetyDivider} from "@mui/icons-material";
import {alpha, Box, IconButton, Tooltip, Typography} from "@mui/material";
import {ShowDialog} from "@react-admin/ra-form-layout";
import {ShowButton} from "react-admin";
import {CorDetails} from "./CorDetails";

export const CorButtonAction = () => {
  return (
    <>
      <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}>
        <ShowButton
          label=" "
          sx={{
            fontSize: 5,
          }}
        />
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

      <ShowDialog
        title={<ShowDialogTitle title="Détails du COR" />}
        PaperProps={{
          sx: {
            background: "#f9f6fd",
          },
        }}
      >
        <CorDetails />
      </ShowDialog>
    </>
  );
};

const ShowDialogTitle = ({title}: {title: string}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderBottom: "1px solid #ccc",
        padding: 1,
      }}
    >
      <SafetyDivider
        sx={{
          fontSize: "2rem ",
          color: "blue",
          background: alpha("rgba(0, 204, 255, 0.45)", 0.15),
          padding: 0.5,
          borderRadius: "50%",
        }}
      />
      <Box>
        <Typography variant="h4" fontWeight="700" fontSize={20}>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};
