import {Create} from "@/operations/common/components";
import {DateTimeField} from "@/operations/common/components/fields";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {Box} from "@mui/material";
import {NumberInput, required, SimpleForm, TextInput} from "react-admin";
import {SelectCourseAssignment} from "./components/SelectCourseAssignment";
import {SelectTeacher} from "./components/SelectTeacher";

export const ExamCreate = () => {
  const {id: userId} = authProvider.getCachedWhoami();
  const {isManager, isAdmin} = useRole();
  const isPrivileged = isManager() || isAdmin();

  return (
    <Create resource="exams" title="Création d'un examen">
      <SimpleForm>
        {isPrivileged ? (
          <Box
            sx={{display: "flex", flexDirection: "column", gap: 2}}
            width={"100%"}
          >
            <SelectTeacher isPrivileged={isPrivileged} />
            <SelectCourseAssignment />
          </Box>
        ) : (
          <SelectCourseAssignment defaultTeacherId={userId!} />
        )}

        <TextInput
          source="title"
          label="Titre"
          fullWidth
          validate={required()}
          data-testid="title-input"
        />
        <NumberInput
          source="coefficient"
          label="Coefficient"
          fullWidth
          validate={required()}
          data-testid="coefficient-input"
        />
        <DateTimeField
          source="examination_date"
          label="Date de l'examen"
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
};
