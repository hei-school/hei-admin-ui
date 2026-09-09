import {Button} from "@mui/material";
import {RefreshCw} from "lucide-react";
import {UPDATE_STATS_BUTTON_SX} from "./StyleFeeStat";

type UpdateStatsButtonProps = {
  isUpdating: boolean;
  onUpdate: () => void;
};

export const UpdateStatsButton = ({
  isUpdating,
  onUpdate,
}: UpdateStatsButtonProps) => (
  <Button
    onClick={onUpdate}
    disabled={isUpdating}
    variant="outlined"
    size="small"
    startIcon={<RefreshCw size={13} />}
    sx={UPDATE_STATS_BUTTON_SX}
  >
    {isUpdating ? "Mise à jour..." : "Mettre à jour les stats"}
  </Button>
);
