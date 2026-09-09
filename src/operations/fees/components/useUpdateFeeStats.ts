import {useNotify} from "@/hooks";
import {payingApi} from "@/providers/api";
import {useState} from "react";
import {useQueryClient} from "react-query";

const STATS_QUERY_KEY = "stats";

export const useUpdateFeeStats = () => {
  const notify = useNotify();
  const queryClient = useQueryClient();
  const [isUpdating, setUpdating] = useState(false);

  const updateStats = async () => {
    setUpdating(true);
    try {
      await payingApi().updateAdvancedFeeStats();
      await queryClient.invalidateQueries(STATS_QUERY_KEY);
      notify("Recalcul des statistiques lancé.", {type: "info"});
    } catch (error) {
      console.error(error);
      notify(
        "Une erreur s'est produite lors de la mise à jour des statistiques.",
        {type: "error"}
      );
    } finally {
      setUpdating(false);
    }
  };

  return {isUpdating, updateStats};
};
