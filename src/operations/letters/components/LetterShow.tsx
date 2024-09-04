import {FC} from "react";
import {Container} from "@mui/material";

import {Dialog} from "@/ui/components";
import PdfViewer from "@/operations/common/components/PdfViewer";

import {LetterShowProps} from "@/operations/letters/types";

const LetterShow: FC<LetterShowProps> = ({
  isOpen,
  onToggle,
  fileUrl,
  filename,
}) => (
  <Dialog
    open={isOpen}
    onClose={onToggle}
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

export default LetterShow;
