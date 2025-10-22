import {HaList} from "@/ui/haList";
import {AssignmentLate} from "@mui/icons-material";
import {TextField} from "react-admin";
import {Buttons} from "./components/Buttons";

export const CancellationRetakeExam = () => {
  return (
    <HaList
      resource="RetakeExams"
      title="Demandes d'annulation de rattrapage"
      actions={undefined}
      datagridProps={{rowClick: false}}
      listProps={{
        title: "Rattrapages à annuler",
        filter: {status: "TO_CANCEL"},
      }}
      icon={<AssignmentLate />}
    >
      <TextField resource="student_identifier.first_name" label="Nom" />
      <TextField resource="student_identifier.last_name" label="Prénom" />
      <TextField resource="student_identifier.ref" label="STD" />
      <TextField resource="course.code" label="Matiere" />
      <Buttons />
    </HaList>
  );
};
