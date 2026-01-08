import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

type ImportResultDialogProps = {
  open: boolean;
  onClose: () => void;
  importResult: any;
};

export const ImportResultDialog = ({
  open,
  onClose,
  importResult,
}: ImportResultDialogProps) => {
  if (!importResult?.importGradeStats?.invalidRows) {
    return null;
  }

  const {importGradeStats, invalidGrades} = importResult;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{bgcolor: "#001948", color: "white", fontSize: "18px"}}>
        Les import invalides
        <IconButton
          onClick={onClose}
          sx={{position: "absolute", right: 8, top: 8, color: "white"}}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{mt: 2}}>
        <Alert severity="warning" sx={{mb: 2}}>
          <AlertTitle>Attention</AlertTitle>
          {importGradeStats.invalidRows} ligne(s) invalide(s) sur{" "}
          {importGradeStats.totalRows}
        </Alert>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Référence</strong>
                </TableCell>
                <TableCell>
                  <strong>Note</strong>
                </TableCell>
                <TableCell>
                  <strong>Erreur</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invalidGrades.map((grade: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{grade.ref}</TableCell>
                  <TableCell>{grade.score ?? "-"}</TableCell>
                  <TableCell sx={{color: "error.main"}}>
                    {grade.reason}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="caption"
          sx={{display: "block", mt: 2, color: "text.secondary"}}
        >
          {importGradeStats.validRows} ligne(s) valide(s) ont été importées avec
          succès.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
