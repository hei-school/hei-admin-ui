import { Dialog, DialogTitle, DialogContent } from "@mui/material"

type PromotionDialogProps = {
  children: React.ReactNode,
  open: boolean,
  title: string,
  onClose: () => void,
}
export function PromotionDialog({ children, open, title, onClose }: PromotionDialogProps) {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 999999,
        "& .MuiPaper-root": { boxShadow: "none" }
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle variant="h2" sx={{ fontSize: "18px", fontWeight: "bold", opacity: .9 }}>
        {open && title}
      </DialogTitle>
      <DialogContent>
        {open && children}
      </DialogContent>
    </Dialog>
  );
}
