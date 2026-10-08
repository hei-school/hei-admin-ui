import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {Badge} from "@mui/icons-material";
import {Button, CircularProgress} from "@mui/material";
import {useState} from "react";
import {downloadGroupBadges} from "../badgeApi";

export type GroupBadgesButtonProps = {
  groupId: string;
  groupRef: string;
};

const resultMessage = (students: number, files: number) => {
  if (students === 0) return "Aucun étudiant du groupe n'est encore à l'école.";
  if (files === 0)
    return "Aucun badge généré : tous les étudiants du groupe ont déjà un badge actif.";
  return files === 1
    ? "Badges générés."
    : `${files} fichiers de badges générés.`;
};

export const GroupBadgesButton = ({
  groupId,
  groupRef,
}: Readonly<GroupBadgesButtonProps>) => {
  const notify = useNotify();
  const [isPrinting, setIsPrinting] = useState(false);

  const print = async () => {
    setIsPrinting(true);
    notify("Génération des badges en cours...");
    try {
      const {students, files} = await downloadGroupBadges(groupId, groupRef);
      notify(resultMessage(students, files), {
        type: files > 0 ? "success" : "warning",
      });
    } catch {
      notify("Erreur lors de la génération des badges.", {type: "error"});
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Button
      data-testid="group-badges-download"
      size="large"
      disabled={isPrinting}
      onClick={print}
      startIcon={
        isPrinting ? <CircularProgress size={18} color="inherit" /> : <Badge />
      }
      sx={{
        "bgcolor": PALETTE_COLORS.primary,
        "color": PALETTE_COLORS.white,
        "&:hover": {
          bgcolor: PALETTE_COLORS.primary,
          color: PALETTE_COLORS.white,
          opacity: 0.85,
        },
        "&.Mui-disabled": {
          bgcolor: PALETTE_COLORS.primary,
          color: PALETTE_COLORS.white,
          opacity: 0.7,
        },
      }}
    >
      Imprimer les badges
    </Button>
  );
};
