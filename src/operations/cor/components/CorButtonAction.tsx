import {SafetyDivider} from "@mui/icons-material";
import {alpha, Box, Typography} from "@mui/material";
import {ShowDialog} from "@react-admin/ra-form-layout";
import {ShowButton} from "react-admin";
import {CorDetails} from "../CorDetails";
import {CorEditButton} from "../CorEditButton";
import {AddCorComment} from "./AddCorComment";

export const CorButtonAction = () => {
  return (
    <>
      <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}>
        <ShowButton
          data-testid="show-button"
          label=" "
          sx={{
            fontSize: 5,
          }}
        />
        <CorEditButton />
        <AddCorComment islist={true} />
      </Box>
      <ShowDialog
        maxWidth="md"
        title={<ShowDialogTitle title="Détails du COR" />}
        PaperProps={{
          sx: {
            background: "#f9f6fd",
            width: "70vw",
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
