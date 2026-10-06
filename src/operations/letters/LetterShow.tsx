import {Container} from "@mui/material";

import PdfViewer from "@/operations/common/components/PdfViewer";
import {LetterShowProps} from "@/operations/letters/types";
import {Dialog} from "@/ui/components";

const LetterShow = ({
  isOpen,
  onClose,
  fileUrl,
  filename,
}: Readonly<LetterShowProps>) => (
  <Dialog open={isOpen} onClose={onClose} title="Détails de la lettre">
    <Container fixed>
      <PdfViewer
        isPending={false}
        url={fileUrl}
        filename={filename}
        style={{marginTop: "10px"}}
      />
    </Container>
  </Dialog>
);

export default LetterShow;
