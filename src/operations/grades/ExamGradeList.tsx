import {HaList} from "@/ui/haList";
import {Book} from "@mui/icons-material";
import {Box} from "@mui/material";
import {TextField} from "react-admin";

export const ExamGradeList = () => {
  return (
    <Box>
      <HaList
        icon={<Book />}
        resource="exams"
        title="Liste des participants à l'examen Test"
        datagridProps={{
          rowClick: false,
        }}
        actions={false}
      >
        <TextField source="ref" label="Référence" />
        <TextField source="last_name" label="Nom" />
        <TextField source="first_name" label="Prénom(s)" />
        <TextField source="score" label="Note" />
        <TextField source="created_at" label="Créée le" />
        <TextField source="updated_at" label="Mis à jour le" />
      </HaList>
    </Box>
  );
};
