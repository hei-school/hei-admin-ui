import {PALETTE_COLORS} from "@/haTheme";
import {Dialog, DialogContent, DialogProps, DialogTitle} from "@mui/material";

export type FlowsDialogProps = DialogProps & {
  title: string;
};

export function FlowsDialog({
  children,
  title,
  ...dialogProps
}: FlowsDialogProps) {
  return (
    <Dialog maxWidth="sm" fullWidth {...dialogProps}>
      <DialogTitle
        variant="h2"
        sx={{
          bgcolor: PALETTE_COLORS.primary,
          opacity: 0.9,
          color: PALETTE_COLORS.white,
          py: 2,
          fontSize: "18px",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
