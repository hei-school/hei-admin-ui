import {Edit, PersonOutline} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {FC} from "react";

interface Student {
  std: string;
  nom: string;
  prenom: string;
  note: number;
}

interface GradeDetailsTableProps {
  students: Student[];
}

const getGradeColor = (note: number) => {
  if (note >= 16) return "success";
  if (note >= 14) return "info";
  if (note >= 12) return "warning";
  return "error";
};

export const GradeDetailsTable: FC<GradeDetailsTableProps> = ({students}) => {
  return (
    <Card>
      <Box sx={{p: 3, borderBottom: 1, borderColor: "divider"}}>
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <PersonOutline />
          <Typography variant="h6" component="h2">
            Détails des notes de l'examen
          </Typography>
        </Box>
        <CardContent sx={{p: 0}}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STD</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow
                    key={index}
                    sx={{"&:hover": {backgroundColor: "action.hover"}}}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        fontWeight="medium"
                      >
                        {student.std}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {student.nom}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{student.prenom}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${student.note}/20`}
                        color={getGradeColor(student.note) as any}
                        variant="filled"
                        size="small"
                        sx={{fontWeight: "bold"}}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                      >
                        Mettre à jour
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Box>
    </Card>
  );
};
