import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {
  Badge as BadgeIcon,
  KeyboardArrowDown,
  Print,
  RemoveCircleOutline,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {Button, Confirm} from "react-admin";
import {
  PublicStudent,
  downloadStudentBadge,
  getStudentActiveBadge,
  removeStudentBadge,
} from "../badgeApi";

const saveFile = (data: ArrayBuffer, fileName: string) => {
  const url = window.URL.createObjectURL(
    new Blob([data], {type: "application/pdf"})
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};

export type BadgeMenuProps = {
  studentId: string;
  studentRef?: string;
};

export const BadgeMenu = ({studentId, studentRef}: BadgeMenuProps) => {
  const notify = useNotify();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeBadge, setActiveBadge] = useState<PublicStudent | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const loadActiveBadge = useCallback(
    () =>
      getStudentActiveBadge(studentId)
        .then(setActiveBadge)
        .catch(() => setActiveBadge(null)),
    [studentId]
  );

  useEffect(() => {
    // errors are handled by loadActiveBadge itself
    void loadActiveBadge();
  }, [loadActiveBadge]);

  const closeMenu = () => setAnchorEl(null);

  const print = async () => {
    closeMenu();
    setIsPrinting(true);
    notify("Génération du badge en cours...");
    try {
      const {data} = await downloadStudentBadge(studentId);
      saveFile(data, `badge-${studentRef ?? studentId}.pdf`);
      await loadActiveBadge();
    } catch {
      notify("Erreur lors de la génération du badge.", {type: "error"});
    } finally {
      setIsPrinting(false);
    }
  };

  const remove = async () => {
    setIsRemoving(true);
    try {
      await removeStudentBadge(studentId);
      setActiveBadge(null);
      notify("Badge retiré : son QR code ne fonctionne plus.", {
        type: "success",
      });
    } catch {
      notify("Erreur lors du retrait du badge.", {type: "error"});
    } finally {
      setIsRemoving(false);
      setConfirmRemove(false);
    }
  };

  return (
    <Box>
      <Button
        data-testid="badge-button"
        label="Badge"
        aria-haspopup
        aria-expanded={anchorEl ? "true" : undefined}
        disableElevation
        disabled={isPrinting || isRemoving}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="medium"
        variant="outlined"
        style={COMMON_OUTLINED_BUTTON_PROPS.style}
        endIcon={<KeyboardArrowDown />}
      >
        {isPrinting || isRemoving ? (
          <CircularProgress size={20} />
        ) : (
          <BadgeIcon />
        )}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        transformOrigin={{vertical: "top", horizontal: "right"}}
      >
        <Typography
          variant="caption"
          sx={{px: 2, py: 0.5, display: "block", color: PALETTE_COLORS.grey}}
        >
          {activeBadge
            ? `Badge actif · ${activeBadge.academic_year ?? ""}`
            : "Aucun badge actif"}
        </Typography>
        <Divider sx={{my: 0.5}} />
        <MenuItem
          onClick={print}
          disabled={!!activeBadge}
          data-testid="badge-print"
        >
          <Print sx={{mr: 1.5}} />
          Imprimer le badge
        </MenuItem>
        {activeBadge && (
          <Typography
            variant="caption"
            sx={{px: 2, display: "block", color: PALETTE_COLORS.grey}}
          >
            Retirez le badge actuel pour en imprimer un nouveau.
          </Typography>
        )}
        <MenuItem
          onClick={() => {
            closeMenu();
            setConfirmRemove(true);
          }}
          disabled={!activeBadge}
          data-testid="badge-remove"
          sx={{color: "error.main"}}
        >
          <RemoveCircleOutline sx={{mr: 1.5}} />
          Retirer le badge
        </MenuItem>
      </Menu>
      <Confirm
        isOpen={confirmRemove}
        loading={isRemoving}
        title="Retirer le badge"
        content="Le QR code du badge actuel ne fonctionnera plus (badge perdu, remplacé...). Un nouveau badge pourra être imprimé ensuite."
        confirm="Retirer"
        onConfirm={remove}
        onClose={() => setConfirmRemove(false)}
      />
    </Box>
  );
};
