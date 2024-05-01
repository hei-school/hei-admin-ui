import {PALETTE_COLORS} from "@/ui/constants";
import {Dialog, DialogTitle, DialogContent} from "@mui/material";

type PromotionDialogProps = {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onClose: () => void;
};

export function PromotionDialog({
  children,
  open,
  title,
  onClose,
}: PromotionDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "zIndex": 999999,
        "& .MuiPaper-root": {boxShadow: "none"},
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        variant="h2"
        sx={{
          bgcolor: PALETTE_COLORS.primary,
          fontSize: "18px",
          color: "white",
          opacity: 0.9,
        }}
      >
        {open && title}
      </DialogTitle>
      <DialogContent sx={{p: 0}}>{open && children}</DialogContent>
    </Dialog>
  );
}
