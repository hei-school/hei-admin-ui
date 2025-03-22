import PdfViewer from "@/operations/common/components/PdfViewer";
import {Dialog} from "@/ui/components";

interface EventJustificateModalProps {
  open: boolean;
  onClose: () => void;
  fileUrl?: string;
  userId?: string;
  username?: string;
}

export const EventJustificateModal = ({
  open,
  onClose,
  fileUrl,
  userId,
  username,
}: EventJustificateModalProps) => {
  if (!userId || !fileUrl) {
    return null;
  }

  return (
    <Dialog
      title="Justificatif d'absence"
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <PdfViewer
        filename={`Justificatif de ${username}`}
        url={fileUrl}
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      />
    </Dialog>
  );
};
