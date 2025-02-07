import {PALETTE_COLORS} from "@/haTheme";
import {
  CircularProgress,
  Button as MuiButton,
  DialogActions as MuiDialogActions,
} from "@mui/material";
import {useResourceFlowsContext} from "../useResourceFlowsContext";

export function DialogActions() {
  const {isLoading} = useResourceFlowsContext();
  return (
    <MuiDialogActions>
      <MuiButton
        type="submit"
        fullWidth
        sx={{
          "bgcolor": PALETTE_COLORS.primary,
          "color": PALETTE_COLORS.white,
          "transition": "all .5s linear",
          "opacity": 0.9,
          "m": 0,
          "&:hover": {
            bgcolor: PALETTE_COLORS.primary,
            opacity: 1,
          },
        }}
        disabled={isLoading}
        data-testid="save-flows-button"
      >
        {isLoading ? <CircularProgress size={25} /> : "Envoyer"}
      </MuiButton>
    </MuiDialogActions>
  );
}
