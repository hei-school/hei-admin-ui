import {useNotify} from "@/hooks";
import {payingApi} from "@/providers/api";
import {Button} from "@mui/material";
import {RefreshCw} from "lucide-react";
import {useState} from "react";
import {useRefresh} from "react-admin";
import {UPDATE_STATS_BUTTON_SX} from "./StyleFeeStat";

const updateAdvancedFeeStats = () => payingApi().updateAdvancedFeeStats();

export const UpdateStatsButton = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [isUpdating, setUpdating] = useState(false);

  const updateStats = async () => {
    setUpdating(true);
    try {
      await updateAdvancedFeeStats();
      notify("Statistiques mises à jour.", {type: "success"});
      refresh();
    } catch (error) {
      console.error(error);
      notify(
        "Une erreur s'est produite lors de la mise à jour des statistiques.",
        {
          type: "error",
        }
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Button
      onClick={updateStats}
      disabled={isUpdating}
      variant="outlined"
      size="small"
      startIcon={<RefreshCw size={13} />}
      sx={UPDATE_STATS_BUTTON_SX}
    >
      {isUpdating ? "Mise à jour..." : "Mettre à jour les stats"}
    </Button>
  );
};
