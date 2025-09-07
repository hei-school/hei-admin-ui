import {Create} from "@/operations/common/components";
import {DateTimeField} from "@/operations/common/components/fields";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {Box, Typography} from "@mui/material";
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
        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
          <Typography variant="body2" color="text.secondary">
            Coefficient (fraction)
          </Typography>
          <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
            <NumberInput
              source="coefficient.numerator"
              label="Numérateur"
              validate={required()}
              data-testid="coefficient-numerator-input"
              sx={{flex: 1}}
            />
            <Typography variant="h6">/</Typography>
            <NumberInput
              source="coefficient.denominator"
              label="Dénominateur"
              validate={required()}
              data-testid="coefficient-denominator-input"
              sx={{flex: 1}}
            />
          </Box>
        </Box>
        <DateTimeField
          source="examination_date"
          label="Date de l'examen"
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
};
