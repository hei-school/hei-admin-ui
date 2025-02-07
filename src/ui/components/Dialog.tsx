import {PALETTE_COLORS} from "@/haTheme";
import {Close as CloseIcon} from "@mui/icons-material";
import {
  DialogContent,
  DialogTitle,
  IconButton,
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  useMediaQuery,
} from "@mui/material";

type DialogProps = Partial<MuiDialogProps> & {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onClose: () => void;
};

export function Dialog({
  children,
  open,
  title,
  onClose,
  ...dialogProps
}: DialogProps) {
  const isLarge = useMediaQuery("(min-width:1700px)");
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      sx={{
        // "zIndex": 999999,
        "& .MuiPaper-root": {boxShadow: "none"},
      }}
      fullWidth
      maxWidth={isLarge ? "md" : "sm"}
      {...dialogProps}
    >
      <DialogTitle
        variant="h2"
        sx={{
          bgcolor: PALETTE_COLORS.primary,
          fontSize: "18px",
          color: "white",
          display: "flex",
          py: 1,
          alignItems: "center",
          justifyContent: "space-between",
          opacity: 0.9,
        }}
      >
        {open && (
          <>
            {title}
            <IconButton sx={{color: "white", m: 0}} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </>
        )}
      </DialogTitle>
      <DialogContent sx={{p: 0}}>{open && children}</DialogContent>
    </MuiDialog>
  );
}
