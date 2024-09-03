import {FC} from "react";
import {Dialog} from "@/ui/components";
import {Container} from "@mui/material";
import PdfViewer from "@/operations/common/components/PdfViewer";

interface LetterShowProps {
  isOpen: boolean;
  toggle: () => void;
  fileUrl: string;
  filename: string;
}
const LetterShow: FC<LetterShowProps> = ({
  isOpen,
  toggle,
  fileUrl,
  filename,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={toggle}
      title="Détails de la lettre"
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Container fixed>
        <PdfViewer
          isPending={false}
          url={fileUrl}
          filename={filename}
          style={{
            marginTop: "10px",
          }}
        />
      </Container>
    </Dialog>
  );
};
export default LetterShow;
